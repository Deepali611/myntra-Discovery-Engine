import React, { useState } from 'react';

const NAV_PAGES = [
  { id: 'workspace', label: 'Discovery Workspace' },
  { id: 'engine', label: 'How the Engine Works' },
  { id: 'explorer', label: 'Evidence Explorer' },
  { id: 'comparison', label: 'Opportunity Comparison' },
  { id: 'try_it', label: 'Try It' }
];

export default function App() {
  const [activePage, setActivePage] = useState('workspace');
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F6' }}>
      
      {/* Top Header & 5 Flat Navigation Tabs */}
      <header className="nav-header">
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛍️</span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#282C3F', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
                Myntra Discovery Engine
              </h1>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {NAV_PAGES.map(page => (
              <button
                key={page.id}
                className={`nav-item ${activePage === page.id ? 'active' : ''}`}
                onClick={() => setActivePage(page.id)}
              >
                {page.label}
              </button>
            ))}
          </nav>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="page-container">
        
        {/* DASHBOARD PAGE (DISCOVERY WORKSPACE) */}
        {activePage === 'workspace' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* SECTION A: 3 TOP STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Stat Card 1: Total Records Processed (Headline: 979 Records) */}
              <div className="card">
                <div style={{ color: '#535766', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Pipeline Records Processed
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#FF3F6C', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
                  979 Records
                </div>
                <div style={{ color: '#535766', fontSize: '0.8rem', marginTop: '4px' }}>
                  Breakdown: 17 Direct Wishlist + 5 Supporting Evidence (22 Grounded Baseline)
                </div>
              </div>

              {/* Stat Card 2: Distinct Opportunity Themes */}
              <div className="card">
                <div style={{ color: '#535766', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Distinct Opportunity Themes
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#282C3F', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
                  5 Themes
                </div>
                <div style={{ color: '#535766', fontSize: '0.8rem', marginTop: '4px' }}>
                  Fit, Price-Drop, Photo Reality, Trust, Occasion
                </div>
              </div>

              {/* Stat Card 3: Primary Sources Used */}
              <div className="card">
                <div style={{ color: '#535766', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Primary Sources Used
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#282C3F', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
                  4 Channels
                </div>
                <div style={{ color: '#535766', fontSize: '0.8rem', marginTop: '4px' }}>
                  Myntra PDP, YouTube, Reddit, Play Store
                </div>
              </div>

            </div>

            {/* SECTION B: WHERE THE OPPORTUNITY IS (COLLAPSED BY DEFAULT) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid #EAEAEC', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#282C3F', fontFamily: 'var(--font-heading)' }}>
                  Where the Opportunity Is
                </h2>
                <p style={{ color: '#535766', fontSize: '0.88rem', marginTop: '2px' }}>
                  Strategic themes collapsed by default (Title + One-line Summary + Tier Badge). Click 'Expand Details' for full verbatim quotes & methodology.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                
                {/* Group 1: While Item Is Wishlisted (directly_relevant) */}
                <div className="card" style={{ borderTop: '4px solid #FF3F6C' }}>
                  <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '1.05rem', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                    1. While Item Is Wishlisted
                  </div>
                  <div style={{ color: '#535766', fontSize: '0.8rem', marginBottom: '16px' }}>
                    Direct pre-purchase friction & intent (directly_relevant)
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* Theme A */}
                    <div style={{ background: '#F5F5F6', padding: '14px', borderRadius: '6px', border: '1px solid #EAEAEC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="badge badge-moderate">MODERATE EVIDENCE</span>
                        <span style={{ fontSize: '0.8rem', color: '#535766', fontWeight: '600' }}>7 Records</span>
                      </div>
                      <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '0.92rem' }}>
                        Peer Sizing & Creator Body Measurement Guidance
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#535766', marginTop: '4px' }}>
                        Asking creators for try-on height, waist, and bust measurements to eliminate fit doubt.
                      </div>

                      <button
                        onClick={() => toggleExpand('theme_a')}
                        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        {expandedCards['theme_a'] ? '▲ Hide Full Quote & Details' : '▼ Expand Full Quote & Details'}
                      </button>

                      {expandedCards['theme_a'] && (
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                          <div style={{ fontStyle: 'italic', color: '#535766', marginBottom: '6px' }}>
                            "Which size do u wear ? (yt_UgzVyaf2RGHG6Vw4II14)"
                          </div>
                          <div><strong>Cross-Source Support:</strong> 2 sources (YouTube, Myntra PDP)</div>
                          <div><strong>Metric Linkage:</strong> Conversion Rate + Return Rate Reduction RTO (Weight: 0.90)</div>
                        </div>
                      )}
                    </div>

                    {/* Theme B */}
                    <div style={{ background: '#F5F5F6', padding: '14px', borderRadius: '6px', border: '1px solid #EAEAEC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="badge badge-strong">STRONG EVIDENCE</span>
                        <span style={{ fontSize: '0.8rem', color: '#535766', fontWeight: '600' }}>3 Records</span>
                      </div>
                      <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '0.92rem' }}>
                        Wishlist Price-Drop & Restock Activation
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#535766', marginTop: '4px' }}>
                        Saving items in wishlist for weeks/months waiting for sale price drops.
                      </div>

                      <button
                        onClick={() => toggleExpand('theme_b')}
                        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        {expandedCards['theme_b'] ? '▲ Hide Full Quote & Details' : '▼ Expand Full Quote & Details'}
                      </button>

                      {expandedCards['theme_b'] && (
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                          <div style={{ fontStyle: 'italic', color: '#535766', marginBottom: '6px' }}>
                            "Kept in wishlist for weeks, bought on price drop but zip quality gap. (pdp_rev_110)"
                          </div>
                          <div><strong>Cross-Source Support:</strong> 1 source (Myntra PDP)</div>
                          <div><strong>Metric Linkage:</strong> Wishlist-to-Cart Conversion Velocity (Weight: 1.00)</div>
                        </div>
                      )}
                    </div>

                    {/* Theme C */}
                    <div style={{ background: '#F5F5F6', padding: '14px', borderRadius: '6px', border: '1px solid #EAEAEC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="badge badge-directional">DIRECTIONAL SIGNAL</span>
                        <span style={{ fontSize: '0.8rem', color: '#535766', fontWeight: '600' }}>2 Records</span>
                      </div>
                      <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '0.92rem' }}>
                        Fabric Transparency & Photo Reality Guarantee
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#535766', marginTop: '4px' }}>
                        Hesitating in wishlist due to fear that studio photos hide thin translucent fabric.
                      </div>

                      <button
                        onClick={() => toggleExpand('theme_c')}
                        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        {expandedCards['theme_c'] ? '▲ Hide Full Quote & Details' : '▼ Expand Full Quote & Details'}
                      </button>

                      {expandedCards['theme_c'] && (
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                          <div style={{ fontStyle: 'italic', color: '#535766', marginBottom: '6px' }}>
                            "Color in reality is much darker than shown in the app photos. Kept it in shortlist for a month... (pdp_rev_103)"
                          </div>
                          <div><strong>Cross-Source Support:</strong> 1 source (Myntra PDP)</div>
                          <div><strong>Metric Linkage:</strong> Wishlist-to-Cart Conversion Velocity (Weight: 1.00)</div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Group 2: Post-Purchase / Corroborating */}
                <div className="card" style={{ borderTop: '4px solid #6366F1' }}>
                  <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '1.05rem', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                    2. Post-Purchase / Corroborating
                  </div>
                  <div style={{ color: '#535766', fontSize: '0.8rem', marginBottom: '16px' }}>
                    External research & platform pricing corroboration
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* Theme D */}
                    <div style={{ background: '#F5F5F6', padding: '14px', borderRadius: '6px', border: '1px solid #EAEAEC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="badge badge-moderate">MODERATE EVIDENCE</span>
                        <span style={{ fontSize: '0.8rem', color: '#535766', fontWeight: '600' }}>3 Records</span>
                      </div>
                      <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '0.92rem' }}>
                        Cross-Platform Price & Trust Transparency
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#535766', marginTop: '4px' }}>
                        Researching brand official website pricing vs Myntra and checking cancellation fee policies.
                      </div>

                      <button
                        onClick={() => toggleExpand('theme_d')}
                        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        {expandedCards['theme_d'] ? '▲ Hide Full Quote & Details' : '▼ Expand Full Quote & Details'}
                      </button>

                      {expandedCards['theme_d'] && (
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                          <div style={{ fontStyle: 'italic', color: '#535766', marginBottom: '6px' }}>
                            "Why is Snitch's price and quality different on official website vs Flipkart/Myntra? (reddit_t3_1nywvf3)"
                          </div>
                          <div><strong>Cross-Source Support:</strong> 2 sources (Reddit, YouTube)</div>
                          <div><strong>Metric Linkage:</strong> Checkout Abandonment Rate (Weight: 0.80)</div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Group 3: Investigated, Insufficient Evidence */}
                <div className="card" style={{ borderTop: '4px solid #F59E0B' }}>
                  <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '1.05rem', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                    3. Investigated, Insufficient Evidence
                  </div>
                  <div style={{ color: '#535766', fontSize: '0.8rem', marginBottom: '16px' }}>
                    Q5/Q6/Q9 empirical findings (sparse public commentary)
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* Theme E */}
                    <div style={{ background: '#F5F5F6', padding: '14px', borderRadius: '6px', border: '1px solid #EAEAEC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="badge badge-directional">DIRECTIONAL SIGNAL</span>
                        <span style={{ fontSize: '0.8rem', color: '#535766', fontWeight: '600' }}>12 Title-Only Recs</span>
                      </div>
                      <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '0.92rem' }}>
                        Occasion-Based Shortlist Choice Assistant (Q5)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#535766', marginTop: '4px' }}>
                        Short title-only posts asking "help me choose between 2 outfits" without comment elaboration.
                      </div>

                      <button
                        onClick={() => toggleExpand('theme_e')}
                        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        {expandedCards['theme_e'] ? '▲ Hide Full Quote & Details' : '▼ Expand Full Quote & Details'}
                      </button>

                      {expandedCards['theme_e'] && (
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                          <div style={{ fontStyle: 'italic', color: '#535766', marginBottom: '6px' }}>
                            "Help me choose one dress for reception party (reddit_rss_t3_1k48pyu)"
                          </div>
                          <div><strong>Cross-Source Support:</strong> 1 source (Reddit: r/IndianFashionAddicts)</div>
                          <div><strong>Metric Linkage:</strong> Wishlist-to-Cart Conversion Velocity (Weight: 1.00)</div>
                        </div>
                      )}
                    </div>

                    {/* Theme F */}
                    <div style={{ background: '#F5F5F6', padding: '14px', borderRadius: '6px', border: '1px solid #EAEAEC' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="badge badge-directional">DIRECTIONAL SIGNAL</span>
                        <span style={{ fontSize: '0.8rem', color: '#535766', fontWeight: '600' }}>19 Hypothesized Recs</span>
                      </div>
                      <div style={{ fontWeight: '700', color: '#282C3F', fontSize: '0.92rem' }}>
                        User Segment Behavioral Archetypes (Q9)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#535766', marginTop: '4px' }}>
                        Segment patterns (Occasion-Driven, Fit-Sensitive) are hypotheses requiring Part 3 user validation.
                      </div>

                      <button
                        onClick={() => toggleExpand('theme_f')}
                        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        {expandedCards['theme_f'] ? '▲ Hide Full Quote & Details' : '▼ Expand Full Quote & Details'}
                      </button>

                      {expandedCards['theme_f'] && (
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                          <div style={{ fontStyle: 'italic', color: '#535766', marginBottom: '6px' }}>
                            "Help me choose what to wear for my very close friend's engagement! (reddit_rss_t3_1d82ls4)"
                          </div>
                          <div><strong>Cross-Source Support:</strong> 2 sources (Reddit, Myntra PDP)</div>
                          <div><strong>Metric Linkage:</strong> Hypothesis Validation Required in Part 3</div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* SECTION C: OBSERVATIONS SECTION (COLLAPSIBLE TAKEAWAYS) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid #EAEAEC', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#282C3F', fontFamily: 'var(--font-heading)' }}>
                  Observations & Key Takeaways
                </h2>
                <p style={{ color: '#535766', fontSize: '0.88rem', marginTop: '2px' }}>
                  Four empirical observations collapsed to title + one-line summary by default.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                
                {/* Takeaway Card 1 */}
                <div className="card">
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>📢</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#282C3F', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                    1. Public Reviews Skew Post-Purchase
                  </h3>
                  <p style={{ fontSize: '0.83rem', color: '#535766' }}>
                    Mobile app store reviews are 99.5% dominated by post-purchase courier, delivery, and refund disputes.
                  </p>

                  <button
                    onClick={() => toggleExpand('takeaway_1')}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['takeaway_1'] ? '▲ Hide Details' : '▼ Expand Details'}
                  </button>

                  {expandedCards['takeaway_1'] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                      Pre-purchase wishlist friction accounts for under <strong>0.5%</strong> of raw store reviews, necessitating strict Stage A semantic gating to isolate true pre-purchase buyer intent.
                    </div>
                  )}
                </div>

                {/* Takeaway Card 2 */}
                <div className="card">
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🏷️</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#282C3F', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                    2. Myntra PDP Reviews Are Strongest Pre-Purchase Source
                  </h3>
                  <p style={{ fontSize: '0.83rem', color: '#535766' }}>
                    PDP customer reviews and Q&A provide the highest-density grounded evidence for wishlist holding causes.
                  </p>

                  <button
                    onClick={() => toggleExpand('takeaway_2')}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['takeaway_2'] ? '▲ Hide Details' : '▼ Expand Details'}
                  </button>

                  {expandedCards['takeaway_2'] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                      Presents character-grounded evidence detailing zip defects, multi-week sale price-drop holding behavior, and studio photo color discrepancies.
                    </div>
                  )}
                </div>

                {/* Takeaway Card 3 */}
                <div className="card">
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🔒</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#282C3F', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                    3. X / Twitter Excluded Due to Paid-Tier Block
                  </h3>
                  <p style={{ fontSize: '0.83rem', color: '#535766' }}>
                    Read-only search API tests returned HTTP 401 Unauthorized requiring paid developer subscription.
                  </p>

                  <button
                    onClick={() => toggleExpand('takeaway_3')}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['takeaway_3'] ? '▲ Hide Details' : '▼ Expand Details'}
                  </button>

                  {expandedCards['takeaway_3'] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                      X/Twitter API v2 search endpoint requires $100/mo Basic or $5,000/mo Pro. Per project instructions, no unauthenticated web scraping workarounds were attempted.
                    </div>
                  )}
                </div>

                {/* Takeaway Card 4 */}
                <div className="card">
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🔎</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#282C3F', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                    4. 559-Record Rejected-Pool Audit Confirms Scarcity
                  </h3>
                  <p style={{ fontSize: '0.83rem', color: '#535766' }}>
                    100% LLM audit of all 559 Stage A rejected raw records yielded only 11 sparse hits (1.96% signal rate).
                  </p>

                  <button
                    onClick={() => toggleExpand('takeaway_4')}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: '#FF3F6C', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['takeaway_4'] ? '▲ Hide Details' : '▼ Expand Details'}
                  </button>

                  {expandedCards['takeaway_4'] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #EAEAEC', fontSize: '0.8rem', color: '#282C3F' }}>
                      Confirms unprompted public commentary concentrates heavily on sizing/fit rather than complex shortlist choice dilemmas.
                    </div>
                  )}
                </div>

              </div>
            </section>

          </div>
        )}

        {/* OTHER EMPTY PAGE SHELLS */}
        {activePage === 'engine' && (
          <div className="card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#282C3F', fontFamily: 'var(--font-heading)' }}>How the Engine Works</h2>
            <p style={{ color: '#535766', marginTop: '6px' }}>Pipeline architecture shell.</p>
          </div>
        )}

        {activePage === 'explorer' && (
          <div className="card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#282C3F', fontFamily: 'var(--font-heading)' }}>Evidence Explorer</h2>
            <p style={{ color: '#535766', marginTop: '6px' }}>Verbatim quotes explorer shell.</p>
          </div>
        )}

        {activePage === 'comparison' && (
          <div className="card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#282C3F', fontFamily: 'var(--font-heading)' }}>Opportunity Comparison</h2>
            <p style={{ color: '#535766', marginTop: '6px' }}>Mathematical opportunity scoring shell.</p>
          </div>
        )}

        {activePage === 'try_it' && (
          <div className="card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#282C3F', fontFamily: 'var(--font-heading)' }}>Try It</h2>
            <p style={{ color: '#535766', marginTop: '6px' }}>Live try mode API runner shell.</p>
          </div>
        )}

      </main>

    </div>
  );
}
