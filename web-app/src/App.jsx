import React, { useState } from 'react';
import lockedDataset from './data/locked_dataset.json';

const SAMPLE_PRESETS = [
  "Mam can u pls help me in choosing my bust size... I measured my bust by a inch tape ..n it comes 36..wht size should I buy...pls..help me",
  "Color in reality is much darker than shown in the app photos. Kept it in shortlist for a month, but feeling underwhelmed now after receiving.",
  "Saved these block heels for 2 months. Cushioning is decent but strap length is shorter than standard UK 6.",
  "Why is Snitch's price and quality different on their official website vs Flipkart/Myntra? Would love to hear your experiences before I order."
];

export default function App() {
  const [activeTab, setActiveTab] = useState('default'); // 'default' | 'live' | 'validation' | 'methodology'
  const [evidenceTierFilter, setEvidenceTierFilter] = useState('all');

  // Live Try Mode State
  const [inputText, setInputText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [liveResult, setLiveResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [runCount, setRunCount] = useState(0);

  const tenQuestions = lockedDataset.ten_questions || [];
  const opportunityAreas = lockedDataset.opportunity_areas || [];

  const filteredQuestions = tenQuestions.filter(q => {
    if (evidenceTierFilter === 'all') return true;
    return q.evidence_tier === evidenceTierFilter;
  });

  const handleRunLivePipeline = async () => {
    if (!inputText.trim()) return;
    if (runCount >= 10) {
      alert("Live quota limit reached (10 runs max per session).");
      return;
    }

    setIsRunning(true);
    setLiveResult(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `API returned status ${response.status}`);
      }

      const data = await response.json();
      setLiveResult(data);
      setRunCount(prev => prev + 1);
    } catch (err) {
      setErrorMsg(`API Pipeline Execution Error: ${err.message}. Ensure backend API server is active at /api/process.`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid #1E293B', paddingBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛍️</span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#F9FAFB', fontFamily: 'var(--font-heading)' }}>
              Myntra Discovery Engine — Part 1 Product Synthesis
            </h1>
            <span className="badge badge-pink">Disk-Verified Baseline</span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Pre-Purchase Wishlist Friction & Intent Intelligence (22 Grounded Records | 10 Discovery Questions)
          </p>
        </div>

        {/* View Switcher Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: '#111827', padding: '5px', borderRadius: '10px', border: '1px solid #1E293B', flexWrap: 'wrap' }}>
          <button
            className={`tab-btn ${activeTab === 'default' ? 'active' : ''}`}
            onClick={() => setActiveTab('default')}
          >
            📊 Synthesis Matrix
          </button>
          <button
            className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            ⚡ Live Try Mode
          </button>
          <button
            className={`tab-btn ${activeTab === 'validation' ? 'active' : ''}`}
            onClick={() => setActiveTab('validation')}
          >
            🛡️ AI Validation & Audit
          </button>
          <button
            className={`tab-btn ${activeTab === 'methodology' ? 'active' : ''}`}
            onClick={() => setActiveTab('methodology')}
          >
            📐 Methodology & Scoring
          </button>
        </div>
      </header>

      {/* KPI Summary Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Wishlist Evidence</div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#FF3F6C', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>17 Records</div>
          <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px' }}>Q1, Q2, Q3, Q4, Q8, Q10</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supporting Decision Evidence</div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#818CF8', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>5 Records</div>
          <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px' }}>Q6, Q9 (Cross-platform price & segments)</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Directional Signal Questions</div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#F59E0B', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>3 Questions</div>
          <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px' }}>Q4 (Low Vol), Q5 (Titles), Q9 (Archetypes)</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Opportunity Score</div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#34D399', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>12.60</div>
          <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px' }}>Peer Sizing Guidance</div>
        </div>
      </div>

      {/* MODE 1: SYNTHESIS & OPPORTUNITY MATRIX */}
      {activeTab === 'default' && (
        <div>
          {/* Section 1: 5 Behavioral Opportunity Areas */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F9FAFB', fontFamily: 'var(--font-heading)' }}>
                1. Five Evidence-Backed Strategic Opportunity Areas (Ranked by Score)
              </h2>
              <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                Formula: Frequency × Source Diversity × Relevance Weight × Metric Linkage
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {opportunityAreas.map((opp, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '22px', borderLeft: `5px solid ${idx === 0 ? '#FF3F6C' : idx === 1 ? '#6366F1' : idx === 2 ? '#F59E0B' : idx === 3 ? '#10B981' : '#06B6D4'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span className="badge badge-pink">Rank #{opp.rank}</span>
                        <span className="badge badge-indigo">Theme: {opp.theme}</span>
                        <span className={`badge ${opp.confidence.includes('STRONG') ? 'badge-emerald' : opp.confidence.includes('DIRECTIONAL') || opp.confidence.includes('WEAK') ? 'badge-amber' : 'badge-indigo'}`}>{opp.confidence}</span>
                      </div>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: '700', color: '#F3F4F6', fontFamily: 'var(--font-heading)' }}>
                        {opp.opportunity_name}
                      </h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FF3F6C', fontFamily: 'var(--font-heading)' }}>{opp.opportunity_score}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: '700', letterSpacing: '0.05em' }}>OPPORTUNITY SCORE</div>
                    </div>
                  </div>

                  <p style={{ color: '#D1D5DB', fontSize: '0.92rem', marginBottom: '12px' }}>
                    <strong style={{ color: '#9CA3AF' }}>Observed Behavior:</strong> {opp.behavior}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: '#0B0F19', padding: '12px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '12px', border: '1px solid #1E293B' }}>
                    <div><span style={{ color: '#9CA3AF' }}>Grounded Frequency:</span> <strong>{opp.frequency} records</strong></div>
                    <div><span style={{ color: '#9CA3AF' }}>Cross-Source Support:</span> <strong>{opp.cross_source_support}</strong></div>
                    <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#9CA3AF' }}>Metric Linkage:</span> <strong style={{ color: '#FF527B' }}>{opp.metric_linkage}</strong></div>
                  </div>

                  <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#E5E7EB', background: 'rgba(255, 63, 108, 0.03)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #FF3F6C' }}>
                    "{opp.verbatim_quote}"
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: 10 Discovery Questions Evidence Tier Table */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F9FAFB', fontFamily: 'var(--font-heading)' }}>
                2. Discovery Question Evidence Synthesis (All 10 Brief Questions)
              </h2>

              <select
                value={evidenceTierFilter}
                onChange={e => setEvidenceTierFilter(e.target.value)}
                style={{ background: '#111827', color: '#F9FAFB', border: '1px solid #374151', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="all">All Evidence Tiers ({tenQuestions.length})</option>
                <option value="STRONG EVIDENCE">STRONG EVIDENCE</option>
                <option value="MODERATE EVIDENCE">MODERATE EVIDENCE</option>
                <option value="DIRECTIONAL SIGNAL (LOW VOLUME)">DIRECTIONAL SIGNAL (LOW VOLUME)</option>
              </select>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E293B', color: '#9CA3AF', background: '#0B0F19' }}>
                    <th style={{ padding: '12px 16px' }}>Q#</th>
                    <th style={{ padding: '12px 16px' }}>Question Focus</th>
                    <th style={{ padding: '12px 16px' }}>Three-Tier Evidence Rating</th>
                    <th style={{ padding: '12px 16px' }}>Records</th>
                    <th style={{ padding: '12px 16px' }}>Sources</th>
                    <th style={{ padding: '12px 16px' }}>Qualitative Synthesis & Verbatim Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1E293B', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#FF3F6C' }}>{q.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#E5E7EB' }}>{q.question}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${q.evidence_tier.includes('STRONG') ? 'badge-pink' : q.evidence_tier.includes('MODERATE') ? 'badge-indigo' : 'badge-amber'}`}>
                          {q.evidence_tier}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: '600' }}>{q.record_count}</td>
                      <td style={{ padding: '12px 16px', color: '#9CA3AF', fontSize: '0.8rem' }}>{q.sources.join(', ') || '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#D1D5DB', fontSize: '0.82rem' }}>
                        <div style={{ fontWeight: '500', color: '#F3F4F6', marginBottom: '4px' }}>{q.synthesis}</div>
                        {q.verbatim_evidence && q.verbatim_evidence.length > 0 && (
                          <div style={{ color: '#9CA3AF', fontStyle: 'italic', fontSize: '0.78rem' }}>
                            "{q.verbatim_evidence[0]}"
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* MODE 2: LIVE TRY MODE */}
      {activeTab === 'live' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(255, 63, 108, 0.08)', border: '1px solid rgba(255, 63, 108, 0.3)', color: '#FF527B', padding: '14px 18px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.88rem' }}>
            ⚡ <strong>REAL PIPELINE BACKEND:</strong> User feedback text is processed via backend Python API (`/api/process`) executing Stage A Gate → Layer 1 Behavioral Capture → Layer 2 Taxonomy Tagging using configured AI backend (Groq/Gemini). ({10 - runCount} runs remaining this session).
          </div>

          <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F9FAFB', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
              Test Custom Pre-Purchase Feedback
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '16px' }}>
              Paste feedback text or choose a preset to process it live through the real Python discovery pipeline:
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', textAlign: 'left' }}
                  onClick={() => setInputText(preset)}
                >
                  Preset #{idx + 1}: "{preset.slice(0, 45)}..."
                </button>
              ))}
            </div>

            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Paste raw user feedback here (e.g., 'Size chart says M for 34-inch bust, but item fits like S...')"
              style={{ width: '100%', height: '110px', background: '#0B0F19', color: '#F9FAFB', border: '1px solid #1E293B', borderRadius: '8px', padding: '12px', fontSize: '0.9rem', marginBottom: '16px', resize: 'vertical' }}
            />

            <button
              className="btn-primary"
              onClick={handleRunLivePipeline}
              disabled={isRunning || !inputText.trim()}
            >
              {isRunning ? '⚡ Executing Python Pipeline API...' : '⚡ Run Pipeline Live'}
            </button>

            {errorMsg && (
              <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#F43F5E', borderRadius: '8px', fontSize: '0.85rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}
          </div>

          {liveResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F9FAFB', fontFamily: 'var(--font-heading)' }}>
                Pipeline Execution Trace
              </h3>

              {liveResult.stage_a && (
                <div className="glass-card" style={{ padding: '18px', borderLeft: `4px solid ${liveResult.stage_a.stage_a_status === 'pass' ? '#10B981' : '#F43F5E'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ color: '#E5E7EB' }}>1. Stage A Keyword Relevance Gate</strong>
                    <span className={`badge ${liveResult.stage_a.stage_a_status === 'pass' ? 'badge-emerald' : 'badge-rose'}`}>
                      STATUS: {liveResult.stage_a.stage_a_status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
                    Score: {liveResult.stage_a.score} | Matched Criteria: {JSON.stringify(liveResult.stage_a.matched_terms)}
                  </div>
                </div>
              )}

              {liveResult.layer1 ? (
                <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #6366F1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#E5E7EB' }}>2. Layer 1 Raw Behavioral Capture</strong>
                    <span className="badge badge-indigo">Exact Substring Grounded</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.83rem', color: '#D1D5DB' }}>
                    <div><strong style={{ color: '#818CF8' }}>Observed Behavior:</strong> {liveResult.layer1.observed_behavior}</div>
                    <div><strong style={{ color: '#818CF8' }}>Consequence:</strong> {liveResult.layer1.consequence}</div>
                    <div style={{ gridColumn: '1 / -1', background: '#0B0F19', padding: '8px', borderRadius: '6px' }}>
                      <strong style={{ color: '#10B981' }}>Verbatim Grounding Span:</strong> "{liveResult.layer1.grounding_span}"
                    </div>
                  </div>
                </div>
              ) : null}

              {liveResult.layer2 ? (
                <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #FF3F6C' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#E5E7EB' }}>3. Layer 2 Taxonomy & Relevance Classification</strong>
                    <span className={`badge ${liveResult.layer2.relevance_tier === 'directly_relevant' ? 'badge-pink' : 'badge-amber'}`}>
                      {liveResult.layer2.relevance_tier}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.83rem', color: '#D1D5DB' }}>
                    <div><strong style={{ color: '#FF527B' }}>IFDO Bucket:</strong> {liveResult.layer2.bucket}</div>
                    <div><strong style={{ color: '#FF527B' }}>Seed Codes:</strong> {Array.isArray(liveResult.layer2.seed_code) ? liveResult.layer2.seed_code.join(', ') : liveResult.layer2.seed_code}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#FF527B' }}>Segment Hypothesis:</strong> {liveResult.layer2.segment_hypothesis}</div>
                    <div style={{ gridColumn: '1 / -1', background: '#0B0F19', padding: '8px', borderRadius: '6px' }}>
                      <strong style={{ color: '#34D399' }}>Verbatim Supporting Quote:</strong> "{liveResult.layer2.supporting_quote}"
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* MODE 3: AI VALIDATION & AUDIT PAGE */}
      {activeTab === 'validation' && (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#F9FAFB', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
              🛡️ AI Validation, Grounding & Source-Bias Audit
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Empirical documentation of LLM hallucination prevention, programmatic repair rules, public source biases, and negative-result rejected pool audits.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Card 1: Actual Hallucination Incidents & Fixes */}
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #FF3F6C' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FF3F6C', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                1. LLM Hallucination Incidents & Zero-Tolerance Programmatic Fixes
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.88rem' }}>
                <div style={{ background: '#0B0F19', padding: '16px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                  <div style={{ fontWeight: '700', color: '#F43F5E', marginBottom: '6px' }}>❌ Incident A: Fabricated YouTube Record IDs</div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: '8px' }}>
                    During early pilot runs, LLMs generated non-existent source IDs (e.g. `yt_123`) or hallucinated try-on quotes not present in raw disk files.
                  </p>
                  <div style={{ fontWeight: '700', color: '#34D399', fontSize: '0.82rem' }}>✅ Programmatic Fix Applied:</div>
                  <p style={{ color: '#D1D5DB', fontSize: '0.82rem' }}>
                    Implemented `validate_exact_substring()` in `grounding.py`. Every extracted ID and span is cross-checked against raw disk storage. Un-grounded outputs trigger automatic logged rejection in `grounding_failures.json`.
                  </p>
                </div>

                <div style={{ background: '#0B0F19', padding: '16px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                  <div style={{ fontWeight: '700', color: '#F43F5E', marginBottom: '6px' }}>❌ Incident B: Paraphrased PDP Quotes</div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: '8px' }}>
                    LLMs occasionally summarized customer feedback rather than copying exact character-for-character text (e.g., changing *"zip quality gap"* to *"zipper issue"*).
                  </p>
                  <div style={{ fontWeight: '700', color: '#34D399', fontSize: '0.82rem' }}>✅ Programmatic Fix Applied:</div>
                  <p style={{ color: '#D1D5DB', fontSize: '0.82rem' }}>
                    Added `repair_grounding_span()` and `repair_supporting_quote()`. Automatically performs substring matching and character repair, rejecting any text where exact string alignment fails.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Public Source Biases & Limits */}
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #F59E0B' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FBBF24', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                2. Source-Bias Findings & Platform Access Constraints
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.88rem' }}>
                <div style={{ background: '#0B0F19', padding: '16px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                  <div style={{ fontWeight: '700', color: '#FBBF24', marginBottom: '6px' }}>📱 Play Store / App Store Structural Noise Limit</div>
                  <p style={{ color: '#D1D5DB', fontSize: '0.83rem' }}>
                    Empirical data collection showed that public mobile app store reviews are <strong>99.5% dominated by post-purchase complaints</strong> (delivery delays, courier behavior, app crashes, refund status). Pre-purchase wishlist friction accounts for under <strong>0.5%</strong> of raw store reviews, necessitating strict Stage A semantic gating to isolate intent.
                  </p>
                </div>

                <div style={{ background: '#0B0F19', padding: '16px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                  <div style={{ fontWeight: '700', color: '#FBBF24', marginBottom: '6px' }}>🔒 X / Twitter 401 Paid-Tier API Block</div>
                  <p style={{ color: '#D1D5DB', fontSize: '0.83rem' }}>
                    Read-only search tests against X/Twitter API v2 returned <code>HTTP 401 Unauthorized</code>. The X API requires a paid developer tier ($100/mo Basic or $5,000/mo Pro). Per project guidelines, no unauthenticated scraping or workarounds were attempted.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: 559-Record Rejected Pool Audit */}
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #818CF8' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#818CF8', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                3. Negative-Result Audit: 559 Stage A Rejected Records (Full Disk Corpus)
              </h3>
              
              <p style={{ color: '#D1D5DB', fontSize: '0.88rem', marginBottom: '16px' }}>
                To verify Stage A gating recall, a complete LLM audit was conducted across <strong>all 559 Stage A rejected raw records</strong> on disk using Gemini 3.6 Flash & Groq LLMs:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: '#0B0F19', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #1E293B' }}>
                <div><span style={{ color: '#9CA3AF' }}>Rejected Audited:</span> <strong>559 records</strong></div>
                <div><span style={{ color: '#9CA3AF' }}>Q5 Recovered Hits:</span> <strong>6 hits (1.07%)</strong></div>
                <div><span style={{ color: '#9CA3AF' }}>Q6 Recovered Hits:</span> <strong>1 hit (0.18%)</strong></div>
                <div><span style={{ color: '#9CA3AF' }}>Q9 Recovered Hits:</span> <strong>4 hits (0.71%)</strong></div>
                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#9CA3AF' }}>Total Recovered Hits:</span> <strong style={{ color: '#34D399' }}>11 records (1.96% recovery rate)</strong></div>
              </div>

              <div style={{ fontStyle: 'italic', color: '#9CA3AF', fontSize: '0.83rem', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px' }}>
                <strong>Empirical Discovery Conclusion:</strong> The 1.96% recovery rate confirms that public fashion-shopping commentary concentrates heavily on <strong>sizing/fit (Q3)</strong> and <strong>photo-quality doubt (Q2/Q4)</strong>, with comparatively little unprompted public discussion of occasion-based choice dilemmas or explicit external trust-checking.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODE 4: METHODOLOGY & SCORING PAGE */}
      {activeTab === 'methodology' && (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#F9FAFB', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
              📐 Opportunity Scoring Methodology & Confidence Framework
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
              Mathematical formulation, factor definitions, metric linkage rationale, and programmatic confidence rules.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Mathematical Formula Card */}
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #FF3F6C' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FF3F6C', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                1. Mathematical Formula
              </h3>
              
              <div style={{ background: '#0B0F19', padding: '18px', borderRadius: '8px', textAlign: 'center', fontSize: '1.05rem', fontWeight: '700', color: '#F9FAFB', marginBottom: '16px', border: '1px solid #1E293B', fontFamily: 'monospace' }}>
                Opportunity Score = Frequency × Source Diversity Multiplier × Relevance Weight × Metric Linkage Weight
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '0.85rem' }}>
                <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                  <strong style={{ color: '#FF527B' }}>Frequency (Freq):</strong>
                  <p style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '4px' }}>
                    Count of disk-verified pre-purchase records backing the opportunity area.
                  </p>
                </div>

                <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                  <strong style={{ color: '#818CF8' }}>Source Diversity (Src):</strong>
                  <p style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '4px' }}>
                    1.0 for single source, 2.0 for cross-source support across 2+ independent channels (e.g. YouTube + PDP).
                  </p>
                </div>

                <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                  <strong style={{ color: '#34D399' }}>Relevance Weight (Rel):</strong>
                  <p style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '4px' }}>
                    Locked at 1.00 for directly relevant pre-purchase decision points.
                  </p>
                </div>

                <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                  <strong style={{ color: '#FBBF24' }}>Metric Weight (W):</strong>
                  <p style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '4px' }}>
                    Causal weight (0.80 to 1.00) measuring linkage to 30-day wishlist conversion.
                  </p>
                </div>
              </div>
            </div>

            {/* Formula Proof Table Card */}
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #34D399' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#34D399', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
                2. Score Calculations & Formula Proofs
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1E293B', color: '#9CA3AF', background: '#0B0F19' }}>
                      <th style={{ padding: '10px 14px' }}>Rank</th>
                      <th style={{ padding: '10px 14px' }}>Opportunity Area</th>
                      <th style={{ padding: '10px 14px' }}>Freq</th>
                      <th style={{ padding: '10px 14px' }}>Src</th>
                      <th style={{ padding: '10px 14px' }}>Rel</th>
                      <th style={{ padding: '10px 14px' }}>Weight</th>
                      <th style={{ padding: '10px 14px' }}>Formula Proof</th>
                      <th style={{ padding: '10px 14px' }}>Final Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #1E293B' }}>
                      <td style={{ padding: '10px 14px', fontWeight: '700', color: '#FF3F6C' }}>#1</td>
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>Peer Sizing Guidance</td>
                      <td style={{ padding: '10px 14px' }}>7</td>
                      <td style={{ padding: '10px 14px' }}>2</td>
                      <td style={{ padding: '10px 14px' }}>1.00</td>
                      <td style={{ padding: '10px 14px' }}>0.90</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>7 × 2 × 1.00 × 0.90</td>
                      <td style={{ padding: '10px 14px', fontWeight: '800', color: '#34D399' }}>12.60</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1E293B' }}>
                      <td style={{ padding: '10px 14px', fontWeight: '700', color: '#FF3F6C' }}>#2</td>
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>Occasion Choice Assistant</td>
                      <td style={{ padding: '10px 14px' }}>12</td>
                      <td style={{ padding: '10px 14px' }}>1</td>
                      <td style={{ padding: '10px 14px' }}>1.00</td>
                      <td style={{ padding: '10px 14px' }}>1.00</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>12 × 1 × 1.00 × 1.00</td>
                      <td style={{ padding: '10px 14px', fontWeight: '800', color: '#34D399' }}>12.00</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1E293B' }}>
                      <td style={{ padding: '10px 14px', fontWeight: '700', color: '#FF3F6C' }}>#3</td>
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>Cross-Platform Price Transparency</td>
                      <td style={{ padding: '10px 14px' }}>3</td>
                      <td style={{ padding: '10px 14px' }}>2</td>
                      <td style={{ padding: '10px 14px' }}>1.00</td>
                      <td style={{ padding: '10px 14px' }}>0.80</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>3 × 2 × 1.00 × 0.80</td>
                      <td style={{ padding: '10px 14px', fontWeight: '800', color: '#34D399' }}>4.80</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #1E293B' }}>
                      <td style={{ padding: '10px 14px', fontWeight: '700', color: '#FF3F6C' }}>#4</td>
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>Wishlist Price-Drop Activation</td>
                      <td style={{ padding: '10px 14px' }}>3</td>
                      <td style={{ padding: '10px 14px' }}>1</td>
                      <td style={{ padding: '10px 14px' }}>1.00</td>
                      <td style={{ padding: '10px 14px' }}>1.00</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>3 × 1 × 1.00 × 1.00</td>
                      <td style={{ padding: '10px 14px', fontWeight: '800', color: '#34D399' }}>3.00</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 14px', fontWeight: '700', color: '#FF3F6C' }}>#5</td>
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>Photo Reality Guarantee</td>
                      <td style={{ padding: '10px 14px' }}>2</td>
                      <td style={{ padding: '10px 14px' }}>1</td>
                      <td style={{ padding: '10px 14px' }}>1.00</td>
                      <td style={{ padding: '10px 14px' }}>1.00</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>2 × 1 × 1.00 × 1.00</td>
                      <td style={{ padding: '10px 14px', fontWeight: '800', color: '#34D399' }}>2.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Hard Programmatic Word Count Confidence Threshold Card */}
            <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #F59E0B' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FBBF24', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                3. Hard Structural Word-Count Confidence Threshold Rule
              </h3>
              
              <div style={{ background: '#0B0F19', padding: '16px', borderRadius: '8px', border: '1px solid #1E293B', fontSize: '0.85rem', color: '#D1D5DB' }}>
                <p style={{ marginBottom: '8px' }}>
                  To prevent inflation of short unelaborated title posts, a programmatic confidence threshold is strictly enforced by code:
                </p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong style={{ color: '#34D399' }}>STRONG EVIDENCE:</strong> Word count &gt; 15 words AND contains specific product/behavior detail (e.g. multi-week holding, zip defect, exact footbed measurement).</li>
                  <li><strong style={{ color: '#FBBF24' }}>DIRECTIONAL SIGNAL / WEAK:</strong> Word count &le; 15 words (e.g. single-sentence post titles like *"Help me choose 1 or 2"*) or low-volume pools (&le; 2 records).</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
