"""
Grounding and Quote Validation Module.
Enforces non-negotiable exact-substring checking for Layer 1 grounding_span and Layer 2 supporting_quote.
"""

from typing import Dict, Any, List, Optional
import os
import json

def validate_exact_substring(substring: str, raw_text: str) -> bool:
    """
    Checks if substring is non-empty and an exact substring of raw_text.
    """
    if not substring or not isinstance(substring, str):
        return False
    if not raw_text or not isinstance(raw_text, str):
        return False
    return substring in raw_text

def record_grounding_failure(
    failure_log_path: str,
    source_id: str,
    layer: int,
    invalid_string: str,
    raw_text: str,
    reason: str
) -> Dict[str, Any]:
    """
    Logs a grounding failure to grounding_failures.json.
    """
    failure_entry = {
        "source_id": source_id,
        "layer": layer,
        "invalid_string": invalid_string,
        "raw_text_snippet": raw_text[:150] + "..." if len(raw_text) > 150 else raw_text,
        "reason": reason
    }
    
    existing = []
    if os.path.exists(failure_log_path):
        try:
            with open(failure_log_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception:
            existing = []
            
    existing.append(failure_entry)
    
    os.makedirs(os.path.dirname(failure_log_path), exist_ok=True)
    with open(failure_log_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2)
        
    return failure_entry
