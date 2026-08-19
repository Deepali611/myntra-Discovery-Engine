from http.server import BaseHTTPRequestHandler
import json
import os
import sys

# Ensure repository root is in python path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from src.gate.stage_a import evaluate_stage_a
from src.extraction.layer1 import extract_layer1
from src.extraction.layer2 import extract_layer2
from src.extraction.provider import get_client

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8')) if post_data else {}
            
            mode = body.get('mode', 'try_it')

            # ASSISTANT CHAT MODE
            if mode == 'assistant':
                query = body.get('query') or body.get('text', '').strip()
                if not query:
                    self._send_json(400, {"error": "Empty query provided"})
                    return

                # Load dataset context
                dataset_path = os.path.join(ROOT_DIR, "web-app", "src", "data", "locked_dataset.json")
                locked_data = {}
                if os.path.exists(dataset_path):
                    with open(dataset_path, "r", encoding="utf-8") as f:
                        locked_data = json.load(f)

                system_prompt = f"""You are the Myntra Discovery Engine AI Assistant.
You answer user questions using ONLY the provided disk-verified dataset context.

DATASET CONTEXT:
{json.dumps(locked_data, indent=2)}

STRICT EVIDENCE TIER RULES:
1. Every answer MUST state its evidence tier inline at the very beginning of the response:
   - For Strong evidence (Q1, Q2, Q8, Q10): "This is Strong-confidence evidence (X records, Y sources)"
   - For Moderate evidence (Q3, Q6, Q7): "This is Moderate-confidence evidence (X records, Y sources)"
   - For Directional/Early Signal evidence (Q4, Q5, Q9): "This is limited/Directional evidence (X title-only posts) — treat as a hypothesis, not a confirmed pattern."
2. NEVER present Directional-tier findings with the same confidence language as Strong-tier ones.
3. Weave in real percentages and counts from our actual dataset (e.g., 17 direct wishlist records, 5 supporting decision records, 559 rejected audit records, 99.5% store review post-purchase skew). Never invent numbers not in the dataset.
4. Output strictly valid JSON matching this schema:
{{
  "answer": "Grounded synthesized prose starting with inline evidence tier statement...",
  "evidence_tier_statement": "Inline evidence tier summary",
  "followup_questions": ["Follow-up question 1?", "Follow-up question 2?", "Follow-up question 3?"]
}}
"""

                provider = get_client()
                res = provider.extract(prompt=f"User Question: {query}", system_instruction=system_prompt)
                self._send_json(200, res)
                return

            # LIVE TRY MODE / ANALYZER
            raw_text = body.get('text', '').strip()
            if not raw_text:
                self._send_json(400, {"error": "Empty text provided"})
                return

            # Evaluate Stage A Gate
            stage_a_res = evaluate_stage_a(raw_text)
            layer1_res = None
            layer2_res = None
            
            if stage_a_res.get("stage_a_status") == "pass":
                # Use serverless-safe writable directory (/tmp)
                temp_log = os.path.join("/tmp", "live_grounding_failures.json")
                try:
                    os.makedirs(os.path.dirname(temp_log), exist_ok=True)
                except Exception:
                    temp_log = None

                l1 = extract_layer1(source_id="live_try_mode", raw_text=raw_text, failure_log_path=temp_log)
                if l1:
                    layer1_res = l1
                    l2 = extract_layer2(source_id="live_try_mode", raw_text=raw_text, layer1_output=l1, failure_log_path=temp_log)
                    if l2:
                        layer2_res = l2

            response_payload = {
                "stage_a": stage_a_res,
                "layer1": layer1_res,
                "layer2": layer2_res
            }
            self._send_json(200, response_payload)

        except Exception as e:
            self._send_json(500, {"error": f"Server execution error: {str(e)}"})

    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
