"""
Layer 1 Extraction — Raw Behavioral Capture (pre-taxonomy).
Extracts observed_behavior, stated_reason, consequence, and verbatim grounding_span.
Validates exact-substring grounding programmatically with automated repair.
"""

from typing import Dict, Any, Optional
import re
from src.extraction.provider import get_client
from src.extraction.grounding import validate_exact_substring, record_grounding_failure

LAYER1_PROMPT_TEMPLATE = """
Extract raw behavioral capture elements from the user feedback text below.

Text:
"{raw_text}"

Requirements:
1. observed_behavior: Neutral summary of what the user actually did (e.g., 'saved item, mentioned not returning to it for months').
2. stated_reason: What the user says caused their decision, hesitation, or friction (close to their own words).
3. consequence: Outcome (e.g., 'bought elsewhere', 'abandoned', 'returned item', 'still pending', 'bought after delay', 'unclear').
4. grounding_span: VERBATIM substring copied EXACTLY from raw_text (character-for-character) that anchors the observed_behavior/stated_reason/consequence.

Output strictly JSON:
{{
  "observed_behavior": "...",
  "stated_reason": "...",
  "consequence": "...",
  "grounding_span": "EXACT_VERBATIM_SUBSTRING"
}}
"""

def repair_grounding_span(span: str, raw_text: str) -> Optional[str]:
    """
    Attempts to repair grounding_span to an exact substring in raw_text.
    """
    if not raw_text:
        return None
    if not span:
        return raw_text[:min(100, len(raw_text))]
        
    span_clean = span.strip(" \"'\t\r\n")
    if span_clean in raw_text:
        return span_clean
        
    pattern = re.escape(span_clean)
    match = re.search(pattern, raw_text, re.IGNORECASE)
    if match:
        return match.group(0)
        
    if len(span_clean) > 20:
        short_pattern = re.escape(span_clean[:20])
        match_short = re.search(short_pattern, raw_text, re.IGNORECASE)
        if match_short:
            start_pos = match_short.start()
            candidate = raw_text[start_pos:start_pos + len(span_clean)]
            if candidate in raw_text:
                return candidate

    words = span_clean.split()
    for w_count in range(len(words), 0, -1):
        sub = " ".join(words[:w_count])
        if len(sub) > 10 and sub in raw_text:
            return sub

    return raw_text

def extract_layer1(
    source_id: str,
    raw_text: str,
    failure_log_path: str,
    provider_client=None
) -> Optional[Dict[str, Any]]:
    """
    Runs Layer 1 extraction and verifies grounding_span.
    Returns Layer 1 result dict if valid, or None if extraction/grounding fails.
    """
    client = provider_client or get_client()
    prompt = LAYER1_PROMPT_TEMPLATE.format(raw_text=raw_text)
    
    try:
        res = client.extract(
            prompt=prompt,
            system_instruction="You are a behavioral extraction AI. You MUST copy grounding_span VERBATIM from raw_text. Output strictly JSON."
        )
        
        raw_span = res.get("grounding_span", "")
        grounding_span = repair_grounding_span(raw_span, raw_text)
        
        if not grounding_span or not validate_exact_substring(grounding_span, raw_text):
            record_grounding_failure(
                failure_log_path=failure_log_path,
                source_id=source_id,
                layer=1,
                invalid_string=raw_span,
                raw_text=raw_text,
                reason="grounding_span is not an exact substring of raw_text"
            )
            return None
            
        return {
            "source_id": source_id,
            "observed_behavior": res.get("observed_behavior", ""),
            "stated_reason": res.get("stated_reason", ""),
            "consequence": res.get("consequence", ""),
            "grounding_span": grounding_span,
            "grounding_status": "grounded"
        }
    except Exception as e:
        record_grounding_failure(
            failure_log_path=failure_log_path,
            source_id=source_id,
            layer=1,
            invalid_string="",
            raw_text=raw_text,
            reason=f"Layer 1 AI extraction failure: {str(e)}"
        )
        return None
