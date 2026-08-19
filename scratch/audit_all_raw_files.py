import os
import json

raw_dir = r"c:\Users\patil\myntra-Discovery-Engine\data\raw"

total_playstore_raw = 0
playstore_delivery_count = 0

for root, dirs, files in os.walk(raw_dir):
    for f in files:
        if f.endswith(".json"):
            fp = os.path.join(root, f)
            try:
                with open(fp, "r", encoding="utf-8") as file:
                    content = json.load(file)
                    items = content if isinstance(content, list) else [content]
                    for item in items:
                        if not isinstance(item, dict): continue
                        src = (item.get("source") or item.get("platform") or f).lower()
                        text = (item.get("text") or item.get("review_text") or item.get("comment") or str(item)).lower()
                        if "playstore" in src or "app_store" in src or "play" in f.lower() or "store" in f.lower():
                            total_playstore_raw += 1
                            if any(w in text for w in ["delivery", "courier", "refund", "delayed", "late", "service", "customer care", "return"]):
                                playstore_delivery_count += 1
            except Exception:
                pass

print(f"Total Playstore / App store raw records inspected across disk: {total_playstore_raw}")
print(f"Delivery/service/courier complaints count: {playstore_delivery_count}")
if total_playstore_raw > 0:
    print(f"Computed percentage: {(playstore_delivery_count / total_playstore_raw) * 100:.2f}%")
