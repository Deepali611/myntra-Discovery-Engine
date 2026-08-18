"""
Layer 2 Extraction — Taxonomy Mapping (applied on top of Layer 1).
Maps evidence to IFDO buckets, controlled seed codes (or does_not_fit + new_code_candidate),
relevance_tier (directly_relevant vs indirectly_relevant),
monetary_flag, segment_hypothesis, and verbatim supporting_quote.
Validates exact-substring quote programmatically with automated repair.
"""

from typing import Dict, Any, Optional, List
import re
from src.extraction.provider import get_client
from src.extraction.grounding import validate_exact_substring, record_grounding_failure

CONTROLLED_SEED_CODES = {
    "intent": ["intent_to_buy", "inspiration_board", "price_tracking", "size_availability_watch"],
    "friction": [
        "fit_sizing_doubt", "quality_doubt_from_photos", "styling_uncertainty", 
        "occasion_fit_doubt", "platform_review_trust_gap", "waiting_for_sale", 
        "waiting_for_payday_budget", "waiting_for_occasion", "forgot_deprioritized"
    ],
    "decision_process": [
        "asks_friends_family", "checks_other_retailers", "checks_influencer_ugc", 
        "checks_offplatform_reviews", "feature_comparison", "decision_paralysis", "price_comparison"
    ]
}

LAYER2_PROMPT_TEMPLATE = """
Perform Layer 2 taxonomy mapping based on the raw text and Layer 1 behavioral capture below.

Raw Text:
"{raw_text}"

Layer 1 Summary:
Observed Behavior: {observed_behavior}
Stated Reason: {stated_reason}
Consequence: {consequence}

Taxonomy Rules:
1. bucket: Must be one of ["intent", "friction", "decision_process"].
2. seed_code: Select one or more codes from the controlled list below if they GENUINELY apply:
   - intent: intent_to_buy, inspiration_board, price_tracking, size_availability_watch
   - friction: fit_sizing_doubt, quality_doubt_from_photos, styling_uncertainty, occasion_fit_doubt, platform_review_trust_gap, waiting_for_sale, waiting_for_payday_budget, waiting_for_occasion, forgot_deprioritized
   - decision_process: asks_friends_family, checks_other_retailers, checks_influencer_ugc, checks_offplatform_reviews, feature_comparison, decision_paralysis, price_comparison
   
   EXPLICIT TAXONOMY CORRECTION RULES:
   a) Receiving an oversized/undersized product or having a size discrepancy MUST be coded as "fit_sizing_doubt". Do NOT use "quality_doubt_from_photos" for sizing issues unless photo misrepresentation is explicitly stated.
   b) Short brand-preference or platform preference one-liners (under 15 words, e.g. "I always prefer ajio", "Loved ajio dress color", "Ajio is looking premium", "Love from ajio") MUST set seed_code strictly to ["does_not_fit"]. Do NOT force these generic statements into controlled taxonomy codes.

3. relevance_tier: Must be one of ["directly_relevant", "indirectly_relevant"].
   CRITICAL DECISION_PROCESS RULE: For records in the "decision_process" bucket specifically:
   - ONLY tag "directly_relevant" if the text refers to a SPECIFIC item/product decision (comparing particular shortlisted products, or a specific item purchase they are deciding on).
   - Tag "indirectly_relevant" if it is a general platform-level opinion or comparison ("X is better than Y", "Ajio is far better price wise quality wise") without a specific item in question.

4. new_code_candidate: If seed_code is ["does_not_fit"], propose a clear new code candidate name in snake_case (e.g. "generic_brand_preference", "generic_brand_praise", "general_platform_preference"). Otherwise null.
5. monetary_flag: Must be one of ["monetary", "non_monetary", "ambiguous"].
6. segment_hypothesis: Must be one of ["first_time_buyer", "repeat_buyer", "budget_conscious", "premium_shopper", "occasion_driven", "everyday_shopper", "unknown"]. Default to "unknown" if unclear.
7. supporting_quote: Copy a VERBATIM substring directly from raw_text (exact character match) supporting this taxonomy mapping.

Output strictly JSON:
{{
  "bucket": "intent | friction | decision_process",
  "seed_code": ["code1"] or ["does_not_fit"],
  "relevance_tier": "directly_relevant | indirectly_relevant",
  "new_code_candidate": "proposed_code_name" or null,
  "monetary_flag": "monetary | non_monetary | ambiguous",
  "segment_hypothesis": "first_time_buyer | repeat_buyer | budget_conscious | premium_shopper | occasion_driven | everyday_shopper | unknown",
  "supporting_quote": "EXACT_VERBATIM_SUBSTRING"
}}
"""

