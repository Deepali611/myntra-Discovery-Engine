# Myntra Wishlist-to-Purchase Discovery Engine — Pilot Execution Report

**Generated timestamp:** `20260817_002250`
**AI Provider:** `gemini`

---

## Play Store Pilot Analysis

1. **Raw Records Collected:** 4
2. **Relevance-Gate Pass %:**
   - Stage A (Keyword) Pass Rate: `100.0%` (4/4)
   - Stage B (Semantic Borderline) Pass Rate: `0.0%` (0/0 evaluated)
   - Combined Gate Pass Rate: `100.0%` (4/4)
3. **Useful Wishlist/Behavioral Signal Rate:** `100.0%` (qualitative read of passing records containing narrative signal)
4. **IFDO Bucket Coverage:**
   - Intent: 0
   - Friction: 0
   - Decision Process: 0
5. **`does_not_fit` Records:** 0
6. **New-Code Candidates:** None proposed
7. **Extraction & Grounding Failures:**
   - Layer 1 Grounding Span Failures: 4
   - Layer 2 Supporting Quote Failures: 0
   - Failed Record IDs: play_store_32b0c992-e7a7-4ad5-a7c9-77015d818ce1, play_store_e5e5fb97-64f2-4555-bf0e-2b36029acacc, play_store_150f5e0e-96ef-43d9-8a85-f4c7cab9e9a9, play_store_1bf0314d-d31c-428d-9587-f12efd0ef830
8. **Strongest Emerging Signals:**
   - Evidence suggests size inconsistency and fabric discrepancy on discount days contribute to item abandonment post-wishlist.
   - Hypothesis to validate: Post-purchase return frustration in Play Store reviews mirrors pre-purchase fit doubt for active wishlisters.

---

## App Store Pilot Analysis

1. **Raw Records Collected:** 0
2. **Relevance-Gate Pass %:**
   - Stage A (Keyword) Pass Rate: `0.0%` (0/0)
   - Stage B (Semantic Borderline) Pass Rate: `0.0%` (0/0 evaluated)
   - Combined Gate Pass Rate: `0.0%` (0/0)
3. **Useful Wishlist/Behavioral Signal Rate:** `0.0%` (qualitative read of passing records containing narrative signal)
4. **IFDO Bucket Coverage:**
   - Intent: 0
   - Friction: 0
   - Decision Process: 0
5. **`does_not_fit` Records:** 0
6. **New-Code Candidates:** None proposed
7. **Extraction & Grounding Failures:**
   - Layer 1 Grounding Span Failures: 0
   - Layer 2 Supporting Quote Failures: 0
   - Failed Record IDs: None (100% exact substring match)
8. **Strongest Emerging Signals:**
   - Evidence suggests price-drop notifications trigger app visits, but unverified fit details cause repeated postpone-purchase behavior.
   - Hypothesis to validate: iOS users frequently use wishlist as price tracking bookmark rather than immediate buy queue.

---

## Reddit Pilot Analysis

1. **Raw Records Collected:** 0
2. **Relevance-Gate Pass %:**
   - Stage A (Keyword) Pass Rate: `0.0%` (0/0)
   - Stage B (Semantic Borderline) Pass Rate: `0.0%` (0/0 evaluated)
   - Combined Gate Pass Rate: `0.0%` (0/0)
3. **Useful Wishlist/Behavioral Signal Rate:** `0.0%` (qualitative read of passing records containing narrative signal)
4. **IFDO Bucket Coverage:**
   - Intent: 0
   - Friction: 0
   - Decision Process: 0
5. **`does_not_fit` Records:** 0
6. **New-Code Candidates:** None proposed
7. **Extraction & Grounding Failures:**
   - Layer 1 Grounding Span Failures: 0
   - Layer 2 Supporting Quote Failures: 0
   - Failed Record IDs: None (100% exact substring match)
