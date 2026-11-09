import React from 'react';

export default function Navbar({ activeTab, setActiveTab, language, setLanguage, resultsAvailable }) {
  const isTe = language === 'te';

  const navItems = [
    { id: 'home', label: isTe ? '🏠 హోమ్' : '🏠 Home' },
    { id: 'assistant', label: isTe ? '🎙️ వాయిస్ అసిస్టెంట్' : '🎙️ Voice Assistant' },
    { id: 'results', label: isTe ? '📋 నా అర్హతలు' : '📋 Eligibility Results', highlight: resultsAvailable },
    { id: 'directory', label: isTe ? '🏛️ పథకాల నిఘంటువు' : '🏛️ Scheme Directory' },
    { id: 'studio', label: isTe ? '⚡ జ్ఞాని AI స్టూడియో' : '⚡ Gnani AI Studio' },
  ];

  return (
    <nav className="main-navbar">
      <div className="nav-brand" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
        <img src="/favicon.svg" alt="JanSeva AI" width="28" height="28" style={{ borderRadius: 6 }} />
        <div className="nav-title-block">
          <span className="nav-title">JanSeva AI</span>
          <span className="nav-subtitle">సార్వభౌమ సంక్షేమ సహాయకుడు</span>
        </div>
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-tab-btn ${activeTab === item.id ? 'active' : ''} ${item.highlight ? 'has-results' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
            {item.highlight && <span className="nav-dot-badge" />}
          </button>
        ))}
      </div>

      <div className="nav-lang-toggle">
        <button
          type="button"
          className={`lang-pill-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          EN
        </button>
        <button
          type="button"
          className={`lang-pill-btn ${language === 'te' ? 'active' : ''}`}
          onClick={() => setLanguage('te')}
        >
          తెలుగు
        </button>
      </div>
    </nav>
  );
}
