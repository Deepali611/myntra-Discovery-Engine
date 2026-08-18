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

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8')) if post_data else {}
            
            raw_text = body.get('text', '').strip()
            if not raw_text:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Empty text provided"}).encode('utf-8'))
                return

            # Execute Stage A Gate
            stage_a_res = evaluate_stage_a(raw_text)
            
            layer1_res = None
            layer2_res = None
            
            if stage_a_res.get("stage_a_status") == "pass":
                temp_log = os.path.join("data", "analysis", "live_grounding_failures.json")
                os.makedirs(os.path.dirname(temp_log), exist_ok=True)
                
                # Execute Layer 1 Behavioral Capture via AI Provider API
                l1 = extract_layer1(source_id="live_try_mode", raw_text=raw_text, failure_log_path=temp_log)
                if l1:
                    layer1_res = l1
                    # Execute Layer 2 Taxonomy Mapping via AI Provider API
                    l2 = extract_layer2(source_id="live_try_mode", raw_text=raw_text, layer1_output=l1, failure_log_path=temp_log)
                    if l2:
                        layer2_res = l2

            response_payload = {
                "stage_a": stage_a_res,
                "layer1": layer1_res,
                "layer2": layer2_res
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_payload).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
