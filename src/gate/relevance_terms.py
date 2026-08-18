"""
Keyword sets for Stage A Relevance Scoring.
Strictly alignment-checked with context.md §7 and prompt specifications.
"""

RELEVANCE_KEYWORDS = {
    "wishlist_save": [
        "wishlist", "wishlisted", "wish listing", "wish-list", "saved", 
        "save for later", "shortlist", "shortlisted", "favorited", "favourited", "save"
    ],
    "comparison": [
        "compared", "comparing", "vs", "versus", "better than", "which one", 
        "alternative", "ajio", "nykaa", "tira", "myntra vs"
    ],
    "deferral_postponement": [
        "waiting", "later", "still deciding", "not sure yet", "will buy", 
        "postponed", "postpone", "sale", "discount", "price drop", "payday", 
        "budget", "expensive", "wait"
    ],
    "fit_quality_trust": [
        "size", "sizing", "fit", "fits", "doesn't fit", "fabric", "quality", 
        "return", "returned", "refund", "looks different", "fake", "material", 
        "cloth", "picture"
    ],
    "review_social_proof": [
        "reviews", "review", "ratings", "rating", "ask", "friend", 
        "recommend", "influencer", "ugc", "haul", "try on"
    ]
}

# Post-pull candidate keywords for Play Store & App Store reviews
APP_STORE_POST_PULL_KEYWORDS = [
    "wishlist", "saved", "forgot", "notify", "price drop", "size guide", "return"
]
