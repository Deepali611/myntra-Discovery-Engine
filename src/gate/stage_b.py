"""
Stage B — Borderline Semantic Check (AI call, subset only)
Runs strictly on records classified as 'borderline' in Stage A (score 0.5 to 1.99).
"""

from typing import Dict, Any
from src.extraction.provider import get_client

STAGE_B_PROMPT_TEMPLATE = """
Evaluate whether the following user feedback/review/post text contains relevant consumer intent, reasoning, friction, or decision context related to saving, wishlisting, evaluating, sizing, comparing, or purchasing fashion products on Myntra or competing e-commerce platforms.

Text:
"{text}"

Output strictly valid JSON with this format:
{{
  "is_relevant": true or false,
  "reasoning": "One concise sentence explaining why this text is or is not relevant to fashion e-commerce shopping intent/friction."
}}
"""

def evaluate_stage_b(text: str, provider_client=None) -> Dict[str, Any]:
    """
    Calls AI provider to perform semantic relevance evaluation on borderline records.
    Returns {stage_b_status: "pass" | "fail", reasoning: str}
    """
    client = provider_client or get_client()
    prompt = STAGE_B_PROMPT_TEMPLATE.format(text=text)
    
    try:
        res = client.extract(
            prompt=prompt,
            system_instruction="You are a strict data relevance evaluator for e-commerce fashion discovery. Output only valid JSON with 'is_relevant' boolean and 'reasoning' string."
        )
        is_relevant = res.get("is_relevant", False)
        reasoning = res.get("reasoning", "No reasoning provided.")
        
        return {
            "stage_b_status": "pass" if is_relevant else "fail",
            "reasoning": reasoning
        }
    except Exception as e:
        return {
            "stage_b_status": "fail",
            "reasoning": f"Stage B evaluation error: {str(e)}"
        }