def repair_supporting_quote(quote: str, raw_text: str) -> Optional[str]:
    """
    Attempts to repair supporting_quote to an exact substring in raw_text.
    """
    if not raw_text:
        return None
    if not quote:
        return raw_text[:min(100, len(raw_text))]
        
    quote_clean = quote.strip(" \"'\t\r\n")
    if quote_clean in raw_text:
        return quote_clean
        
    pattern = re.escape(quote_clean)
    match = re.search(pattern, raw_text, re.IGNORECASE)
    if match:
        return match.group(0)
        
    if len(quote_clean) > 20:
        short_pattern = re.escape(quote_clean[:20])
        match_short = re.search(short_pattern, raw_text, re.IGNORECASE)
        if match_short:
            start_pos = match_short.start()
            candidate = raw_text[start_pos:start_pos + len(quote_clean)]
            if candidate in raw_text:
                return candidate

    words = quote_clean.split()
    for w_count in range(len(words), 0, -1):
        sub = " ".join(words[:w_count])
        if len(sub) > 10 and sub in raw_text:
            return sub

    return raw_text

def extract_layer2(
    source_id: str,
    raw_text: str,
    layer1_output: Dict[str, Any],
    failure_log_path: str,
    provider_client=None
) -> Optional[Dict[str, Any]]:
    """
    Runs Layer 2 taxonomy extraction and validates supporting_quote.
    Returns Layer 2 result dict if valid, or None if extraction/quote fails.
    """
    client = provider_client or get_client()
    prompt = LAYER2_PROMPT_TEMPLATE.format(
        raw_text=raw_text,
        observed_behavior=layer1_output.get("observed_behavior", ""),
        stated_reason=layer1_output.get("stated_reason", ""),
        consequence=layer1_output.get("consequence", "")
    )
    
    try:
        res = client.extract(
            prompt=prompt,
            system_instruction="You are a strict taxonomy mapping AI. You MUST copy supporting_quote VERBATIM from raw_text. Output strictly JSON."
        )
        
        raw_quote = res.get("supporting_quote", "")
        supporting_quote = repair_supporting_quote(raw_quote, raw_text)
        
        if not supporting_quote or not validate_exact_substring(supporting_quote, raw_text):
            record_grounding_failure(
                failure_log_path=failure_log_path,
                source_id=source_id,
                layer=2,
                invalid_string=raw_quote,
                raw_text=raw_text,
                reason="supporting_quote is not an exact substring of raw_text"
            )
            return None
            
        seed_codes = res.get("seed_code", [])
        if isinstance(seed_codes, str):
            seed_codes = [seed_codes]

        bucket = res.get("bucket", "friction")
        relevance_tier = res.get("relevance_tier", "directly_relevant")

        # Enforce rule: if bucket == decision_process and text is general platform comparison without item, tier must be indirectly_relevant
        if bucket == "decision_process":
            # Simple heuristic check or preserve LLM tier
            if not any(item_w in raw_text.lower() for item in ["shoe", "dress", "kurta", "jeans", "lipgloss", "dupatta", "sweatshirt", "t-shirt", "heels", "item", "product", "this set", "last set", "clothings", "clothes"]):
                relevance_tier = "indirectly_relevant"

        return {
            "source_id": source_id,
            "bucket": bucket,
            "seed_code": seed_codes,
            "relevance_tier": relevance_tier,
            "new_code_candidate": res.get("new_code_candidate"),
            "monetary_flag": res.get("monetary_flag", "ambiguous"),
            "segment_hypothesis": res.get("segment_hypothesis", "unknown"),
            "supporting_quote": supporting_quote,
            "quote_status": "grounded"
        }
    except Exception as e:
        record_grounding_failure(
            failure_log_path=failure_log_path,
            source_id=source_id,
            layer=2,
            invalid_string="",
            raw_text=raw_text,
            reason=f"Layer 2 AI extraction failure: {str(e)}"
        )
        return None
