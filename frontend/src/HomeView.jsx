import React from 'react';

export default function HomeView({ language, onStartVoice, onSelectPreset, presets, onOpenDirectory, onOpenStudio }) {
  const isTe = language === 'te';

  return (
    <div className="home-view-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-badge">
          <span>🇮🇳</span> {isTe ? 'భారతీయ సార్వభౌమ AI • డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్' : 'Sovereign Indic AI • Digital Public Good'}
        </div>
        <h1 className="hero-title">
          {isTe ? 'మీ గొంతు. మీ హక్కులు. మీ ప్రభుత్వ సంక్షేమం.' : 'Your Voice. Your Rights. Your Government Benefits.'}
        </h1>
        <p className="hero-description">
          {isTe
            ? 'భారతీయ పౌరుల కోసం జ్ఞాని AI యొక్క ప్రిజ్మా v3.0 (STT), టింబ్రే v3.0 (TTS), మరియు ఎవోన్ v3.3 (రీజనింగ్) లతో రూపొందించబడిన వాయిస్-ఫస్ట్ సంక్షేమ సహాయకుడు.'
            : "India's premier voice-first welfare entitlement platform powered natively by Gnani AI's Prisma v3.0, Timbre v3.0, and Evon v3.3 models with 100% deterministic Gazette verification."}
        </p>

        <div className="hero-cta-group">
          <button type="button" className="btn-hero-primary" onClick={onStartVoice}>
            🎙️ {isTe ? 'వాయిస్ ద్వారా ప్రారంభించండి' : 'Start Voice Assistant'}
          </button>
          <button type="button" className="btn-hero-secondary" onClick={onOpenDirectory}>
            🏛️ {isTe ? 'అన్ని పథకాలను పరిశీలించండి' : 'Browse 10 Verified Schemes'}
          </button>
        </div>

        {/* Live Metrics */}
        <div className="metrics-strip">
          <div className="metric-item">
            <span className="metric-val">10</span>
            <span className="metric-lbl">{isTe ? 'కేంద్ర & రాష్ట్ర పథకాలు' : 'Verified Gazette Schemes'}</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">100%</span>
            <span className="metric-lbl">{isTe ? 'జీరో-హాలూసినేషన్ గ్యారెంటీ' : 'Deterministic Guarantee'}</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">₹5.5L+</span>
            <span className="metric-lbl">{isTe ? 'గరిష్ట వార్షిక ప్రయోజనాలు' : 'Max Entitlement Value'}</span>
          </div>
          <div className="metric-item">
            <span className="metric-val">380ms</span>
            <span className="metric-lbl">{isTe ? 'సగటు వాయిస్ ప్రతిస్పందన' : 'Prisma v3.0 Voice Latency'}</span>
          </div>
        </div>
      </section>

      {/* Citizen Category Pathways */}
      <section className="home-section">
        <div className="section-title-row">
          <div>
            <h2 className="section-title">👥 {isTe ? 'పౌరుల వర్గాల వారీగా సంక్షేమ పథకాలు' : 'Explore Welfare by Citizen Category'}</h2>
            <p className="section-subtitle">
              {isTe
                ? 'మీ వృత్తి మరియు నేపథ్యం ప్రకారం వర్తించే కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ ప్రయోజనాలను తెలుసుకోండి.'
                : 'Select your citizen background to explore targeted Central and State welfare entitlements and eligibility requirements.'}
            </p>
          </div>
          <span className="synthetic-badge">{isTe ? 'ప్రత్యక్ష అర్హత విశ్లేషణ' : 'Direct Eligibility Assessment'}</span>
        </div>

        <div className="preset-grid-cards">
          {presets.map((p) => (
            <div key={p.id} className="preset-card" onClick={() => onSelectPreset(p.id)}>
              <div className="preset-card-top">
                <span className="preset-name">{isTe ? p.name_te : p.name}</span>
                <span className="preset-badge">{p.badge}</span>
              </div>
              <p className="preset-desc">{isTe ? p.description_te : p.description}</p>
              <div className="preset-card-footer">
                <span className="preset-action">{isTe ? 'అర్హతలు చూడండి →' : 'View Matching Schemes →'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="home-section">
        <h2 className="section-title">🏛️ {isTe ? 'జనసేవ AI ప్రధాన మూలస్తంభాలు' : 'Core Sovereign Architecture Pillars'}</h2>
        <div className="pillars-grid">
          <div className="pillar-card">
            <span className="pillar-icon">⚖️</span>
            <h3>{isTe ? 'జీరో హాలూసినేషన్ పాలసీ గార్డ్‌రైల్' : 'Zero-Hallucination Policy Engine'}</h3>
            <p>
              {isTe
                ? 'చట్టబద్ధమైన అర్హతను సాధారణ AI అంచనా వేయదు; కేంద్ర ప్రభుత్వ గెజిట్ నోటిఫికేషన్ నిబంధనల ప్రకారం గణిత శాస్త్ర ఖచ్చితత్వంతో లెక్కిస్తుంది.'
                : 'Civic entitlement cannot rely on probabilistic AI guesses. Rules are parsed clause-by-clause from Ministry Gazettes and evaluated via formal relational logic.'}
            </p>
          </div>

          <div className="pillar-card">
            <span className="pillar-icon">🎙️</span>
            <h3>{isTe ? 'సహజ కోడ్-మిక్స్డ్ తెలుగు స్పీచ్' : 'Native Indic Code-Mixing (Prisma v3.0)'}</h3>
            <p>
              {isTe
                ? 'గ్రామీణ మరియు పట్టణ తెలుగు మాట్లాడే పౌరుల మిశ్రమ భాషా శైలిని (ఉదా: "కాలేజీ స్టూడెంట్", "స్కాలర్‌షిప్", "ఆదాయం 1.5 లక్ష") నేరుగా గుర్తిస్తుంది.'
                : 'Trained on 14M+ hours of telephonic audio, Gnani Prisma v3.0 natively recognizes colloquial speech and Telugu-English code-mixed dialects.'}
            </p>
          </div>

          <div className="pillar-card">
            <span className="pillar-icon">💡</span>
            <h3>{isTe ? 'సార్వభౌమ రీజనింగ్ కౌన్సిలర్' : 'Sovereign Counselor (Evon v3.3)'}</h3>
            <p>
              {isTe
                ? 'జ్ఞాని ఎవోన్ v3.3 30B MoE మోడల్ ద్వారా పౌరుడి అర్హతలను సానుభూతితో వివరిస్తుంది మరియు మీసేవ / గ్రామ సచివాలయాల నుండి పత్రాల సేకరణను సులభతరం చేస్తుంది.'
                : "Gnani Evon v3.3 acts as a grounded welfare counselor, translating legal criteria into empathetic Telugu and English guidance with MeeSeva procurement steps."}
            </p>
          </div>

          <div className="pillar-card highlight-studio" onClick={onOpenStudio} style={{ cursor: 'pointer' }}>
            <span className="pillar-icon">🔬</span>
            <h3>{isTe ? 'జ్ఞాని AI ఆర్కిటెక్చర్ స్టూడియో' : 'Gnani AI Studio & Model Lab ↗'}</h3>
            <p>
              {isTe
                ? 'ప్రిజ్మా, టింబ్రే మరియు ఎవోన్ మోడళ్ల లైవ్ టెలిమెట్రీ మరియు ప్రాంప్ట్ గ్రౌండింగ్ ఆర్కిటెక్చర్‌ను పరిశీలించండి.'
                : 'Live diagnostic dashboard for competition judges inspecting Prisma STT latency, Timbre speech prosody, and Evon prompt grounding.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
