import React, { useState } from 'react';

const NAV_PAGES = [
  { id: 'workspace', label: 'Discovery Workspace', subtitle: 'Overview of fashion discovery findings and synthesis.' },
  { id: 'engine', label: 'How the Engine Works', subtitle: 'Pipeline architecture, Stage A keyword gate, Layer 1 & Layer 2 taxonomy rules.' },
  { id: 'explorer', label: 'Evidence Explorer', subtitle: 'Grounded verbatim customer quotes across all 10 discovery brief questions.' },
  { id: 'comparison', label: 'Opportunity Comparison', subtitle: 'Ranked strategic opportunity areas and mathematical scoring proofs.' },
  { id: 'try_it', label: 'Try It', subtitle: 'Interactive live testing interface for user feedback through backend Python API.' }
];

export default function App() {
  const [activePage, setActivePage] = useState('workspace');

  const currentPage = NAV_PAGES.find(p => p.id === activePage) || NAV_PAGES[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F6' }}>
      
      {/* Top Header & Flat 5-Page Navigation Bar */}
      <header className="nav-header">
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛍️</span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#282C3F', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
                Myntra Discovery Engine
              </h1>
            </div>
          </div>

          {/* 5 Flat Navigation Tabs */}
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

      {/* Main Content Shell for Active Page */}
      <main className="page-container">
        <div className="page-card">
          <h2 className="page-title">{currentPage.label}</h2>
          <p className="page-subtitle">{currentPage.subtitle}</p>
        </div>
      </main>

    </div>
  );
}
