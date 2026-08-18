"""
Stage A — High-Recall Semantic Candidate Gate
Captures broad natural-language signals across:
- Wishlist / save / shortlist behavior
- Purchase hesitation / postponement / price-drop waiting
- Product-vs-product comparison / trade-off choice
- External research / third-party reviews / platform trust
- Fit / size / body suitability (bust, waist, sleeve, wide feet)
- Styling / occasion suitability
- Photo vs fabric quality / translucency uncertainty

Excludes pure delivery/courier issues, app crashes, and refund disputes.
Does NOT require literal words like 'Myntra' or 'wishlist'.
"""

from typing import Dict, Any, List

SEMANTIC_CANDIDATE_TERMS = [
    # Wishlist / Save / Shortlist
    "wishlist", "wishlisted", "saved", "save for later", "shortlist", "shortlisted", "favorite", "cart",
    # Postponement / Sale Waiting
    "waiting for sale", "price drop", "kept in wishlist", "kept in shortlist", "bought after", "payday",
    # Comparison & Choice
    "vs", "versus", "comparing", "compared", "this or that", "help me choose", "confused between",
    "official website vs", "ajio vs", "myntra vs", "flipkart vs", "snitch's price", "better option",
    # Research / Reviews / Trust
    "review", "reviews", "ratings", "trusted", "trust nykaa", "checked before buying", "worth buying",
    "platform fee", "cancel karoge", "fake or real", "genuine",
    # Fit & Sizing & Body Suitability
    "size", "fit", "fitting", "bust", "waist", "sleeve", "sleeves", "wide feet", "runs small", "true to size",
    "should i size up", "size chart", "size guide", "inch tape", "measurements",
    # Styling & Occasion
    "occasion", "wedding outfit", "festival", "suitable for", "will this look good", "wear for",
    # Quality & Photo Discrepancy
    "fabric", "quality", "translucent", "paper thin", "photo vs", "darker than shown", "color in reality",
    "material", "cheap material"
]

EXCLUDE_NOISE_TERMS = [
    "customer care", "delivery boy", "courier boy", "app crash", "refund status", "otp not received"
]

def evaluate_stage_a(text: str, source_role: str = "primary", is_myntra_specific_query: bool = False) -> Dict[str, Any]:
    """
    High-Recall Candidate Gate. Evaluates text for natural-language fashion decision signals.
    """
    if not text or not isinstance(text, str):
        return {"stage_a_status": "fail", "score": 0.0, "matched_terms": {}}

    text_lower = text.lower()

    # Reject obvious service/app bug noise
    if any(k in text_lower for k in EXCLUDE_NOISE_TERMS):
        return {
            "stage_a_status": "fail",
            "score": 0.0,
            "matched_terms": {"fail_reason": ["pure_service_or_technical_noise"]}
        }

    matched = [term for term in SEMANTIC_CANDIDATE_TERMS if term in text_lower]

    if matched or len(text_lower.split()) >= 12:
        return {
            "stage_a_status": "pass",
            "score": 2.5,
            "matched_terms": {"semantic_matches": matched if matched else ["length_candidate"]}
        }

    return {
        "stage_a_status": "fail",
        "score": 0.0,
        "matched_terms": {"fail_reason": ["missing_semantic_fashion_decision_signal"]}
    }
