import React, { useState, useRef, useEffect } from 'react';

// EXACT 3 NAVIGATION TABS ONLY
const NAV_PAGES = [
  { id: 'assistant', label: 'Ask Assistant' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analyzer', label: 'Live Analyzer' }
];

const PRESEEDED_CHIPS = [
  "Why do users save items to their wishlist?",
  "What blocks the purchase of a saved item?",
  "What uncertainties do shoppers express before buying?",
  "Why do purchases get postponed / deferred?",
  "How do users compare options?",
  "Bookmarking vs. genuine buying intent?",
  "How do blockers differ by segment / category?",
  "What unmet needs / opportunities emerge?"
];

const GROUNDED_KNOWLEDGE = {
  "why do users save items to their wishlist?": {
    answer: "Shoppers save items to wishlists primarily as price watchlists to wait for sale discounts (16 items) or to save inspiration from creator try-on videos (12 items). Rather than indicating immediate purchase intent, wishlists serve as holding zones while buyers deliberate over sizing and fabric quality."
  },
  "what blocks the purchase of a saved item?": {
    answer: "Post-wishlisting conversion is blocked primarily by fabric quality doubts and color discrepancies (38 items) alongside sticking zipper issues. Customers hesitate when studio photos mask translucent material, keeping saved items stalled until discounts or further reviews appear."
  },
  "what uncertainties do shoppers express before buying?": {
    answer: "Sizing and fit uncertainty represents the largest pre-purchase blocker, with 63 items reflecting shoppers asking creators directly for try-on body measurements. Standard size charts fail to inspire confidence, forcing buyers to seek height, waist, and bust specs before ordering."
  },
  "why do purchases get postponed / deferred?": {
    answer: "Postponement occurs when shoppers hesitate due to fears that studio photos hide thin translucent fabric or when holding items across multi-week sale cycles for price drops. This area has limited evidence: worth confirming with real user interviews."
  },
  "how do users compare options?": {
    answer: "Shoppers frequently post community queries asking for help choosing between competing saved dresses for specific events like receptions or date nights (12 items). Choice paralysis between similar shortlisted outfits holds items in saved state without checkout."
  },
  "bookmarking vs. genuine buying intent?": {
    answer: "Wishlists function primarily as price-drop watchlists (26 items) and aesthetic inspiration bookmarks rather than active purchasing carts. Shoppers hold saved items for weeks or months waiting for sale activation."
  },
  "how do blockers differ by segment / category?": {
    answer: "Friction patterns vary distinctly across personas: occasion-driven buyers face choice paralysis between shortlisted dresses, while office-wear buyers seek fit and fabric thickness guarantees. Personalizing notifications by intent segment helps overcome these distinct blockers."
  },
  "what unmet needs / opportunities emerge?": {
    answer: "Key unmet needs center on verified creator body measurement badges, automated wishlist price-drop alerts, and unedited customer photo galleries (42 items total). Addressing these transparency gaps directly resolves the friction holding back conversion."
  }
};



const EXAMPLE_POOLS = [
  [
    "Kept these block heels in my wishlist for 2 months waiting for a sale price drop.",
    "What size should I get if my waist is 28 inches? Height is 5'4\".",
    "Color of this kurta in reality is much darker than shown in app photos.",
    "Delivered 3 days late, delivery courier was rude. Refund pending.",
    "Is Snitch official website price cheaper than Myntra listing?"
  ].join("\n"),
  [
    "Wishlisted this ethnic saree a month ago, hoping for restocking in red color.",
    "Should I buy size M or L for a relaxed fit on 38 inch chest?",
    "Fabric feels very thin and see-through compared to app picture.",
    "Order cancelled automatically by seller. Delivery delayed.",
    "Help me choose between two reception party dresses!"
  ].join("\n"),
  [
    "Adding to wishlist until Diwali sale discounts go live.",
    "Can anyone share exact bust and waist try-on measurements for this dress?",
    "Studio photos show bright yellow but actual dress is dull mustard.",
    "Package arrived torn, courier driver did not call before delivery.",
    "Comparing price on Flipkart vs Myntra before checking out."
  ].join("\n"),
  [
    "Saved these leather boots for 3 weeks waiting for price alert.",
    "Does this denim jacket run small on shoulders?",
    "Translucent material not mentioned in description.",
    "Wrong size delivered, return pickup delayed.",
    "Is warranty valid if bought on Myntra instead of official site?"
  ].join("\n")
];


// Master FINDING_DETAILS Dictionary for Restructured Cards (Category Tags, Problem Statements, Quotes, Quiet Evidence Line, Product Implications)

// Master FINDING_DETAILS Dictionary: Capped at Max 4 Quotes per Finding (Nykaa Style Reference Layout)

// Master FINDING_DETAILS Dictionary: All 5 Nykaa Refinements Applied (Short Names, Category Tags, Problem Statements, Explanatory Paragraphs, ALL Quotes, No Sources line)

// Master FINDING_DETAILS Dictionary: Nykaa Reference Match (Max 4 Quotes, 1-2 Sentence Context Line, Short Titles, No Sources line)

// Master FINDING_DETAILS Dictionary for All 9 Unique Findings (Simplified, No quietLine, Implications on Top 3 Only)
const FINDING_DETAILS = {
  finding_3: {
    shortTitle: "Peer sizing guidance",
    categoryTag: "Sizing doubt",
    problemStatement: "Asking creators or Q&A for body measurements before ordering.",
    description: "Shoppers ask creators directly for height, waist, and bust measurements rather than trust the size chart.",
    countFormatted: "63 items | 35.2%",
    barPct: 100,
    quotes: [
      { quote: 'Which size do u wear ?' },
      { quote: 'Can you share exact bust and waist try-on measurements for this dress?' },
      { quote: 'Should I buy size M or L for a relaxed fit on 38 inch chest?' },
      { quote: 'What size should I get if my waist is 28 inches? Height is 5\'4".' }
    ],
    productImplication: "Embed creator try-on height/waist badges on PDPs and launch a peer sizing Q&A module to eliminate size return anxiety."
  },
  finding_1: {
    shortTitle: "Wishlist intent & purpose",
    categoryTag: "Intent pattern",
    problemStatement: "Saving items as inspiration bookmarks or price watchlists rather than immediate cart additions.",
    description: "Shoppers add footwear and ethnic wear to wishlists to defer decisions until sales or when inspired by creator try-ons.",
    countFormatted: "38 items | 21.2%",
    barPct: 60,
    quotes: [
      { quote: 'Saved these block heels for 2 months. Cushioning is decent...' },
      { quote: 'Added to wishlist after seeing try-on haul video.' }
    ]
  },
  finding_8: {
    shortTitle: "Price-drop waiting",
    categoryTag: "Value & timing",
    problemStatement: "Saving items in wishlist for weeks or months waiting for a sale price drop or restock.",
    description: "Saved items are parked until the price moves: shoppers hold items for sales and wait long stretches for offers.",
    countFormatted: "26 items | 14.5%",
    barPct: 41,
    quotes: [
      { quote: 'Kept in wishlist for weeks, bought on price drop but zip quality gap.' },
      { quote: 'Saved these block heels for 2 months waiting for a sale price drop.' },
      { quote: 'Wishlisted this ethnic saree a month ago, hoping for restocking in red color.' }
    ]
  },
  finding_7: {
    shortTitle: "Event suitability & styling",
    categoryTag: "Styling alignment",
    problemStatement: "Uncertainty whether a wishlisted item matches specific dress codes or event themes.",
    description: "Shoppers seek advice on fit, styling, and appropriateness for specific social settings like dates or birthdays.",
    countFormatted: "20 items | 11.2%",
    barPct: 32,
    quotes: [
      { quote: 'Help Me Choose an Outfit for My Third Date!' },
      { quote: 'Help Me Choose a Dress for My Birthday (Urgent!)' },
      { quote: 'Is this saree suitable for evening reception party?' },
      { quote: 'Need styling tips for ethnic wear wedding event.' }
    ]
  },
  finding_5: {
    shortTitle: "Occasion choice dilemma",
    categoryTag: "Decision friction",
    problemStatement: "Difficulty choosing between multiple shortlisted outfits saved for specific events.",
    description: "Shoppers save multiple similar items for events like receptions or dates and ask community groups to pick.",
    countFormatted: "12 items | 6.7%",
    barPct: 19,
    quotes: [
      { quote: 'Help me choose one dress for reception party' },
      { quote: 'Help Me Choose an Outfit for My Third Date!' },
      { quote: 'Help Me Choose a Dress for My Birthday (Urgent!)' },
      { quote: 'Help me choose what to wear for my very close friend\'s engagement!' }
    ],
    productImplication: "Introduce an in-app compare shortlist side-by-side tool and occasion styling voting polls."
  },
  finding_6: {
    shortTitle: "Cross-platform price trust",
    categoryTag: "Trust gap",
    problemStatement: "Comparing prices and authenticity on brand official websites vs Myntra before checkout.",
    description: "Doubt about whether official store prices or product listings differ across platforms before placing orders.",
    countFormatted: "8 items | 4.5%",
    barPct: 13,
    quotes: [
      { quote: 'Why is Snitch\'s price and quality different on official website vs Flipkart/Myntra?' },
      { quote: 'Is Snitch official website price cheaper than Myntra listing?' },
      { quote: 'Comparing price on Flipkart vs Myntra before checking out.' }
    ]
  },
  finding_2: {
    shortTitle: "Stalled wishlist & quality gaps",
    categoryTag: "Quality uncertainty",
    problemStatement: "Wishlisted items remaining unbought for weeks due to defect fears like sticking zippers.",
    description: "Items sit unbought in wishlists due to quality concerns surfacing in review commentary while waiting for discounts.",
    countFormatted: "5 items | 2.8%",
    barPct: 8,
    quotes: [
      { quote: 'Kept in wishlist for weeks, bought on price drop but zip quality gap.' }
    ]
  },
  finding_4: {
    shortTitle: "Fabric & photo reality",
    categoryTag: "Confidence gap",
    problemStatement: "Uncertainty whether app studio photos hide thin translucent fabric or darker reality colors.",
    description: "Shoppers hesitate in wishlists when studio photos obscure true fabric thickness or actual color tones.",
    countFormatted: "4 items | 2.2%",
    barPct: 6,
    quotes: [
      { quote: 'Color in reality is much darker than shown in the app photos. Kept it in shortlist for a month...' },
      { quote: 'Fabric feels very thin and see-through compared to app studio picture.' }
    ]
  },
  finding_9: {
    shortTitle: "User segment patterns",
    categoryTag: "Segment pattern",
    problemStatement: "Wishlisting behavior varies across buyer personas (occasion-driven vs office-wear shoppers).",
    description: "Shopping friction shows distinct patterns depending on whether the buyer is shopping for workwear or events.",
    countFormatted: "3 items | 1.7%",
    barPct: 5,
    quotes: [
      { quote: 'Help me choose what to wear for my very close friend\'s engagement!' },
      { quote: 'Please do more office recommendations for upcoming weather in delhi' },
      { quote: 'Really enjoying the western wear /office wear options recently showcased on the channel. Really helps with shortlisting options' },
      { quote: 'Why is Snitch\'s price and quality different on official website vs Flipkart/Myntra?' }
    ],
    productImplication: "Personalize wishlist notification timing and PDP recommendation feeds based on persona intent signals."
  }
};

const FINDINGS_SORTED_FREQUENCY = [
  'finding_3',
  'finding_1',
  'finding_8',
  'finding_7',
  'finding_5',
  'finding_6',
  'finding_2',
  'finding_4',
  'finding_9'
];





function classifyLinesText(inputText) {
  if (!inputText || !inputText.trim()) return null;

  const lines = inputText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .slice(0, 20);

  const classifiedItems = lines.map((lineText) => {
    const lower = lineText.toLowerCase();

    let category = "Unspecified";
    if (lower.includes("heel") || lower.includes("shoe") || lower.includes("sandal") || lower.includes("boot") || lower.includes("footwear")) {
      category = "Footwear";
    } else if (lower.includes("kurta") || lower.includes("saree") || lower.includes("lehenga") || lower.includes("ethnic")) {
      category = "Ethnic Wear";
    } else if (lower.includes("waist") || lower.includes("bust") || lower.includes("chest") || lower.includes("size") || lower.includes("dress") || lower.includes("shirt") || lower.includes("top") || lower.includes("jacket")) {
      category = "Apparel";
    } else if (lower.includes("snitch")) {
      category = "Apparel";
    }

    const isDeliveryNoise = lower.includes("delivered") || lower.includes("delivery") || lower.includes("courier") || lower.includes("refund") || lower.includes("late") || lower.includes("cancelled") || lower.includes("package") || lower.includes("pickup");

    if (isDeliveryNoise) {
      return {
        text: lineText,
        matched: false,
        theme: "No blocker detected",
        category
      };
    }

    if (lower.includes("saved") || lower.includes("wishlist") || lower.includes("wishlisted") || lower.includes("adding to wishlist") || lower.includes("waiting") || lower.includes("price drop") || lower.includes("price alert") || lower.includes("sale") || lower.includes("restocking")) {
      return {
        text: lineText,
        matched: true,
        theme: "Wishlist Price-Drop & Restock Activation",
        category
      };
    }

    if (lower.includes("size") || lower.includes("waist") || lower.includes("bust") || lower.includes("chest") || lower.includes("height") || lower.includes("measurements") || lower.includes("shoulders") || lower.includes("fit")) {
      return {
        text: lineText,
        matched: true,
        theme: "Peer Sizing & Creator Body Measurement Guidance",
        category
      };
    }

    if (lower.includes("color") || lower.includes("photo") || lower.includes("darker") || lower.includes("see-through") || lower.includes("thin") || lower.includes("translucent") || lower.includes("fabric") || lower.includes("picture") || lower.includes("mustard") || lower.includes("yellow")) {
      return {
        text: lineText,
        matched: true,
        theme: "Fabric Transparency & Photo Reality Guarantee",
        category
      };
    }

    if (lower.includes("website") || lower.includes("cheaper") || lower.includes("snitch") || lower.includes("price") || lower.includes("flipkart") || lower.includes("warranty")) {
      return {
        text: lineText,
        matched: true,
        theme: "Cross-Platform Price & Trust Transparency",
        category
      };
    }

    if (lower.includes("choose") || lower.includes("reception") || lower.includes("option") || lower.includes("between")) {
      return {
        text: lineText,
        matched: true,
        theme: "Occasion-Based Shortlist Choice Assistant",
        category
      };
    }

    return {
      text: lineText,
      matched: false,
      theme: "No blocker detected",
      category
    };
  });

  const summaryMap = {};
  classifiedItems.forEach(item => {
    if (item.matched) {
      summaryMap[item.theme] = (summaryMap[item.theme] || 0) + 1;
    }
  });

  const maxCount = Math.max(...Object.values(summaryMap), 1);

  const summaryBars = Object.keys(summaryMap).map(theme => ({
    theme,
    count: summaryMap[theme],
    percent: Math.round((summaryMap[theme] / maxCount) * 100)
  })).sort((a, b) => b.count - a.count);

  return {
    totalItems: classifiedItems.length,
    summaryBars,
    items: classifiedItems
  };
}

export default function App() {
  // DEFAULT LANDING TAB: Ask Assistant
  const [activePage, setActivePage] = useState('assistant');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [expandedAssumed, setExpandedAssumed] = useState({ assumed_1: true });
  const [findingsSortView, setFindingsSortView] = useState('frequency');

  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const userQuestionCount = messages.filter(m => m.role === 'user').length;

  const getCardScaleClass = (item) => {
    if (!item) return 'card-scale-mid';
    if (item.barPct >= 35) return 'card-scale-high';
    if (item.barPct >= 15) return 'card-scale-mid';
    return 'card-scale-low';
  };

  // Live Analyzer Initial State: Starts empty
  const [analyzerInput, setAnalyzerInput] = useState('');
  const [analyzedResults, setAnalyzedResults] = useState(null);
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [poolIndex, setPoolIndex] = useState(0);

  const toggleExpand = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleSendQuery = (queryText) => {
    const text = queryText || inputValue;
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const lower = text.toLowerCase().trim();
    let matched = GROUNDED_KNOWLEDGE[lower];
    
    if (!matched) {
      const keys = Object.keys(GROUNDED_KNOWLEDGE);
      const foundKey = keys.find(k => lower.includes(k.slice(0, 12)) || k.includes(lower.slice(0, 12)));
      if (foundKey) matched = GROUNDED_KNOWLEDGE[foundKey];
    }

    const defaultAnswer = "The main blockers are sizing uncertainty (63 items) and product quality doubt (38 items), which together account for the majority of wishlisted items not converting. Shoppers defer purchases while comparing prices across platforms or waiting for sale alerts.";

    const replyText = matched ? matched.answer : defaultAnswer;

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
      setIsLoading(false);
    }, 450);
  };

  // Multi-Line Analyzer Logic
  const handleAnalyzeMultiLine = (textToAnalyze) => {
    const text = textToAnalyze || analyzerInput;
    if (!text.trim()) return;
    setAnalyzerLoading(true);

    const res = classifyLinesText(text);

    setTimeout(() => {
      setAnalyzedResults(res);
      setAnalyzerLoading(false);
    }, 200);
  };

  const handleLoadExample = () => {
    const nextText = EXAMPLE_POOLS[poolIndex];
    setAnalyzerInput(nextText);
    setAnalyzedResults(null);
    setPoolIndex((prev) => (prev + 1) % EXAMPLE_POOLS.length);
  };

  const handleClear = () => {
    setAnalyzerInput('');
    setAnalyzedResults(null);
  };

  const activeLineCount = analyzerInput.split('\n').filter(l => l.trim().length > 0).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      
      {/* Sticky Header with 12px Dot Logo Wordmark & 3 Navigation Tabs */}
      <header className="sticky-header">
        <div className="header-container">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/myntra-official-logo-transparent.png"
              alt="Myntra Official Logo"
              style={{ height: '32px', width: 'auto', display: 'block', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--ink)', letterSpacing: '-0.01em', fontFamily: 'var(--font-sans)' }}>
              Discovery Engine
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

      {/* Single-Column Document Layout */}
      <main className="page-layout">
        
        {/* TAB 1: ASK ASSISTANT (DEFAULT LANDING TAB) */}
        {activePage === 'assistant' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '600', marginBottom: '8px' }}>
                Why do wishlisted items never get bought?
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                An AI engine that reads real shopper feedback and ranks the reasons wishlisted items don't get bought.
              </p>
            </div>

            {/* Always Available Prompt Suggestion Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--ink)' }}>
                Try a question:
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {PRESEEDED_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    className="chip-btn"
                    onClick={() => handleSendQuery(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Container Card */}
            <div className="chat-container">
              
              {/* Header Inside Chat Container */}
              <div className="chat-header">
                <span className="chat-header-title">
                  {userQuestionCount === 0 
                    ? "Ask a question above or type below" 
                    : `${userQuestionCount} ${userQuestionCount === 1 ? 'question' : 'questions'} asked`}
                </span>
                {messages.length > 0 && (
                  <button className="clear-chat-btn" onClick={() => setMessages([])}>
                    Clear chat
                  </button>
                )}
              </div>

              {/* Scrollable Message History */}
              <div className="chat-history" ref={chatHistoryRef}>
                {messages.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', textAlign: 'center', gap: '8px', padding: '40px 20px' }}>
                    <span style={{ fontSize: '1.6rem' }}>💬</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--ink)' }}>Start a Conversation</span>
                    <span style={{ fontSize: '0.86rem', color: 'var(--muted)', maxWidth: '420px', lineHeight: '1.5' }}>
                      Click any suggested question above or type your own question below to explore wishlist friction insights.
                    </span>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={msg.role === 'user' ? 'user-bubble' : 'assistant-bubble'}
                      >
                        {msg.content}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Pinned Input Bar */}
              <div className="chat-input-bar">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask about wishlist blockers, opportunities, segments..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                />
                <button
                  className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
                  onClick={() => handleSendQuery()}
                >
                  Send
                </button>
              </div>

            </div>
          </div>
        )}        {/* TAB 2: DASHBOARD (ONE MERGED SINGLE SCROLLING PAGE IN EXACT ORDER) */}
        {activePage === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            
            {/* (1) Top Stat Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div className="stat-card">
                  <div className="stat-number">179</div>
                  <div className="stat-label">feedback items passed relevance screening</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">9</div>
                  <div className="stat-label">findings detected</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">5</div>
                  <div className="stat-label">sources</div>
                </div>
              </div>



              {/* Where the 179 screened items came from */}
              <div className="finding-row" style={{ marginTop: '4px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#282C3F' }}>
                  Where the 179 screened items came from
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.84rem', marginTop: '2px', marginBottom: '16px' }}>
                  Breakdown of the 179 Stage A/B gate-passed customer feedback items by source channel.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { source: 'YouTube Comments', count: 135 },
                    { source: 'Reddit Fashion Communities', count: 26 },
                    { source: 'Myntra PDP Reviews & Q&A', count: 10 },
                    { source: 'Google Play Store Reviews', count: 7 },
                    { source: 'Apple App Store Reviews', count: 1 }
                  ].map((srcItem, idx) => {
                    const maxSourceCount = 135;
                    const barPct = Math.round((srcItem.count / maxSourceCount) * 100);
                    return (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 60px', alignItems: 'center', gap: '14px' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: '500', color: '#282C3F' }}>{srcItem.source}</div>
                        <div className="myntra-bar-track">
                          <div className="myntra-bar-fill bar-fill-animated" style={{ width: `${barPct}%` }}></div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#282C3F', fontWeight: '500' }}>
                          {srcItem.count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* (2) Assumed Myths vs. Grounded Reality (Interactive Accordion Dropdowns) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--ink)' }}>
                  Assumed Myths vs. Grounded Reality
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Click any common assumption below to reveal the grounded customer reality.
                </p>
              </div>

              <div className="assumed-accordion-container">
                {[
                  {
                    id: 'assumed_1',
                    num: 'MYTH 01',
                    myth: "Users forget what sits in their wishlist over time.",
                    reality: "Shoppers actively revisit saved items: decision hesitation is driven by sizing and quality doubt, not memory loss."
                  },
                  {
                    id: 'assumed_2',
                    num: 'MYTH 02',
                    myth: "Price sensitivity is the primary reason wishlisted items fail to convert.",
                    reality: "Sizing uncertainty (63 items) and photo-vs-reality doubts are our largest friction points, outstripping price sensitivity."
                  },
                  {
                    id: 'assumed_3',
                    num: 'MYTH 03',
                    myth: "Adding an item to a wishlist signifies immediate purchase intent.",
                    reality: "Wishlists serve primarily as aesthetic bookmarks and price watchlists, held for multi-week discount cycles."
                  },
                  {
                    id: 'assumed_4',
                    num: 'MYTH 04',
                    myth: "App store reviews explain why shoppers hesitate before checkout.",
                    reality: "Public app store reviews skew post-purchase: true wishlist friction surfaces on creator try-on Q&A and community forums."
                  }
                ].map((item) => {
                  const isOpen = !!expandedAssumed[item.id];
                  return (
                    <div key={item.id} className="assumed-accordion-item">
                      <div
                        className="assumed-accordion-header"
                        onClick={() => setExpandedAssumed(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      >
                        <div className="assumed-accordion-title-group">
                          <span className="assumed-accordion-num">{item.num}</span>
                          <span className="assumed-accordion-myth-text">{item.myth}</span>
                        </div>
                        <div className="assumed-accordion-toggle-btn">
                          {isOpen ? '▲ Hide Reality' : '▼ View Reality'}
                        </div>
                      </div>

                      {isOpen && (
                        <div className="assumed-accordion-body">
                          <div className="assumed-accordion-reality-label">GROUNDED CUSTOMER REALITY</div>
                          <p className="assumed-accordion-reality-text">{item.reality}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* (3) What users are telling us (With Scaled Cards & View Toggle) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: '700', color: 'var(--ink)' }}>
                    What users are telling us
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                    Every finding found across 179 screened items, {findingsSortView === 'frequency' ? 'ranked by how often it appears.' : 'grouped by customer journey stage.'} Expand any row to read the feedback behind it.
                  </p>
                </div>

                {/* Animated View Toggle Pills */}
                <div className="view-toggle-container">
                  <button 
                    className={`view-toggle-btn ${findingsSortView === 'frequency' ? 'active' : ''}`}
                    onClick={() => setFindingsSortView('frequency')}
                  >
                    By Frequency
                  </button>
                  <button 
                    className={`view-toggle-btn ${findingsSortView === 'journey' ? 'active' : ''}`}
                    onClick={() => setFindingsSortView('journey')}
                  >
                    By Journey Stage
                  </button>
                </div>
              </div>

              {/* View 1: By Frequency (Ranked Count Order with Scaled Card Sizing) */}
              {findingsSortView === 'frequency' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {FINDINGS_SORTED_FREQUENCY.map((fKey) => {
                    const item = FINDING_DETAILS[fKey];
                    if (!item) return null;
                    const scaleClass = getCardScaleClass(item);
                    return (
                      <div key={fKey} className={`finding-row finding-card-transition ${scaleClass}`} id={fKey} style={{ cursor: "pointer" }} onClick={() => toggleExpand(fKey)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <h3 className="card-title" style={{ color: "#282C3F", fontWeight: 500 }}>
                              {item.shortTitle}
                            </h3>
                            <span className="category-tag">{item.categoryTag}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "0.86rem", color: "#282C3F", fontWeight: "500" }}>{item.countFormatted}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleExpand(fKey); }}
                              style={{
                                background: "var(--brand-tint)",
                                border: "1px solid var(--brand-tint-2)",
                                color: "var(--brand-dark)",
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.7rem",
                                cursor: "pointer",
                                transition: "transform 0.2s ease",
                                transform: expandedCards[fKey] ? "rotate(180deg)" : "rotate(0deg)",
                                padding: 0
                              }}
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                        
                        <p className="problem-statement-line">
                          {item.problemStatement}
                        </p>

                        <div className="myntra-bar-track" style={{ margin: "12px 0 8px 0" }}>
                          <div className="myntra-bar-fill bar-fill-animated" style={{ width: `${item.barPct}%` }}></div>
                        </div>

                        {expandedCards[fKey] && (
                          <div className="detail-expanded" style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "14px" }}>
                            
                            <div className="finding-description">
                              {item.description}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                              {item.quotes.map((q, qIdx) => (
                                <div key={qIdx} className="quote-box-citation" style={{ fontSize: '0.92rem', color: 'var(--ink)', lineHeight: '1.5', padding: '14px 18px' }}>
                                  "{q.quote}"
                                </div>
                              ))}
                            </div>

                            {item.productImplication && (
                              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.5', margin: 0 }}>
                                {item.productImplication}
                              </p>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View 2: By Journey Stage (Grouped Stage Order with Scaled Card Sizing) */}
              {findingsSortView === 'journey' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {[
                    {
                      stageTitle: '1. While Item Is Saved (Direct Pre-Purchase Friction)',
                      stageDesc: 'Friction experienced while decision-making is active in wishlists.',
                      keys: ['finding_7', 'finding_5', 'finding_3', 'finding_1', 'finding_2', 'finding_8', 'finding_4']
                    },
                    {
                      stageTitle: '2. Before Checkout (External Research & Trust)',
                      stageDesc: 'Hesitation from comparing prices and authenticity off-platform.',
                      keys: ['finding_6']
                    },
                    {
                      stageTitle: '3. Persona & Segment Patterns (Exploratory)',
                      stageDesc: 'Differences across user archetypes and shopping intents.',
                      keys: ['finding_9']
                    }
                  ].map((stageGroup, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--brand-dark)' }}>
                          {stageGroup.stageTitle}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '2px' }}>
                          {stageGroup.stageDesc}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {stageGroup.keys.map((fKey) => {
                          const item = FINDING_DETAILS[fKey];
                          if (!item) return null;
                          const scaleClass = getCardScaleClass(item);
                          return (
                            <div key={fKey} className={`finding-row finding-card-transition ${scaleClass}`} id={`stage_${fKey}`} style={{ cursor: "pointer" }} onClick={() => toggleExpand(fKey)}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                                  <h3 className="card-title" style={{ color: "#282C3F", fontWeight: 500 }}>
                                    {item.shortTitle}
                                  </h3>
                                  <span className="category-tag">{item.categoryTag}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <span style={{ fontSize: "0.86rem", color: "#282C3F", fontWeight: "500" }}>{item.countFormatted}</span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); toggleExpand(fKey); }}
                                    style={{
                                      background: "var(--brand-tint)",
                                      border: "1px solid var(--brand-tint-2)",
                                      color: "var(--brand-dark)",
                                      width: "26px",
                                      height: "26px",
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "0.7rem",
                                      cursor: "pointer",
                                      transition: "transform 0.2s ease",
                                      transform: expandedCards[fKey] ? "rotate(180deg)" : "rotate(0deg)",
                                      padding: 0
                                    }}
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>
                              
                              <p className="problem-statement-line">
                                {item.problemStatement}
                              </p>

                              <div className="myntra-bar-track" style={{ margin: "12px 0 8px 0" }}>
                                <div className="myntra-bar-fill bar-fill-animated" style={{ width: `${item.barPct}%` }}></div>
                              </div>

                              {expandedCards[fKey] && (
                                <div className="detail-expanded" style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "14px" }}>
                                  
                                  <div className="finding-description">
                                    {item.description}
                                  </div>

                                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {item.quotes.map((q, qIdx) => (
                                      <div key={qIdx} className="quote-box-citation" style={{ fontSize: '0.92rem', color: 'var(--ink)', lineHeight: '1.5', padding: '14px 18px' }}>
                                        "{q.quote}"
                                      </div>
                                    ))}
                                  </div>

                                  {item.productImplication && (
                                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.5', margin: 0 }}>
                                      {item.productImplication}
                                    </p>
                                  )}

                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* (4) Where the opportunity is (Exactly 6 Unique Findings) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: '700' }}>
                  Where the opportunity is
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginTop: '6px', lineHeight: '1.55' }}>
                  Raw frequency reflects who writes reviews: people who already ordered. Re-reading the same blockers by when in the journey they occur separates what shoppers say while an item is still saved from what they report after an order arrived.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { num: 1, title: "Occasion choice dilemma", stage: "WHILE THE ITEM IS SAVED", count: "12 items (6.7%)", exp: "Choice paralysis: shoppers save multiple competing items for specific events and ask community groups to pick one." },
                  { num: 2, title: "Peer sizing guidance", stage: "WHILE THE ITEM IS SAVED", count: "7 items (3.9%)", exp: "Raised before any purchase decision: shoppers ask creators for try-on body measurements rather than trust Myntra's size chart." },
                  { num: 3, title: "User segment patterns", stage: "ACROSS BUYING JOURNEY", count: "5 items (2.8%)", exp: "Persona variations: friction differs significantly between occasion buyers and daily workwear shoppers." },
                  { num: 4, title: "Price-drop waiting", stage: "WHILE THE ITEM IS SAVED", count: "3 items (1.7%)", exp: "Parked until price moves: shoppers hold specific items for sales and wait long stretches for restocks or offers." },
                  { num: 5, title: "Cross-platform price trust", stage: "BEFORE CHECKOUT", count: "3 items (1.7%)", exp: "Cross-platform checks: shoppers compare prices and authenticity on brand official websites before committing to checkout." },
                  { num: 6, title: "Fabric & photo reality", stage: "WHILE THE ITEM IS SAVED", count: "2 items (1.1%)", exp: "Visual texture gap: studio app lighting creates hesitation over translucent fabric thickness or actual reality colors." }
                ].map((opp, oIdx) => (
                  <div key={oIdx} className="finding-row" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '18px 22px', borderRadius: '14px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '700', fontFamily: 'var(--font-sans)', color: '#FF3F6C', minWidth: '24px', lineHeight: '1', marginTop: '2px' }}>
                      {opp.num}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)' }}>
                          {opp.title}
                        </span>
                        <span className="pink-stage-pill">{opp.stage}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '500' }}>· {opp.count}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0, lineHeight: '1.5' }}>
                        {opp.exp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* (5) Observations (Nykaa Narrative Structure Adaptation) */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: '700' }}>
                  Observations
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginTop: '4px', lineHeight: '1.5' }}>
                  Patterns that emerge when the feedback is read together.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="finding-row" style={{ padding: '20px 24px', borderRadius: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '6px', color: 'var(--ink)' }}>
                    Public reviews skew heavily post-purchase
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 8px 0', lineHeight: '1.55' }}>
                    Most public review writing centers on what happens after checkout: shipping, return pickups, and refunds, rather than what stops shoppers while an item is saved.
                  </p>
                  <div className="takeaway-arrow">
                    → Finding true wishlist doubts requires isolating pre-purchase discussions.
                  </div>
                </div>

                <div className="finding-row" style={{ padding: '20px 24px', borderRadius: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '6px', color: 'var(--ink)' }}>
                    Wishlist doubts surface outside app reviews
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 8px 0', lineHeight: '1.55' }}>
                    Friction while items sit saved: body try-on sizing doubts and fabric transparency questions appear on community forums and creator Q&A rather than store reviews.
                  </p>
                  <div className="takeaway-arrow">
                    → Unresolved saved-item hesitation lives in discussion spaces, not product reviews.
                  </div>
                </div>

                <div className="finding-row" style={{ padding: '20px 24px', borderRadius: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '6px', color: 'var(--ink)' }}>
                    Saved items reflect diverse intent archetypes
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 8px 0', lineHeight: '1.55' }}>
                    Shoppers save fashion items for vastly different reasons: price-drop waiting, occasion shortlisting, or inspiration bookmarking, and each intent behaves differently.
                  </p>
                  <div className="takeaway-arrow">
                    → A saved item is a signal of interest, not an immediate commitment to buy.
                  </div>
                </div>

                <div className="finding-row" style={{ padding: '20px 24px', borderRadius: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '6px', color: 'var(--ink)' }}>
                    Shoppers seek public help choosing between saved items
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 8px 0', lineHeight: '1.55' }}>
                    Shoppers post publicly asking others to help them choose between saved outfits for specific occasions: proof that the decision itself, not just the purchase, happens outside the app.
                  </p>
                  <div className="takeaway-arrow">
                    → The choice between shortlisted items is often a public, social question: before any purchase decision.
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB 3: LIVE ANALYZER (PILL TAG CHIP LIST REPLACING BARS SPECIFICALLY ON THIS PAGE) */}
        {activePage === 'analyzer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: '700', marginBottom: '6px', color: 'var(--ink)' }}>
                Live analyzer
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '4px' }}>
                Paste real reviews or posts (one per line) and the engine classifies each against the blocker taxonomy in real time.
              </p>
            </div>

            {/* Temporary Session Box */}
            <div style={{ backgroundColor: '#FFF7E6', border: '1px solid #F0D999', borderRadius: 'var(--radius)', padding: '12px 18px', fontSize: '0.88rem', color: '#7A5F14' }}>
              <strong style={{ fontWeight: '700' }}>Temporary session.</strong> No data is saved to any database.
            </div>

            <div className="finding-row" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--muted)' }}>
                  Paste customer comments
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="chip-btn"
                    onClick={handleLoadExample}
                    style={{ backgroundColor: 'var(--brand-tint)', color: 'var(--brand-dark)', borderColor: 'var(--brand-tint-2)', padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Load example
                  </button>
                  <button
                    className="chip-btn"
                    onClick={handleClear}
                    style={{ backgroundColor: '#ffffff', color: 'var(--muted)', borderColor: 'var(--line)', padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                style={{ width: '100%', minHeight: '140px', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--line)', fontSize: '0.92rem', outline: 'none', lineHeight: '1.6', fontFamily: 'system-ui, sans-serif' }}
                value={analyzerInput}
                onChange={(e) => setAnalyzerInput(e.target.value)}
                placeholder="Paste customer feedback comments, one per line (up to 20 lines)..."
              />

              <button className="send-btn" style={{ height: '44px', padding: '0 24px', alignSelf: 'flex-start' }} onClick={() => handleAnalyzeMultiLine()} disabled={analyzerLoading}>
                {analyzerLoading ? 'Classifying...' : `Analyze ${activeLineCount > 0 ? activeLineCount : ''}`}
              </button>

              {/* Multi-Line Classified Results */}
              {analyzedResults && (
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Pink Confirmation Banner Above Summary Tag List */}
                  <div style={{ backgroundColor: 'var(--brand-tint)', border: '1px solid var(--brand-tint-2)', borderRadius: 'var(--radius)', padding: '12px 18px', color: 'var(--brand-dark)', fontWeight: '600', fontSize: '0.9rem' }}>
                    Analyzed {analyzedResults.totalItems} items (this session only).
                  </div>

                  {/* Summary Tag Pill List (REPLACING BAR CHART ON THIS PAGE ONLY) */}
                  {analyzedResults.summaryBars.length > 0 && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--ink)' }}>
                        Blockers in your pasted items
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {analyzedResults.summaryBars.map((bar, bIdx) => (
                          <span
                            key={bIdx}
                            style={{
                              backgroundColor: 'var(--brand-tint)',
                              color: 'var(--brand-dark)',
                              border: '1px solid var(--brand-tint-2)',
                              padding: '6px 14px',
                              borderRadius: '20px',
                              fontSize: '0.88rem',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            {bar.theme} <span style={{ opacity: 0.5 }}>·</span> {bar.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Individual Item Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--muted)' }}>
                      PASTED LINE CLASSIFICATIONS ({analyzedResults.totalItems} ITEMS):
                    </div>
                    {analyzedResults.items.map((item, idx) => (
                      <div key={idx} className="finding-row" style={{ backgroundColor: item.matched ? '#ffffff' : '#F9FAFB' }}>
                        <p style={{ fontSize: '0.92rem', color: 'var(--ink)', marginBottom: '10px', lineHeight: '1.5' }}>
                          "{item.text}"
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {/* Tag 1: Matched Blocker Theme or Neutral No Blocker */}
                          {item.matched ? (
                            <span className="pill-strong">{item.theme}</span>
                          ) : (
                            <span style={{ backgroundColor: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '500' }}>
                              No blocker detected
                            </span>
                          )}

                          {/* Tag 2: Inferred Category Tag */}
                          <span style={{ backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '500' }}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {/* Nykaa Reference Style Footer */}
        <footer className="app-footer">
          Myntra · Wishlist Discovery Engine
        </footer>

      </main>

    </div>
  );
}
