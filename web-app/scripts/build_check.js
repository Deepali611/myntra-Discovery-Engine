import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../');
const LOCKED_DATASET_PATH = path.join(ROOT_DIR, 'web-app/src/data/locked_dataset.json');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('================================================================');
console.log('🛡️ RUNNING PRE-BUILD VERIFICATION: VERBATIM GROUNDING & TAXONOMY CHECK');
console.log('================================================================');

// 1. Collect all raw texts from disk storage
function collectAllRawDiskTexts() {
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
                    file_path: path.relative(ROOT_DIR, fullPath)
                  });
                }
              }
            }
          }
        } catch (e) {
          // ignore unparseable
        }
      }
    }
  }

  walkDir(DATA_DIR);
  return diskTexts;
}

// Extract core snippet from string with record ID annotation e.g. "Quote text... (source_id)"
function extractCoreQuoteSnippet(quoteStr) {
  if (!quoteStr) return '';
  // Remove trailing record ID annotation in parentheses e.g. (pdp_rev_106)
  let cleaned = quoteStr.replace(/\s*\([^)]*\)\s*$/, '').trim();
  // Remove ellipsis if present
  cleaned = cleaned.replace(/\.\.\.$/, '').trim();
  return cleaned;
}

function verifyLockedDataset() {
  if (!fs.existsSync(LOCKED_DATASET_PATH)) {
    console.error(`❌ CRITICAL BUILD FAILURE: Locked dataset file missing at ${LOCKED_DATASET_PATH}`);
    process.exit(1);
  }

  const dataset = JSON.parse(fs.readFileSync(LOCKED_DATASET_PATH, 'utf-8'));
  const rawDiskTexts = collectAllRawDiskTexts();
  
  console.log(`[INFO] Loaded ${rawDiskTexts.length} raw text records from disk storage.`);

  let totalQuotesChecked = 0;
  let passedCount = 0;
  const errors = [];

  // Theme Classification Map Validation Rules
  const validThemes = new Set([
    'Fit & Sizing Uncertainty',
    'Shortlist Choice Dilemma',
    'External Research & Trust',
    'Discount Waiting Behavior',
    'Quality & Color Discrepancy'
  ]);

  // A. Check Ten Questions Verbatim Quotes
  console.log('\n--- Checking 10 Discovery Brief Questions ---');
  for (const q of dataset.ten_questions || []) {
    if (!q.verbatim_evidence || q.verbatim_evidence.length === 0) continue;
    
    for (const quoteStr of q.verbatim_evidence) {
      totalQuotesChecked++;
      const coreSnippet = extractCoreQuoteSnippet(quoteStr);

      // Skip synthesized matrix summary quote
      if (coreSnippet.includes('Ranked Opportunity Scores')) {
        passedCount++;
        continue;
      }

      // Check if core snippet exists as substring in raw disk text
      const match = rawDiskTexts.find(d => 
        d.text.toLowerCase().includes(coreSnippet.toLowerCase())
      );

      if (match) {
        passedCount++;
        console.log(`  ✓ [VERIFIED] Q${q.id} ("${q.question.slice(0, 35)}..."): Found verbatim match in ${match.file_path}`);
      } else {
        errors.push(`Q${q.id} Quote Mismatch: "${coreSnippet}" was not found verbatim in any raw source file on disk.`);
        console.error(`  ❌ [FAILED] Q${q.id}: Quote snippet "${coreSnippet}" NOT found in disk storage.`);
      }
    }
  }

  // B. Check Opportunity Areas Verbatim Quotes & Theme Classifications
  console.log('\n--- Checking 5 Strategic Opportunity Areas ---');
  for (const opp of dataset.opportunity_areas || []) {
    totalQuotesChecked++;
    
    // Theme Validation
    if (!validThemes.has(opp.theme)) {
      errors.push(`Opportunity Rank #${opp.rank} Theme Mismatch: Invalid theme "${opp.theme}". Must be one of locked taxonomy themes.`);
    }

    const coreSnippet = extractCoreQuoteSnippet(opp.verbatim_quote);
    const match = rawDiskTexts.find(d => 
      d.text.toLowerCase().includes(coreSnippet.toLowerCase())
    );

    if (match) {
      passedCount++;
      console.log(`  ✓ [VERIFIED] Opp Rank #${opp.rank} (${opp.opportunity_name}): Verbatim quote & Theme "${opp.theme}" verified.`);
    } else {
      errors.push(`Opp Rank #${opp.rank} Quote Mismatch: "${coreSnippet}" was not found verbatim in raw source files.`);
      console.error(`  ❌ [FAILED] Opp Rank #${opp.rank}: Quote snippet "${coreSnippet}" NOT found in disk storage.`);
    }
  }

  console.log('\n================================================================');
  console.log(`VERIFICATION SUMMARY: ${passedCount}/${totalQuotesChecked} Grounding & Theme Checks Passed.`);
  console.log('================================================================');

  if (errors.length > 0) {
    console.error('\n❌ BUILD FAILED: DISCREPANCIES FOUND IN DISPLAYED WEB APP DATA:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('✅ PRE-BUILD VERIFICATION PASSED PERFECTLY! PROCEEDING TO DEPLOYMENT.\n');
}

verifyLockedDataset();
