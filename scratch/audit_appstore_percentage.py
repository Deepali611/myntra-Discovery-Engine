import json
import os

filepath = r"c:\Users\patil\myntra-Discovery-Engine\data\processed\final_locked_run\structured_intents.json"

with open(filepath, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total records in locked run: {len(data)}")

source_counts = {}
delivery_service_by_source = {}
relevance_by_source = {}

for r in data:
    src = r.get("source", "unknown")
    source_counts[src] = source_counts.get(src, 0) + 1
    
    text = (r.get("raw_text") or r.get("review_text") or r.get("title") or r.get("body") or "").lower()
    intent = str(r.get("primary_intent") or "").lower()
    reason = str(r.get("exclusion_reason") or r.get("relevance_reason") or "").lower()
    
    is_delivery = any(w in text or w in intent or w in reason for w in ["delivery", "courier", "refund", "delayed", "late", "service", "customer care", "agent", "return pickup", "wrong item"])
    
    if src not in delivery_service_by_source:
        delivery_service_by_source[src] = 0
    if is_delivery:
        delivery_service_by_source[src] += 1

print("\n--- SOURCE BREAKDOWN ---")
for src, count in source_counts.items():
    deliv = delivery_service_by_source.get(src, 0)
    pct = (deliv / count) * 100
    print(f"Source: {src:<20} | Total: {count:<5} | Delivery/Service: {deliv:<5} | Pct: {pct:.2f}%")
