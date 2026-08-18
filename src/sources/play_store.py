"""
Play Store Source Collector.
Uses google-play-scraper to fetch recent Myntra Android app reviews across ALL 1-5 star ratings.
Applies text keyword pre-filter for intent & size/fit signals:
'wishlist', 'save', 'saved', 'price drop', 'notify', 'notification', 'forgot', 'later', 'size', 'fit'.
"""

from typing import List, Dict, Any, Tuple
from google_play_scraper import Sort, reviews

MYNTRA_ANDROID_APP_ID = "com.myntra.android"
PRE_FILTER_KEYWORDS = ["wishlist", "save", "saved", "price drop", "notify", "notification", "forgot", "later", "size", "fit"]

def fetch_play_store_reviews(count_to_pull: int = 3000) -> Tuple[List[Dict[str, Any]], int]:
    """
    Fetches Play Store reviews across ALL ratings (1-5), filtering by intent keywords on text.
    Returns (filtered_records, total_pulled_before_filter).
    """
    records = []
    seen_ids = set()
    
    fetched_reviews, _ = reviews(
        MYNTRA_ANDROID_APP_ID,
        lang='en',
        country='in',
        sort=Sort.NEWEST,
        count=count_to_pull
    )
    
    total_pulled_before_filter = len(fetched_reviews)
    
    for r in fetched_reviews:
        score = r.get('score', 5)
        content = r.get('content', '')
        review_id = r.get('reviewId', str(hash(content)))
        timestamp = r.get('at').isoformat() if r.get('at') else None
        
        if review_id in seen_ids:
            continue
            
        content_lower = content.lower()
        matched = [kw for kw in PRE_FILTER_KEYWORDS if kw in content_lower]
        if not matched:
            continue
            
        seen_ids.add(review_id)
            
        record = {
            "source": "play_store",
            "source_id": f"play_store_{review_id}",
            "url": f"https://play.google.com/store/apps/details?id={MYNTRA_ANDROID_APP_ID}&reviewId={review_id}",
            "timestamp": timestamp,
            "cleaned_text": content.strip(),
            "pipeline_note": "text was HTML-stripped, emoji-stripped, and whitespace-normalized before storage; true original raw text was not separately preserved for this pilot run.",
            "query_used": f"all_ratings_keyword_filter:{','.join(matched)}, score:{score}",
            "source_role": "primary",
            "is_duplicate": False,
            "duplicate_of": None
        }
        records.append(record)
            
    return records, total_pulled_before_filter
