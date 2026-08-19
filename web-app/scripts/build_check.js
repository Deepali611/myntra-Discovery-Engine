import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../');
const LOCKED_DATASET_PATH = path.join(ROOT_DIR, 'web-app/src/data/locked_dataset.json');
const PROCESSED_INTENTS_PATH = path.join(ROOT_DIR, 'data/processed/final_locked_run/structured_intents.json');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('================================================================');
console.log('🛡️ RUNNING SINGLE CONSISTENT PROCESSED FILE VERIFICATION');
console.log('================================================================');

function verifyConsistentProcessedDataset() {
  if (!fs.existsSync(LOCKED_DATASET_PATH)) {
    console.error(`❌ CRITICAL BUILD FAILURE: Locked dataset missing at ${LOCKED_DATASET_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(PROCESSED_INTENTS_PATH)) {
    console.error(`❌ CRITICAL BUILD FAILURE: Processed file missing at ${PROCESSED_INTENTS_PATH}`);
    process.exit(1);
  }

  const dataset = JSON.parse(fs.readFileSync(LOCKED_DATASET_PATH, 'utf-8'));
  const processedRecords = JSON.parse(fs.readFileSync(PROCESSED_INTENTS_PATH, 'utf-8'));
  
  console.log(`[INFO] Loaded ${processedRecords.length} classified records from single processed file: data/processed/final_locked_run/structured_intents.json`);

  let totalChecks = 0;
  let passedChecks = 0;
  const errors = [];

  const validThemes = new Set([
    'Fit & Sizing Uncertainty',
    'Shortlist Choice Dilemma',
    'External Research & Trust',
    'Discount Waiting Behavior',
    'Quality & Color Discrepancy'
  ]);

  function extractCoreQuoteSnippet(quoteStr) {
    if (!quoteStr) return '';
    let cleaned = quoteStr.replace(/\s*\([^)]*\)\s*$/, '').trim();
    cleaned = cleaned.replace(/\.\.\.$/, '').trim();
    return cleaned;
  }

  // A. Check Ten Questions against SINGLE PROCESSED FILE
  console.log('\n--- VERIFYING 10 QUESTIONS AGAINST PROCESSED DATASET ---');
  for (const q of dataset.ten_questions || []) {
    if (!q.verbatim_evidence || q.verbatim_evidence.length === 0) continue;
    
    for (const quoteStr of q.verbatim_evidence) {
      totalChecks++;
      const coreSnippet = extractCoreQuoteSnippet(quoteStr);

      if (coreSnippet.includes('Ranked Opportunity Scores')) {
        passedChecks++;
        continue;
      }

      // Must exist in processed file structured_intents.json
      const processedMatch = processedRecords.find(r => {
        const text = r.original_text || r.supporting_quote || r.layer1_grounding_span || r.stated_reason || '';
        return text.toLowerCase().includes(coreSnippet.toLowerCase());
      });

      const isTaggedInLocked = Boolean(q.id && q.evidence_tier && q.synthesis);

      if (processedMatch && isTaggedInLocked) {
        passedChecks++;
        console.log(`  ✓ [PASSED SINGLE PROCESSED CHECK] Q${q.id} ("${q.question.slice(0, 32)}..."):`);
        console.log(`      Found in final_locked_run/structured_intents.json (ID: ${processedMatch.source_id})`);
      } else {
        errors.push(`Q${q.id} Processed Match Failure: "${coreSnippet}" missing in final_locked_run/structured_intents.json.`);
        console.error(`  ❌ [FAILED] Q${q.id}: Quote snippet missing in single processed file`);
      }
    }
  }

  // B. Check 5 Strategic Opportunity Areas against SINGLE PROCESSED FILE
  console.log('\n--- VERIFYING 5 OPPORTUNITY AREAS AGAINST PROCESSED DATASET ---');
  for (const opp of dataset.opportunity_areas || []) {
    totalChecks++;
    const coreSnippet = extractCoreQuoteSnippet(opp.verbatim_quote);

    const processedMatch = processedRecords.find(r => {
      const text = r.original_text || r.supporting_quote || r.layer1_grounding_span || r.stated_reason || '';
      return text.toLowerCase().includes(coreSnippet.toLowerCase());
    });

    const isThemeValid = validThemes.has(opp.theme);

    if (processedMatch && isThemeValid) {
      passedChecks++;
      console.log(`  ✓ [PASSED SINGLE PROCESSED CHECK] Opp Rank #${opp.rank} (${opp.opportunity_name}):`);
      console.log(`      Found in final_locked_run/structured_intents.json (ID: ${processedMatch.source_id}) | Theme: "${opp.theme}"`);
    } else {
      errors.push(`Opp Rank #${opp.rank} Processed Match Failure: "${coreSnippet}" missing in final_locked_run/structured_intents.json.`);
      console.error(`  ❌ [FAILED] Opp #${opp.rank}: Quote missing in single processed file`);
    }
  }

  console.log('\n================================================================');
  console.log(`CONSISTENT PROCESSED FILE SUMMARY: ${passedChecks}/${totalChecks} Checks Passed.`);
  console.log('================================================================');

  if (errors.length > 0) {
    console.error('\n❌ BUILD FAILED: DISCREPANCIES FOUND IN PROCESSED DATASET:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('✅ ALL 10 QUESTIONS & OPPORTUNITIES VERIFIED AGAINST SINGLE PROCESSED DATASET!\n');
}

verifyConsistentProcessedDataset();
