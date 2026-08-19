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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      
      {/* 2. Sticky Header with 12px Dot Logo + Text Wordmark & Plain Text Nav Tabs */}
      <header className="sticky-header">
        <div className="header-container">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="brand-dot"></span>
            <span style={{ fontSize: '1.05rem', fontWeight: '500', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              Myntra Discovery Engine
            </span>
          </div>

          <nav className="nav-tabs">
            {NAV_PAGES.map(page => (
              <button
                key={page.id}
                className={`nav-tab ${activePage === page.id ? 'active' : ''}`}
                onClick={() => setActivePage(page.id)}
              >
                {page.label}
              </button>
            ))}
          </nav>

        </div>
      </header>

      {/* 4. Single-Column Page Layout (Max Width 1080px) */}
      <main className="page-layout">
        
        {/* DISCOVERY WORKSPACE PAGE */}
        {activePage === 'workspace' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
            
            {/* 5. Stat Cards (Top Numbers Side by Side) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              
              <div className="stat-card">
                <div className="stat-number">979</div>
                <div className="stat-label">feedback items analysed</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">5</div>
                <div className="stat-label">blockers detected</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">4</div>
                <div className="stat-label">sources</div>
              </div>

            </div>

            {/* 6. Findings List (Stacked Vertical Document List - No Grid Cards) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                  Where the Opportunity Is
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Pre-purchase friction patterns detected across customer feedback.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Finding 1 */}
                <div className="finding-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="pill-strong">Strong Evidence</span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                        Wishlist Price-Drop & Restock Activation
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>3 items</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '8px' }}>
                    Customers save items in wishlist for weeks or months waiting for sale price drops.
                  </p>

                  <button
                    onClick={() => toggleExpand('finding_1')}
                    style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['finding_1'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['finding_1'] && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      <div style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '6px' }}>
                        "Kept in wishlist for weeks, bought on price drop but zip quality gap. (pdp_rev_110)"
                      </div>
                      <div><strong>Source:</strong> Myntra PDP Reviews</div>
                    </div>
                  )}
                </div>

                {/* Finding 2 */}
                <div className="finding-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="pill-moderate">Moderate Evidence</span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                        Peer Sizing & Creator Body Measurement Guidance
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>7 items</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '8px' }}>
                    Customers ask creators for try-on height, waist, and bust measurements to eliminate fit doubt.
                  </p>

                  <button
                    onClick={() => toggleExpand('finding_2')}
                    style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['finding_2'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['finding_2'] && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      <div style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '6px' }}>
                        "Which size do u wear ? (yt_UgzVyaf2RGHG6Vw4II14)"
                      </div>
                      <div><strong>Sources:</strong> YouTube Comments, Myntra PDP Q&A</div>
                    </div>
                  )}
                </div>

                {/* Finding 3 */}
                <div className="finding-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="pill-moderate">Moderate Evidence</span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                        Cross-Platform Price & Trust Transparency
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>3 items</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '8px' }}>
                    Customers research brand official website pricing versus Myntra and check cancellation fee policies.
                  </p>

                  <button
                    onClick={() => toggleExpand('finding_3')}
                    style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['finding_3'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['finding_3'] && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      <div style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '6px' }}>
                        "Why is Snitch's price and quality different on official website vs Flipkart/Myntra? (reddit_t3_1nywvf3)"
                      </div>
                      <div><strong>Sources:</strong> Reddit, YouTube Comments</div>
                    </div>
                  )}
                </div>

                {/* Finding 4 */}
                <div className="finding-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="pill-directional">Early Signal</span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                        Fabric Transparency & Photo Reality Guarantee
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>2 items</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '8px' }}>
                    Customers hesitate in wishlist due to uncertainty whether studio photos hide thin translucent fabric.
                  </p>

                  <button
                    onClick={() => toggleExpand('finding_4')}
                    style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['finding_4'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['finding_4'] && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      <div style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '6px' }}>
                        "Color in reality is much darker than shown in the app photos. Kept it in shortlist for a month... (pdp_rev_103)"
                      </div>
                      <div><strong>Source:</strong> Myntra PDP Reviews</div>
                    </div>
                  )}
                </div>

                {/* Finding 5 */}
                <div className="finding-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="pill-directional">Early Signal</span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                        Occasion-Based Shortlist Choice Assistant
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>12 items</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '8px' }}>
                    Short posts asking for community help choosing between shortlisted outfits for specific events.
                  </p>

                  <button
                    onClick={() => toggleExpand('finding_5')}
                    style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['finding_5'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['finding_5'] && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      <div style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '6px' }}>
                        "Help me choose one dress for reception party (reddit_rss_t3_1k48pyu)"
                      </div>
                      <div><strong>Source:</strong> Reddit (r/IndianFashionAddicts)</div>
                    </div>
                  )}
                </div>

                {/* Finding 6 */}
                <div className="finding-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="pill-directional">Early Signal</span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                        User Segment Behavioral Archetypes
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>19 items</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '8px' }}>
                    Segment patterns (Occasion-Driven, Fit-Sensitive) derived from pre-purchase shopping inquiries.
                  </p>

                  <button
                    onClick={() => toggleExpand('finding_6')}
                    style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['finding_6'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['finding_6'] && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      <div style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '6px' }}>
                        "Help me choose what to wear for my very close friend's engagement! (reddit_rss_t3_1d82ls4)"
                      </div>
                      <div><strong>Sources:</strong> Reddit, Myntra PDP Reviews</div>
                    </div>
                  )}
                </div>

              </div>
            </section>

            {/* 7 & 10. Observations Section (Clean Document List - Colored Arrow Takeaways) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                  Observations
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Empirical findings from data collection and audit analysis.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Observation 1 */}
                <div className="finding-row">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>
                    Public Reviews Skew Post-Purchase
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    Mobile app store reviews are 99.5% dominated by delivery delays, courier behavior, and refund disputes.
                  </p>
                  <div className="takeaway-arrow">
                    → Pre-purchase friction requires targeted semantic filtering to isolate true buyer intent.
                  </div>

                  <button
                    onClick={() => toggleExpand('obs_1')}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['obs_1'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['obs_1'] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      Pre-purchase wishlist friction accounts for under 0.5% of raw store reviews, necessitating strict semantic gating to isolate true pre-purchase buyer intent.
                    </div>
                  )}
                </div>

                {/* Observation 2 */}
                <div className="finding-row">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>
                    Product Detail Page Reviews Are Strongest Source
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    PDP customer reviews and Q&A provide the highest-density evidence for wishlist holding causes.
                  </p>
                  <div className="takeaway-arrow">
                    → PDP reviews reveal exact zip quality gaps, multi-week price-drop waiting, and photo color discrepancies.
                  </div>

                  <button
                    onClick={() => toggleExpand('obs_2')}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['obs_2'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['obs_2'] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      Presents character-grounded evidence detailing zip defects, multi-week sale price-drop holding behavior, and studio photo color discrepancies.
                    </div>
                  )}
                </div>

                {/* Observation 3 */}
                <div className="finding-row">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>
                    X / Twitter Excluded Due to Paid API Access Block
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    Read-only search API tests returned HTTP 401 Unauthorized requiring paid developer subscription.
                  </p>
                  <div className="takeaway-arrow">
                    → Search API access requires a paid developer tier ($100/mo Basic or $5,000/mo Pro); no workarounds attempted.
                  </div>

                  <button
                    onClick={() => toggleExpand('obs_3')}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['obs_3'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['obs_3'] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      X/Twitter API v2 search endpoint requires $100/mo Basic or $5,000/mo Pro. Per project instructions, no unauthenticated web scraping workarounds were attempted.
                    </div>
                  )}
                </div>

                {/* Observation 4 */}
                <div className="finding-row">
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>
                    Rejected-Pool Audit Confirms Pre-Purchase Signal Scarcity
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    Full audit of 559 rejected raw records yielded only 11 sparse hits (1.96% signal rate).
                  </p>
                  <div className="takeaway-arrow">
                    → Confirms unprompted public commentary concentrates heavily on sizing and fit rather than shortlist comparison.
                  </div>

                  <button
                    onClick={() => toggleExpand('obs_4')}
                    style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--brand-dark)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    {expandedCards['obs_4'] ? '▲ Hide Detail' : '▼ Expand Detail'}
                  </button>

                  {expandedCards['obs_4'] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--ink)' }}>
                      Confirms unprompted public commentary concentrates heavily on sizing/fit rather than complex shortlist choice dilemmas.
                    </div>
                  )}
                </div>

              </div>
            </section>

          </div>
        )}

        {/* OTHER PAGE SHELLS */}
        {activePage === 'engine' && (
          <div className="finding-row">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>How the Engine Works</h2>
            <p style={{ color: 'var(--muted)', marginTop: '6px' }}>System architecture shell.</p>
          </div>
        )}

        {activePage === 'explorer' && (
          <div className="finding-row">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>Evidence Explorer</h2>
            <p style={{ color: 'var(--muted)', marginTop: '6px' }}>Verbatim quotes explorer shell.</p>
          </div>
        )}

        {activePage === 'comparison' && (
          <div className="finding-row">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>Opportunity Comparison</h2>
            <p style={{ color: 'var(--muted)', marginTop: '6px' }}>Opportunity scoring shell.</p>
          </div>
        )}

        {activePage === 'try_it' && (
          <div className="finding-row">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '600' }}>Try It</h2>
            <p style={{ color: 'var(--muted)', marginTop: '6px' }}>Interactive testing shell.</p>
          </div>
        )}

      </main>

    </div>
  );
}
