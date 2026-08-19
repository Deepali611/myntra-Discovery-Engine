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
              <div className="card">
                <div style={{ color: '#535766', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Evidence Count</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#FF3F6C', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>22 Records</div>
                <div style={{ color: '#535766', fontSize: '0.82rem', marginTop: '4px' }}>17 Direct Wishlist + 5 Supporting Decision</div>
              </div>

              <div className="card">
                <div style={{ color: '#535766', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distinct Opportunity Themes</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#282C3F', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>5 Themes</div>
                <div style={{ color: '#535766', fontSize: '0.82rem', marginTop: '4px' }}>Fit, Price-Drop, Photo Reality, Trust, Occasion</div>
              </div>

              <div className="card">
                <div style={{ color: '#535766', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Sources Used</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#282C3F', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>4 Channels</div>
                <div style={{ color: '#535766', fontSize: '0.82rem', marginTop: '4px' }}>Myntra PDP, YouTube, Reddit, Play Store</div>
              </div>
            </div>

            {/* SECTION B: WHERE THE OPPORTUNITY IS (3 GROUPS) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid #EAEAEC', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#282C3F', fontFamily: 'var(--font-heading)' }}>
                  Where the Opportunity Is
                </h2>
                <p style={{ color: '#535766', fontSize: '0.88rem', marginTop: '2px' }}>
                  Strategic opportunity themes re-sorted into 3 evidence groups (Primary visual element: Evidence Tier badge).
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
                      <div style={{ fontSize: '0.8rem', color: '#535766', marginTop: '4px' }}>
                        Asking creators for try-on height, waist, and bust measurements to eliminate fit doubt.
                      </div>
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
                      <div style={{ fontSize: '0.8rem', color: '#535766', marginTop: '4px' }}>
                        Saving items in wishlist for weeks/months waiting for sale price drops.
                      </div>
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
                      <div style={{ fontSize: '0.8rem', color: '#535766', marginTop: '4px' }}>
                        Hesitating in wishlist due to fear that studio photos hide thin translucent fabric.
                      </div>
                    </div>

                  </div>
                </div>

                {/* Group 2: Post-Purchase / Corroborating (indirectly_relevant + PDP corroboration) */}
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
                      <div style={{ fontSize: '0.8rem', color: '#535766', marginTop: '4px' }}>
                        Researching brand official website pricing vs Myntra and checking platform cancellation fee policies.
                      </div>
                    </div>

                  </div>
                </div>

                {/* Group 3: Investigated, Insufficient Evidence (Q5/Q6/Q9 findings) */}
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
                      <div style={{ fontSize: '0.8rem', color: '#535766', marginTop: '4px' }}>
                        Short title-only posts asking "help me choose between 2 outfits" without comment elaboration.
                      </div>
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
                      <div style={{ fontSize: '0.8rem', color: '#535766', marginTop: '4px' }}>
                        Segment patterns (Occasion-Driven, Fit-Sensitive) are hypotheses requiring Part 3 user validation.
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* SECTION C: OBSERVATIONS SECTION (4 TAKEAWAY CARDS) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid #EAEAEC', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#282C3F', fontFamily: 'var(--font-heading)' }}>
                  Observations & Key Takeaways
                </h2>
                <p style={{ color: '#535766', fontSize: '0.88rem', marginTop: '2px' }}>
                  Four empirical observations drawn directly from backend data collection and audit findings.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                
                {/* Takeaway Card 1 */}
                <div className="card">
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>📢</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#282C3F', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                    1. Public Reviews Skew Post-Purchase
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#535766', lineHeight: '1.5' }}>
                    Mobile app store reviews are <strong>99.5% dominated by post-purchase complaints</strong> (delivery delays, courier behavior, app crashes, refund status). Pre-purchase wishlist friction accounts for under <strong>0.5%</strong> of raw store reviews, requiring strict Stage A semantic gating.
                  </p>
                </div>

                {/* Takeaway Card 2 */}
                <div className="card">
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🏷️</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#282C3F', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                    2. Myntra PDP Reviews Are Strongest Pre-Purchase Source
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#535766', lineHeight: '1.5' }}>
                    Product Detail Page customer reviews and Q&A provide the highest-density grounded evidence for wishlist holding causes (zip defects, multi-week sale waiting, color discrepancies).
                  </p>
                </div>

                {/* Takeaway Card 3 */}
                <div className="card">
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🔒</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#282C3F', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                    3. X / Twitter Excluded Due to Paid-Tier Block
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#535766', lineHeight: '1.5' }}>
                    Read-only search tests against X/Twitter API v2 returned <code>HTTP 401 Unauthorized</code>. The X API requires a paid developer tier ($100/mo Basic or $5,000/mo Pro). Per project guidelines, no unauthenticated scraping workarounds were attempted.
                  </p>
                </div>

                {/* Takeaway Card 4 */}
                <div className="card">
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🔎</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#282C3F', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                    4. 559-Record Rejected-Pool Audit Confirms Scarcity
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#535766', lineHeight: '1.5' }}>
                    A 100% LLM audit of all 559 Stage A rejected raw records yielded only 11 sparse hits (1.96% signal rate), confirming public commentary concentrates heavily on size/fit rather than complex shortlist choice.
                  </p>
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
