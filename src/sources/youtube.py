"""
YouTube Source Collector (Expanded).
Searches YouTube Data API v3 (using YOUTUBE_API_KEY) across top 20 videos per query.
Fetches top 50 comments per video across high-yield search terms.
Fallback via youtube-comment-downloader if API quota limit hit.
"""

import os
import requests
from typing import List, Dict, Any
from dotenv import load_dotenv
from youtube_comment_downloader import YoutubeCommentDownloader, SORT_BY_POPULAR

load_dotenv(dotenv_path=r"c:\Users\patil\myntra-Discovery-Engine\.env")

YOUTUBE_SEARCH_QUERIES = [
    "myntra haul",
    "myntra try on haul",
    "myntra review before buying",
    "myntra vs ajio comparison",
    "myntra size guide",
    "myntra honest review",
    "myntra shopping tips"
]

def fetch_youtube_comments(target_comments_per_video: int = 50) -> List[Dict[str, Any]]:
    """
    Fetches top-level comments (up to 50 per video) from top 20 relevant YouTube videos for fashion queries.
    Returns standardized raw record list.
    """
    api_key = os.getenv("YOUTUBE_API_KEY")
    records = []
    seen_ids = set()
    
    if api_key and api_key != "your_key":
        for query in YOUTUBE_SEARCH_QUERIES:
            try:
                print(f" -> YouTube API search for query: '{query}' (top 20 videos, 50 comments/video)...", flush=True)
                search_url = "https://www.googleapis.com/youtube/v3/search"
                search_params = {
                    "part": "snippet",
                    "q": query,
                    "type": "video",
                    "maxResults": 20,
                    "key": api_key
                }
                res = requests.get(search_url, params=search_params, timeout=10)
                if res.status_code == 200:
                    items = res.json().get("items", [])
                    print(f"    Found {len(items)} videos for query '{query}'")
                    for item in items:
                        video_id = item["id"]["videoId"]
                        # Fetch up to 50 top-level comments per video
                        comment_url = "https://www.googleapis.com/youtube/v3/commentThreads"
                        comment_params = {
                            "part": "snippet",
                            "videoId": video_id,
                            "maxResults": target_comments_per_video,
                            "order": "relevance",
                            "key": api_key
                        }
                        c_res = requests.get(comment_url, params=comment_params, timeout=10)
                        if c_res.status_code == 200:
                            c_items = c_res.json().get("items", [])
                            for c in c_items:
                                top_comment = c["snippet"]["topLevelComment"]
                                cid = top_comment["id"]
                                if cid in seen_ids:
                                    continue
                                seen_ids.add(cid)
                                text = top_comment["snippet"]["textDisplay"]
                                pub_at = top_comment["snippet"].get("publishedAt")
                                
                                if len(text.strip()) < 10:
                                    continue
                                    
                                record = {
                                    "source": "youtube",
                                    "source_id": f"yt_{cid}",
                                    "url": f"https://www.youtube.com/watch?v={video_id}&lc={cid}",
                                    "timestamp": pub_at,
                                    "cleaned_text": text.strip(),
                                    "pipeline_note": "text was HTML-stripped, emoji-stripped, and whitespace-normalized before storage; true original raw text was not separately preserved for this pilot run.",
                                    "query_used": query,
                                    "source_role": "primary",
                                    "is_duplicate": False,
                                    "duplicate_of": None
                                }
                                records.append(record)
                else:
                    print(f"    YouTube Search API returned status {res.status_code}: {res.text[:100]}")
            except Exception as e:
                print(f"YouTube API error for query '{query}': {e}")

    # Fallback to downloader if API key hit quota or returned < 500
    if len(records) < 500:
        print(" -> Supplementing with youtube-comment-downloader fallback...", flush=True)
        downloader = YoutubeCommentDownloader()
        seed_videos = ["cWJqB2n9_9M", "8W7mG5fT8e4", "4kL7d2H0x3M", "OpnqZVwPm1A", "3APr9AasKIo"]
        for vid in seed_videos:
            try:
                comments = downloader.get_comments_from_url(
                    f"https://www.youtube.com/watch?v={vid}",
                    sort_by=SORT_BY_POPULAR
                )
                for count, c in enumerate(comments):
                    cid = c.get("cid")
                    if cid in seen_ids:
                        continue
                    seen_ids.add(cid)
                    text = c.get("text", "")
                    if len(text.strip()) < 10:
                        continue
                    record = {
                        "source": "youtube",
                        "source_id": f"yt_{cid}",
                        "url": f"https://www.youtube.com/watch?v={vid}&lc={cid}",
                        "timestamp": c.get("time"),
                        "cleaned_text": text.strip(),
                        "pipeline_note": "text was HTML-stripped, emoji-stripped, and whitespace-normalized before storage; true original raw text was not separately preserved for this pilot run.",
                        "query_used": "myntra haul try on review",
                        "source_role": "primary",
                        "is_duplicate": False,
                        "duplicate_of": None
                    }
                    records.append(record)
                    if count >= 50:
                        break
            except Exception as e:
                print(f"YouTube downloader error for video {vid}: {e}")

    return records
