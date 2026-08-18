"""
Main Pipeline Orchestrator (Stages 1-9).
Runs strictly sequential execution per record, protecting raw data immutability, caching, batching, and quote grounding validation.
"""

import os
import sys
import json
import time
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, Any, List

# Sources
from src.sources.play_store import fetch_play_store_reviews
from src.sources.app_store import fetch_app_store_reviews
from src.sources.reddit import fetch_reddit_posts
from src.sources.youtube import fetch_youtube_comments
from src.sources.myntra_pdp import fetch_myntra_pdp_reviews

# Gate
from src.gate.stage_a import evaluate_stage_a
from src.gate.stage_b import should_evaluate_stage_b, evaluate_stage_b

# Extraction & Grounding
from src.extraction.provider import get_client
from src.extraction.layer1 import extract_layer1
from src.extraction.layer2 import extract_layer2

# Report
from src.report.pilot_report import generate_pilot_report


def log(msg: str):
    print(msg, flush=True)


def run_pipeline(timestamp: str = None, provider_override: str = None) -> str:
    """
    Executes the complete 9-stage pilot pipeline.
    Returns path to generated pilot_report.md.
    """
    if timestamp is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
    raw_dir = os.path.join("data", "raw", f"pilot_{timestamp}")
    analysis_dir = os.path.join("data", "analysis", f"pilot_{timestamp}")
    
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(analysis_dir, exist_ok=True)

    grounding_failures_path = os.path.join(analysis_dir, "grounding_failures.json")

    log(f"=== STAGE 1 & 2: SOURCE COLLECTION & IMMUTABLE STORAGE [pilot_{timestamp}] ===")
    
    sources_data = {}
    collection_errors = []
    
    # Independent source collection
    # 1. Play Store
    try:
        log(" -> Fetching Play Store reviews...")
        ps_records = fetch_play_store_reviews(target_count=35)
        sources_data["play_store"] = ps_records
        log(f"    Collected {len(ps_records)} Play Store records")
    except Exception as e:
        log(f"Play Store collection error: {e}")
        sources_data["play_store"] = []
        collection_errors.append({"source": "play_store", "error": str(e)})

    # 2. App Store
    try:
        log(" -> Fetching App Store reviews...")
        as_records = fetch_app_store_reviews(target_count=35)
        sources_data["app_store"] = as_records
        log(f"    Collected {len(as_records)} App Store records")
    except Exception as e:
        log(f"App Store collection error: {e}")
        sources_data["app_store"] = []
        collection_errors.append({"source": "app_store", "error": str(e)})

    # 3. Reddit
    try:
        log(" -> Fetching Reddit posts...")
        reddit_records = fetch_reddit_posts(target_count=35)
        sources_data["reddit"] = reddit_records
        log(f"    Collected {len(reddit_records)} Reddit records")
    except Exception as e:
        log(f"Reddit collection error: {e}")
        sources_data["reddit"] = []
        collection_errors.append({"source": "reddit", "error": str(e)})

    # 4. YouTube
    try:
        log(" -> Fetching YouTube comments...")
        yt_records = fetch_youtube_comments(target_count=35)
        sources_data["youtube"] = yt_records
        log(f"    Collected {len(yt_records)} YouTube records")
    except Exception as e:
        log(f"YouTube collection error: {e}")
        sources_data["youtube"] = []
        collection_errors.append({"source": "youtube", "error": str(e)})

    # 5. Myntra PDP
    try:
        log(" -> Fetching Myntra PDP reviews & Q&A (corroboration_only)...")
        pdp_records = fetch_myntra_pdp_reviews()
        sources_data["myntra_pdp"] = pdp_records
        log(f"    Collected {len(pdp_records)} Myntra PDP records")
    except Exception as e:
        log(f"Myntra PDP collection error: {e}")
        sources_data["myntra_pdp"] = []
        collection_errors.append({"source": "myntra_pdp", "error": str(e)})

    all_raw_records = []
    manifest_counts = {}

    for source_name, records in sources_data.items():
        manifest_counts[source_name] = len(records)
        all_raw_records.extend(records)
        raw_file_path = os.path.join(raw_dir, f"{source_name}.json")
        with open(raw_file_path, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)

    ai_client = get_client()
    provider_name = provider_override or ai_client.provider

    manifest = {
        "timestamp": timestamp,
        "ai_provider": provider_name,
        "total_raw_records": len(all_raw_records),
        "counts_per_source": manifest_counts,
        "collection_errors": collection_errors,
        "raw_records": [{"source": r["source"], "source_id": r["source_id"]} for r in all_raw_records]
    }
    with open(os.path.join(raw_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    log(f"Total raw records collected across 5 sources: {len(all_raw_records)}")

    # STAGE 3 — Keyword Relevance Gate (no AI)
    log("\n=== STAGE 3: STAGE A KEYWORD RELEVANCE SCORING ===")
    stage_a_results = []
    for r in all_raw_records:
        res = evaluate_stage_a(r["raw_text"])
        res["source_id"] = r["source_id"]
        stage_a_results.append(res)

    with open(os.path.join(analysis_dir, "stage_a_results.json"), "w", encoding="utf-8") as f:
        json.dump(stage_a_results, f, indent=2)

    stage_a_by_id = {item["source_id"]: item for item in stage_a_results}
    raw_by_id = {item["source_id"]: item for item in all_raw_records}

    # STAGE 4 — Stage B Borderline Semantic Check (AI call, subset only)
    log("\n=== STAGE 4: STAGE B BORDERLINE SEMANTIC CHECK (AI) ===")
    stage_b_results = []
    stage_a_failures = [r for r in all_raw_records if stage_a_by_id[r["source_id"]]["relevance_gate_stage_a"] == "fail"]
    
    borderline_candidates = []
    for idx, r in enumerate(stage_a_failures):
        is_audit = (idx % 10 == 0)
        if should_evaluate_stage_b(r["raw_text"], is_audit_sample=is_audit):
            borderline_candidates.append(r)

    log(f"Stage A passed: {len(all_raw_records) - len(stage_a_failures)}, Stage A failed: {len(stage_a_failures)}, Stage B candidates: {len(borderline_candidates)}")

    for r in borderline_candidates:
        b_res = evaluate_stage_b(r["raw_text"], provider_client=ai_client)
        b_res["source_id"] = r["source_id"]
        stage_b_results.append(b_res)

    with open(os.path.join(analysis_dir, "stage_b_results.json"), "w", encoding="utf-8") as f:
        json.dump(stage_b_results, f, indent=2)

    stage_b_by_id = {item["source_id"]: item for item in stage_b_results}

    gate_passing_ids = []
    for r in all_raw_records:
        sid = r["source_id"]
        if stage_a_by_id[sid]["relevance_gate_stage_a"] == "pass":
            gate_passing_ids.append(sid)
        elif sid in stage_b_by_id and stage_b_by_id[sid]["relevance_gate_stage_b"] == "pass":
            gate_passing_ids.append(sid)

    log(f"Total records passing Relevance Gate (Stage A or B): {len(gate_passing_ids)}")

    # STAGE 5 & 6 — Layer 1 Behavioral Extraction & Grounding Validation
    log("\n=== STAGE 5 & 6: LAYER 1 EXTRACTION & GROUNDING VALIDATION ===")
    layer1_outputs = {}

    def process_l1(sid):
        r = raw_by_id[sid]
        l1_res = extract_layer1(
            source_id=sid,
            raw_text=r["raw_text"],
            failure_log_path=grounding_failures_path,
            provider_client=ai_client
        )
        return sid, l1_res

    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(process_l1, sid) for sid in gate_passing_ids]
        for future in as_completed(futures):
            sid, res = future.result()
            if res:
                layer1_outputs[sid] = res

    with open(os.path.join(analysis_dir, "layer1.json"), "w", encoding="utf-8") as f:
        json.dump(layer1_outputs, f, indent=2)

    log(f"Layer 1 extraction completed: {len(layer1_outputs)} passed grounding check")

    # STAGE 7 & 8 — Layer 2 Taxonomy Mapping & Quote Validation
    log("\n=== STAGE 7 & 8: LAYER 2 TAXONOMY MAPPING & QUOTE VALIDATION ===")
    layer2_outputs = {}

    def process_l2(sid):
        r = raw_by_id[sid]
        l1_out = layer1_outputs[sid]
        l2_res = extract_layer2(
            source_id=sid,
            raw_text=r["raw_text"],
            layer1_output=l1_out,
            failure_log_path=grounding_failures_path,
            provider_client=ai_client
        )
        return sid, l2_res

    valid_l1_sids = list(layer1_outputs.keys())
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(process_l2, sid) for sid in valid_l1_sids]
        for future in as_completed(futures):
            sid, res = future.result()
            if res:
                layer2_outputs[sid] = res

    with open(os.path.join(analysis_dir, "layer2.json"), "w", encoding="utf-8") as f:
        json.dump(layer2_outputs, f, indent=2)

    log(f"Layer 2 extraction completed: {len(layer2_outputs)} passed quote check")

    # STAGE 9 — Pilot Reporting
    log("\n=== STAGE 9: PILOT REPORTING ===")
    
    grounding_failures = []
    if os.path.exists(grounding_failures_path):
        with open(grounding_failures_path, "r", encoding="utf-8") as f:
            grounding_failures = json.load(f)

    report_path = os.path.join(analysis_dir, "pilot_report.md")
    generate_pilot_report(
        manifest_data=manifest,
        stage_a_data=stage_a_results,
        stage_b_data=stage_b_results,
        layer1_data=layer1_outputs,
        layer2_data=layer2_outputs,
        grounding_failures=grounding_failures,
        output_path=report_path
    )

    log(f"\nPipeline execution complete! Pilot report generated at:\n  {report_path}")
    return report_path


if __name__ == "__main__":
    run_pipeline()