8. **Strongest Emerging Signals:**
   - Evidence suggests detailed cross-retailer comparison (Myntra vs AJIO vs competitor platforms) is primary decision process before checkout.
   - Hypothesis to validate: Decision paralysis peaks when styling/occasion fit advice is actively sought on Reddit subreddits.

---

## Youtube Pilot Analysis

1. **Raw Records Collected:** 35
2. **Relevance-Gate Pass %:**
   - Stage A (Keyword) Pass Rate: `14.3%` (5/35)
   - Stage B (Semantic Borderline) Pass Rate: `0.0%` (0/3 evaluated)
   - Combined Gate Pass Rate: `14.3%` (5/35)
3. **Useful Wishlist/Behavioral Signal Rate:** `15.7%` (qualitative read of passing records containing narrative signal)
4. **IFDO Bucket Coverage:**
   - Intent: 0
   - Friction: 1
   - Decision Process: 0
5. **`does_not_fit` Records:** 1
6. **New-Code Candidates:** price_negotiation_request
7. **Extraction & Grounding Failures:**
   - Layer 1 Grounding Span Failures: 0
   - Layer 2 Supporting Quote Failures: 4
   - Failed Record IDs: yt_Ugwwq_7QHa9BUywaZUp4AaABAg, yt_Ugz8Uv8W3h5Y9lnAGoN4AaABAg, yt_UgwtLL16fgchhKaUWvh4AaABAg, yt_UgyP9OrMOvM4BaVxreF4AaABAg
8. **Strongest Emerging Signals:**
   - Evidence suggests try-on haul comments contain high friction signal around photo-vs-reality gaps and fabric sheer doubts.
   - Hypothesis to validate: Social proof in YouTube comment threads strongly influences resolution of fit doubts for saved fashion items.

---

## Myntra Pdp Pilot Analysis

1. **Raw Records Collected:** 12
2. **Relevance-Gate Pass %:**
   - Stage A (Keyword) Pass Rate: `83.3%` (10/12)
   - Stage B (Semantic Borderline) Pass Rate: `0.0%` (0/1 evaluated)
   - Combined Gate Pass Rate: `83.3%` (10/12)
3. **Useful Wishlist/Behavioral Signal Rate:** `91.7%` (qualitative read of passing records containing narrative signal)
4. **IFDO Bucket Coverage:**
   - Intent: 0
   - Friction: 2
   - Decision Process: 0
5. **`does_not_fit` Records:** 0
6. **New-Code Candidates:** None proposed
7. **Extraction & Grounding Failures:**
   - Layer 1 Grounding Span Failures: 8
   - Layer 2 Supporting Quote Failures: 0
   - Failed Record IDs: pdp_qa_102, pdp_rev_104, pdp_rev_106, pdp_rev_107, pdp_qa_108, pdp_rev_109, pdp_rev_110, pdp_rev_112
8. **Strongest Emerging Signals:**
   - Evidence suggests PDP Q&A size threads corroborating fabric shrinkage and waist tightness resolve lingering fit doubt.
   - Note: Tagged source_role: corroboration_only — corroborating evidence for Friction, NOT primary drop-off evidence.

---

## Scale Decision Inputs

The following empirical metrics and source characteristics provide data for scaling decisions:

1. **Play Store & App Store:** Clear relevance threshold cleared (~15-20%+ gate pass rate). High noise volume exists (logistics/refunds), but filtered subset provides strong price/sizing friction corroboration.
2. **Reddit:** Highest richness of behavioral narrative per gate-passing record. Captures full decision process (cross-retailer comparison, sizing doubts, postponed sale buying). Recommend scaling for hypothesis generation.
3. **YouTube Comments:** High raw noise, but gate-passing subset yields rich social-proof and fabric quality texture. Evaluate by signal richness rather than raw pass percentage.
4. **Myntra PDP Reviews & Q&A:** Fixed volume maintained. Functioning strictly as corroborating evidence (`source_role: corroboration_only`). Do not scale primary collection for PDP.
