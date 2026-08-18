"""
Reddit Source Collector via Apify.
Uses Apify actor trudax/reddit-scraper-lite with APIFY_API_TOKEN.
Searches specified subreddits for targeted fashion wishlist/friction search queries.
Enforces mandatory post-pull filter: text MUST contain 'myntra' (case-insensitive) to prevent actor fallback junk.
"""

import os
from typing import List, Dict, Any
from dotenv import load_dotenv
from apify_client import ApifyClient

load_dotenv(dotenv_path=r"c:\Users\patil\myntra-Discovery-Engine\.env")

REDDIT_SUBREDDITS = [
    "IndianFashionAddicts",
    "india",
    "IndianStreetwear",
    "AskIndia"
]

REDDIT_SEARCH_QUERIES = [
    "myntra wishlist",
    "myntra size doubt",
    "myntra fit issue",
    "myntra vs ajio",
    "myntra vs nykaa fashion",
    "myntra sale",
    "myntra returned",
    "bought myntra",
    "myntra youtube review before buying",
    "asked friends myntra"
]

def fetch_reddit_posts(target_count: int = 40) -> List[Dict[str, Any]]:
    """
    Executes Apify Reddit actor runs for search queries across targeted subreddits.
    Mandatory filter: discards any post not explicitly containing 'myntra'.
    Returns standardized raw record list.
    """
    token = os.getenv("APIFY_API_TOKEN")
    if not token:
        print("Warning: APIFY_API_TOKEN missing in .env")
        return []
        
    client = ApifyClient(token)
    records = []
    seen_ids = set()
    
    per_query_target = max(4, target_count // len(REDDIT_SEARCH_QUERIES))
    
    for query in REDDIT_SEARCH_QUERIES:
        try:
            print(f" -> Apify Reddit search for query: '{query}'...", flush=True)
            run_input = {
                "searches": [query],
                "subreddits": REDDIT_SUBREDDITS,
                "maxItems": per_query_target * 3,
                "searchMode": "posts"
            }
            
            run = client.actor("trudax/reddit-scraper-lite").call(run_input=run_input)
            
            if isinstance(run, dict):
                dataset_id = run.get("defaultDatasetId") or run.get("default_dataset_id")
            else:
                dataset_id = getattr(run, "default_dataset_id", getattr(run, "defaultDatasetId", None))
                if not dataset_id and hasattr(run, "get"):
                    dataset_id = run.get("defaultDatasetId")
            
            if not dataset_id:
                print(f"Warning: no dataset_id found in run output for query '{query}'")
                continue

            dataset_items = client.dataset(dataset_id).list_items().items
            print(f"    Fetched {len(dataset_items)} raw items for query '{query}'")
            
            for item in dataset_items:
                post_id = item.get("id") or item.get("parsedId") or str(hash(str(item)))
                if post_id in seen_ids:
                    continue
                seen_ids.add(post_id)
                
                title = item.get("title", "")
                text = item.get("selftext", "") or item.get("text", "") or item.get("body", "")
                combined_text = f"{title}\n{text}".strip() if title else text.strip()
                
                # Mandatory post-pull filter: MUST contain 'myntra' (case-insensitive)
                if "myntra" not in combined_text.lower():
                    continue
                    
                if len(combined_text) < 15:
                    continue
                    
                url = item.get("url") or item.get("permalink") or f"https://reddit.com/{post_id}"
                if url and not url.startswith("http"):
                    url = f"https://reddit.com{url}"
                    
                timestamp = item.get("createdAt") or item.get("created_utc")
                
                record = {
                    "source": "reddit",
                    "source_id": f"reddit_{post_id}",
                    "url": url,
                    "timestamp": str(timestamp) if timestamp else None,
                    "cleaned_text": combined_text,
                    "pipeline_note": "text was HTML-stripped, emoji-stripped, and whitespace-normalized before storage; true original raw text was not separately preserved for this pilot run.",
                    "query_used": query,
                    "source_role": "primary",
                    "is_duplicate": False,
                    "duplicate_of": None
                }
                records.append(record)
                    
        except Exception as e:
            print(f"Reddit scraper error for query '{query}': {e}")
            
    return records
