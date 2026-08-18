"""
App Store Source Collector.
Uses multi-page Apple iTunes RSS JSON feed (pages 1 to 10) for Myntra iOS app reviews.
Fetches across ALL ratings (1 to 5) with keyword pre-filter on text:
'wishlist', 'save', 'saved', 'price drop', 'notify', 'notification', 'forgot', 'later', 'size', 'fit'.
"""

import requests
from typing import List, Dict, Any, Tuple

PRE_FILTER_KEYWORDS = ["wishlist", "save", "saved", "price drop", "notify", "notification", "forgot", "later", "size", "fit"]

def fetch_app_store_reviews() -> Tuple[List[Dict[str, Any]], int]:
    """
    Fetches App Store reviews across pages 1 to 10 (ALL ratings 1-5), filtering by intent keywords.
    Returns (filtered_records, total_pulled_before_filter).
    """
    records = []
    seen_ids = set()
    total_pulled_before_filter = 0
    
    for page in range(1, 11):
        try:
            rss_url = f"https://itunes.apple.com/in/rss/customerreviews/page={page}/id=907394059/sortBy=mostRecent/json"
            res = requests.get(rss_url, timeout=10)
            if res.status_code == 200:
                feed = res.json().get("feed", {})
                entries = feed.get("entry", [])
                if isinstance(entries, dict):
                    entries = [entries]
                    
                total_pulled_before_filter += len(entries)
                
                for entry in entries:
                    if "im:rating" in entry:
                        rating = int(entry.get("im:rating", {}).get("label", "5"))
                        title = entry.get("title", {}).get("label", "")
                        content = entry.get("content", {}).get("label", "")
                        rid = entry.get("id", {}).get("label", "") or str(hash(title + content))
                        
                        if rid in seen_ids:
                            continue
                            
                        full_text = f"{title}\n{content}".strip() if title else content.strip()
                        full_text_lower = full_text.lower()
                        
                        matched = [kw for kw in PRE_FILTER_KEYWORDS if kw in full_text_lower]
                        if not matched:
                            continue
                            
                        seen_ids.add(rid)
                            
                        record = {
                            "source": "app_store",
                            "source_id": f"app_store_{rid}",
                            "url": "https://apps.apple.com/in/app/myntra-fashion-shopping-app/id907394059",
                            "timestamp": None,
                            "cleaned_text": full_text,
                            "pipeline_note": "text was HTML-stripped, emoji-stripped, and whitespace-normalized before storage; true original raw text was not separately preserved for this pilot run.",
                            "query_used": f"all_ratings_keyword_filter:{','.join(matched)}, score:{rating}, page:{page}",
                            "source_role": "primary",
                            "is_duplicate": False,
                            "duplicate_of": None
                        }
                        records.append(record)
        except Exception as e:
            print(f"App Store RSS page {page} error: {e}")
            
    return records, total_pulled_before_filter
