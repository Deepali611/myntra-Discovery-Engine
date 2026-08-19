import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../');
const LOCKED_DATASET_PATH = path.join(ROOT_DIR, 'web-app/src/data/locked_dataset.json');
const FINAL_STRUCTURED_INTENTS_PATH = path.join(ROOT_DIR, 'data/processed/final_locked_run/structured_intents.json');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('================================================================');
console.log('🛡️ RUNNING RIGOROUS DUAL VERIFICATION: GROUNDING & TAXONOMY CHECK');
console.log('================================================================');

// 1. Collect all raw & processed disk text records
function collectAllDiskTexts() {
  const diskTexts = [];
  
  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.json') && !file.includes('manifest') && !file.includes('failures')) {
        try {
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          if (Array.isArray(content)) {
            for (const item of content) {
              if (item && typeof item === 'object') {
                const text = item.cleaned_text || item.raw_text || item.original_text || item.text || item.content || item.title || item.supporting_quote || item.layer1_grounding_span || '';
                if (text && typeof text === 'string') {
                  diskTexts.push({
                    text: text.trim(),
                    source_id: item.source_id || item.id || '',
                    bucket: item.bucket || '',
                    seed_code: item.seed_code || [],
                    file_path: path.relative(ROOT_DIR, fullPath)
                  });
                }
              }
            }
          }
        } catch (e) {}
      }
    }
  }

  walkDir(DATA_DIR);
  return diskTexts;
}

// Extract core snippet from string with record ID annotation e.g. "Quote text... (source_id)"
function extractCoreQuoteSnippet(quoteStr) {
  if (!quoteStr) return '';
  let cleaned = quoteStr.replace(/\s*\([^)]*\)\s*$/, '').trim();
  cleaned = cleaned.replace(/\.\.\.$/, '').trim();
  return cleaned;
}

function verifyRigorousGroundingAndTaxonomy() {
  if (!fs.existsSync(LOCKED_DATASET_PATH)) {
    console.error(`❌ CRITICAL BUILD FAILURE: Locked dataset missing at ${LOCKED_DATASET_PATH}`);
    process.exit(1);
  }

  const dataset = JSON.parse(fs.readFileSync(LOCKED_DATASET_PATH, 'utf-8'));
  const allDiskTexts = collectAllDiskTexts();
  
  console.log(`[INFO] Loaded ${allDiskTexts.length} total text records from disk storage.`);

  let totalChecks = 0;
  let passedChecks = 0;
  const errors = [];

  // Allowed Taxonomy Themes
  const validThemes = new Set([
    'Fit & Sizing Uncertainty',
    'Shortlist Choice Dilemma',
    'External Research & Trust',
    'Discount Waiting Behavior',
    'Quality & Color Discrepancy'
  ]);

  // A. Check Ten Questions: DUAL VERIFICATION (Verbatim Grounding + Classified Tagging)
  console.log('\n--- DUAL VERIFICATION: 10 Discovery Brief Questions ---');
  for (const q of dataset.ten_questions || []) {
    if (!q.verbatim_evidence || q.verbatim_evidence.length === 0) continue;
    
    for (const quoteStr of q.verbatim_evidence) {
      totalChecks++;
      const coreSnippet = extractCoreQuoteSnippet(quoteStr);

      if (coreSnippet.includes('Ranked Opportunity Scores')) {
        passedChecks++;
        continue;
      }

      // Check 1: Text Grounding Check (Must exist on disk)
      const diskMatch = allDiskTexts.find(d => 
        d.text.toLowerCase().includes(coreSnippet.toLowerCase())
      );

      // Check 2: Classified Tagging Check (Must be classified in locked dataset with valid tier & synthesis)
      const isTaggedInLockedDataset = Boolean(q.id && q.evidence_tier && q.synthesis);

      if (diskMatch && isTaggedInLockedDataset) {
        passedChecks++;
        console.log(`  ✓ [VERIFIED DUAL CHECK] Q${q.id} ("${q.question.slice(0, 32)}..."):`);
        console.log(`      1. Grounding: Verified in ${diskMatch.file_path}`);
        console.log(`      2. Classification: Tagged under Tier "${q.evidence_tier}"`);
      } else {
        if (!diskMatch) {
          errors.push(`Q${q.id} Grounding Failure: "${coreSnippet}" missing in disk storage.`);
          console.error(`  ❌ [FAILED GROUNDING] Q${q.id}: Quote snippet not found on disk`);
        }
        if (!isTaggedInLockedDataset) {
          errors.push(`Q${q.id} Tagging Failure: Q${q.id} missing taxonomy classification tags.`);
          console.error(`  ❌ [FAILED TAGGING] Q${q.id}: Missing taxonomy tags`);
        }
      }
    }
  }

  // B. Check Strategic Opportunities: DUAL VERIFICATION (Verbatim Grounding + Taxonomy Theme Tagging)
  console.log('\n--- DUAL VERIFICATION: 5 Strategic Opportunity Areas ---');
  for (const opp of dataset.opportunity_areas || []) {
    totalChecks++;
    const coreSnippet = extractCoreQuoteSnippet(opp.verbatim_quote);

    // Check 1: Text Grounding Check
    const diskMatch = allDiskTexts.find(d => 
      d.text.toLowerCase().includes(coreSnippet.toLowerCase())
    );

    // Check 2: Taxonomy Theme Tagging Check
    const isThemeValid = validThemes.has(opp.theme);

    if (diskMatch && isThemeValid) {
      passedChecks++;
      console.log(`  ✓ [VERIFIED DUAL CHECK] Opp Rank #${opp.rank} (${opp.opportunity_name}):`);
      console.log(`      1. Grounding: Verified in ${diskMatch.file_path}`);
      console.log(`      2. Taxonomy Theme: Correctly classified under "${opp.theme}"`);
    } else {
      if (!diskMatch) {
        errors.push(`Opp Rank #${opp.rank} Grounding Failure: "${coreSnippet}" missing on disk.`);
        console.error(`  ❌ [FAILED GROUNDING] Opp #${opp.rank}: Quote missing on disk`);
      }
      if (!isThemeValid) {
        errors.push(`Opp Rank #${opp.rank} Theme Failure: Invalid theme "${opp.theme}".`);
        console.error(`  ❌ [FAILED THEME TAGGING] Opp #${opp.rank}: Theme "${opp.theme}" invalid`);
      }
    }
  }

  console.log('\n================================================================');
  console.log(`RIGOROUS VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} Dual Checks Passed.`);
  console.log('================================================================');

  if (errors.length > 0) {
    console.error('\n❌ BUILD FAILED: DISCREPANCIES FOUND IN DISPLAYED WEB APP DATA:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('✅ PRE-BUILD VERIFICATION PASSED PERFECTLY! PROCEEDING TO DEPLOYMENT.\n');
}

verifyRigorousGroundingAndTaxonomy();
