import React, { useState } from 'react';
import lockedDataset from './data/locked_dataset.json';

const SAMPLE_PRESETS = [
  "Mam can u pls help me in choosing my bust size... I measured my bust by a inch tape ..n it comes 36..wht size should I buy...pls..help me",
  "Color in reality is much darker than shown in the app photos. Kept it in shortlist for a month, but feeling underwhelmed now after receiving.",
  "Saved these block heels for 2 months. Cushioning is decent but strap length is shorter than standard UK 6.",
  "Why is Snitch's price and quality different on their official website vs Flipkart/Myntra? Would love to hear your experiences before I order."
];

export default function App() {
  const [activeTab, setActiveTab] = useState('default'); // 'default' | 'live'
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid #1F2937', paddingBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#F9FAFB' }}>
              Myntra Discovery Engine — Part 1 Product Synthesis
            </h1>
            <span className="badge badge-emerald">Disk-Verified Dataset</span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
            Pre-Purchase Wishlist Friction & Intent Intelligence (22 Verified Records | 10 Discovery Questions)
          </p>
        </div>

        {/* View Switcher Mode Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: '#111827', padding: '4px', borderRadius: '10px', border: '1px solid #1F2937' }}>
          <button
            className={`tab-btn ${activeTab === 'default' ? 'active' : ''}`}
            onClick={() => setActiveTab('default')}
          >
            📊 Synthesis & Opportunity Matrix
          </button>
          <button
            className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            ⚡ Live Try Mode
          </button>
        </div>
      </header>

      {/* KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Direct Wishlist Evidence</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10B981', marginTop: '4px' }}>17 Records</div>
          <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px' }}>Q1, Q2, Q3, Q4, Q8, Q10</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Supporting Decision Evidence</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366F1', marginTop: '4px' }}>5 Records</div>
          <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px' }}>Q6, Q9 (Cross-platform price & segments)</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Insufficient Evidence Questions</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#F59E0B', marginTop: '4px' }}>3 Questions</div>
          <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px' }}>Q5, Q6 trust, Q7 (Part 3 Interviews)</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Top Opportunity Score</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#06B6D4', marginTop: '4px' }}>12.60</div>
          <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px' }}>Peer Sizing Guidance</div>
        </div>
      </div>

      {/* MODE 1: SYNTHESIS & OPPORTUNITY MATRIX */}
      {activeTab === 'default' && (
        <div>
          {/* Section 1: 5 Behavioral Opportunity Areas */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F9FAFB' }}>
                1. Strongest Behavioral Opportunity Areas (Ranked by Score)
              </h2>
              <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                Formula: Frequency × Source Count × Relevance × Metric Linkage
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {opportunityAreas.map((opp, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '20px', borderLeft: `5px solid ${idx === 0 ? '#10B981' : idx === 1 ? '#6366F1' : idx === 2 ? '#F59E0B' : '#06B6D4'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span className="badge badge-emerald">Rank #{opp.rank}</span>
                        <span className="badge badge-indigo">Theme: {opp.theme}</span>
                        <span className={`badge ${opp.confidence.includes('HIGH') ? 'badge-emerald' : 'badge-amber'}`}>{opp.confidence}</span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#F3F4F6' }}>
                        {opp.opportunity_name}
                      </h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#10B981' }}>{opp.opportunity_score}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>OPPORTUNITY SCORE</div>
                    </div>
                  </div>

                  <p style={{ color: '#D1D5DB', fontSize: '0.9rem', marginBottom: '12px' }}>
                    <strong style={{ color: '#9CA3AF' }}>Observed Behavior:</strong> {opp.behavior}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: '#0B0F17', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '12px' }}>
                    <div><span style={{ color: '#9CA3AF' }}>Frequency:</span> <strong>{opp.frequency} records</strong></div>
                    <div><span style={{ color: '#9CA3AF' }}>Cross-Source Support:</span> <strong>{opp.cross_source_support}</strong></div>
                    <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#9CA3AF' }}>Metric Linkage:</span> <strong style={{ color: '#818CF8' }}>{opp.metric_linkage}</strong></div>
                  </div>

                  <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#E5E7EB', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #10B981' }}>
                    "{opp.verbatim_quote}"
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: 10 Discovery Questions Evidence Tier Table */}
          <section style={{ marginBottom: '44px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F9FAFB' }}>
                2. Discovery Question Evidence Synthesis (All 10 Brief Questions)
              </h2>

              <select
                value={evidenceTierFilter}
                onChange={e => setEvidenceTierFilter(e.target.value)}
                style={{ background: '#111827', color: '#F9FAFB', border: '1px solid #374151', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="all">All Evidence Tiers ({tenQuestions.length})</option>
                <option value="Direct Wishlist/Pre-Purchase Evidence">Direct Wishlist/Pre-Purchase</option>
                <option value="Supporting Pre-Purchase Fashion Decision Evidence">Supporting Pre-Purchase</option>
                <option value="Insufficient Evidence">Insufficient Evidence</option>
              </select>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1F2937', color: '#9CA3AF', background: '#0B0F17' }}>
                    <th style={{ padding: '12px 16px' }}>Q#</th>
                    <th style={{ padding: '12px 16px' }}>Question Focus</th>
                    <th style={{ padding: '12px 16px' }}>Evidence Strength Tier</th>
                    <th style={{ padding: '12px 16px' }}>Records</th>
                    <th style={{ padding: '12px 16px' }}>Sources</th>
                    <th style={{ padding: '12px 16px' }}>Qualitative Synthesis & Verbatim Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1F2937', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#6366F1' }}>{q.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#E5E7EB' }}>{q.question}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${q.evidence_tier.includes('Direct') ? 'badge-emerald' : q.evidence_tier.includes('Supporting') ? 'badge-indigo' : 'badge-amber'}`}>
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

          {/* Section 3: AI-Risk & Evidence-Confidence Explanation */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F9FAFB', marginBottom: '16px' }}>
              3. AI-Risk & Evidence-Confidence Framework
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>
                  🛡️ Zero-Hallucination Substring Grounding
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                  Every extracted span and quote is programmatically validated against raw disk text (`grounding.py`). Un-grounded LLM outputs are automatically discarded.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#F59E0B', marginBottom: '8px' }}>
                  📊 Public Data Noise & Bias Mitigation
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                  Public app reviews and YouTube comments are 99.5% dominated by post-purchase complaints and creator compliments. Pre-purchase friction is strictly isolated via Stage A gating.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#6366F1', marginBottom: '8px' }}>
                  🎯 Primary Research Hand-off (Part 3)
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                  Questions with insufficient unprompted evidence (Q5 choice dilemmas, Q7 styling gaps) are explicitly flagged for direct investigation in Part 3 user interviews.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* MODE 2: LIVE TRY MODE (REAL PYTHON PIPELINE API BACKEND) */}
      {activeTab === 'live' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Quota Disclaimer Banner */}
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#FBBF24', padding: '14px 18px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.88rem' }}>
            ⚡ <strong>REAL PIPELINE BACKEND NOTICE:</strong> User feedback text is processed via backend Python API (`/api/process`) executing Stage A Gate → Layer 1 Behavioral Capture → Layer 2 Taxonomy Tagging using configured AI backend (Groq/Gemini). ({10 - runCount} runs remaining this session).
          </div>

          {/* Input Sandbox Card */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F9FAFB', marginBottom: '8px' }}>
              Test Custom Pre-Purchase Feedback
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '16px' }}>
              Paste feedback text or choose a preset to process it live through the real Python discovery pipeline:
            </p>

            {/* Presets */}
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

            {/* Textarea Input */}
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Paste raw user feedback here (e.g., 'Size chart says M for 34-inch bust, but item fits like S...')"
              style={{ width: '100%', height: '110px', background: '#0B0F17', color: '#F9FAFB', border: '1px solid #374151', borderRadius: '8px', padding: '12px', fontSize: '0.9rem', marginBottom: '16px', resize: 'vertical' }}
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

          {/* Live Step Execution Results */}
          {liveResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F9FAFB' }}>
                Pipeline Execution Trace
              </h3>

              {/* Stage A Gate */}
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

              {/* Layer 1 Behavioral Capture */}
              {liveResult.layer1 ? (
                <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #6366F1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#E5E7EB' }}>2. Layer 1 Raw Behavioral Capture</strong>
                    <span className="badge badge-indigo">Exact Substring Grounded</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.83rem', color: '#D1D5DB' }}>
                    <div><strong style={{ color: '#818CF8' }}>Observed Behavior:</strong> {liveResult.layer1.observed_behavior}</div>
                    <div><strong style={{ color: '#818CF8' }}>Consequence:</strong> {liveResult.layer1.consequence}</div>
                    <div style={{ gridColumn: '1 / -1', background: '#0B0F17', padding: '8px', borderRadius: '6px' }}>
                      <strong style={{ color: '#10B981' }}>Verbatim Grounding Span:</strong> "{liveResult.layer1.grounding_span}"
                    </div>
                  </div>
                </div>
              ) : (
                liveResult.stage_a?.stage_a_status === 'pass' && (
                  <div className="glass-card" style={{ padding: '14px', borderLeft: '4px solid #F59E0B', color: '#F59E0B', fontSize: '0.85rem' }}>
                    Layer 1 Extraction: Grounding validation failed or no behavioral signal captured.
                  </div>
                )
              )}

              {/* Layer 2 Taxonomy Mapping */}
              {liveResult.layer2 ? (
                <div className="glass-card" style={{ padding: '18px', borderLeft: '4px solid #F59E0B' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#E5E7EB' }}>3. Layer 2 Taxonomy & Relevance Classification</strong>
                    <span className={`badge ${liveResult.layer2.relevance_tier === 'directly_relevant' ? 'badge-emerald' : 'badge-amber'}`}>
                      {liveResult.layer2.relevance_tier}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.83rem', color: '#D1D5DB' }}>
                    <div><strong style={{ color: '#FBBF24' }}>IFDO Bucket:</strong> {liveResult.layer2.bucket}</div>
                    <div><strong style={{ color: '#FBBF24' }}>Seed Codes:</strong> {Array.isArray(liveResult.layer2.seed_code) ? liveResult.layer2.seed_code.join(', ') : liveResult.layer2.seed_code}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#FBBF24' }}>Segment Hypothesis:</strong> {liveResult.layer2.segment_hypothesis}</div>
                    <div style={{ gridColumn: '1 / -1', background: '#0B0F17', padding: '8px', borderRadius: '6px' }}>
                      <strong style={{ color: '#10B981' }}>Verbatim Supporting Quote:</strong> "{liveResult.layer2.supporting_quote}"
                    </div>
                  </div>
                </div>
              ) : (
                liveResult.layer1 && (
                  <div className="glass-card" style={{ padding: '14px', borderLeft: '4px solid #F59E0B', color: '#F59E0B', fontSize: '0.85rem' }}>
                    Layer 2 Taxonomy Mapping: Non-relevant or missing controlled seed codes.
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
