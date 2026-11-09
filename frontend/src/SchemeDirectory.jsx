import React, { useState, useEffect } from 'react';

const API = 'http://localhost:4000';

const CATEGORY_MAP = {
  'pms-sc': 'edu',
  'pms-obc': 'edu',
  'pm-usp-csss': 'edu',
  'nmmss': 'edu',
  'pm-kisan': 'agri',
  'pmfby': 'agri',
  'pm-kmy': 'agri',
  'pm-jay': 'health',
  'pm-svanidhi': 'live',
  'pmjjby': 'sec',
};

export default function SchemeDirectory({ language }) {
  const isTe = language === 'te';
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch(`${API}/api/schemes`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setSchemes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = schemes.filter((s) => {
    const cat = CATEGORY_MAP[s.scheme_id] || 'other';
    const matchesCat = selectedCategory === 'all' || cat === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      s.scheme_name.toLowerCase().includes(q) ||
      s.target_group.toLowerCase().includes(q) ||
      (s.issuing_authority || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="directory-view-container">
      <div className="directory-header">
        <h1 className="directory-title">
          🏛️ {isTe ? 'అధికారిక సంక్షేమ పథకాల నిఘంటువు' : 'Gazette Scheme Knowledge Vault'}
        </h1>
        <p className="directory-subtitle">
          {isTe
            ? 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ గెజిట్ నోటిఫికేషన్ల ప్రకారం ధృవీకరించబడిన 10 జాతీయ సంక్షేమ పథకాలు.'
            : 'Explore all 10 verified Government of India welfare schemes cross-referenced against official Ministry Gazette Guidelines.'}
        </p>

        {/* Search & Filters */}
        <div className="directory-search-bar">
          <input
            className="input-directory-search"
            placeholder={isTe ? 'పథకం పేరు, మంత్రిత్వ శాఖ లేదా కీలక పదం ద్వారా వెతకండి...' : 'Search schemes by title, ministry, or target group...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills-row" style={{ marginTop: 12 }}>
          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {isTe ? 'అన్నీ' : 'All Schemes'} ({schemes.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'edu' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('edu')}
          >
            🎓 {isTe ? 'విద్య' : 'Education'}
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'agri' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('agri')}
          >
            🌾 {isTe ? 'వ్యవసాయం & పెన్షన్' : 'Agriculture & Pension'}
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'health' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('health')}
          >
            🏥 {isTe ? 'ఆరోగ్యం' : 'Healthcare'}
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'live' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('live')}
          >
            💼 {isTe ? 'ఉపాధి & వ్యాపారం' : 'Micro-credit'}
          </button>
          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'sec' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('sec')}
          >
            🛡️ {isTe ? 'సామాజిక భద్రత' : 'Insurance'}
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#0369a1', fontWeight: 600 }}>⏳ Loading verified scheme records...</p>
        </div>
      )}

      {!loading && (
        <div className="directory-schemes-list">
          {filtered.map((s) => {
            const isExpanded = Boolean(expanded[s.scheme_id]);

            return (
              <div key={s.scheme_id} className="directory-scheme-card">
                <div className="dir-card-header" onClick={() => toggleExpand(s.scheme_id)} style={{ cursor: 'pointer' }}>
                  <div>
                    <h3 className="dir-scheme-title">{s.scheme_name}</h3>
                    <p className="dir-authority">🏛️ {s.issuing_authority}</p>
                    <p className="dir-target">👥 {s.target_group}</p>
                  </div>
                  <button type="button" className="btn-toggle-dir">
                    {isExpanded ? '▲ Hide' : '▼ Details'}
                  </button>
                </div>

                {/* Key Benefits Callout */}
                {s.benefits && s.benefits.length > 0 && (
                  <div className="benefit-highlight" style={{ margin: '10px 0 0' }}>
                    🎁 <strong>{isTe ? 'ప్రయోజనాలు' : 'Entitled Benefit'}:</strong> {s.benefits[0].component}
                    {s.benefits[0].amount ? ` — ${s.benefits[0].amount}` : ''}
                  </div>
                )}

                {/* Expandable Dossier */}
                {isExpanded && (
                  <div className="dir-dossier-body">
                    {/* Eligibility Rules */}
                    <div style={{ margin: '12px 0' }}>
                      <strong style={{ fontSize: 13, color: '#334155' }}>
                        ⚖️ {isTe ? 'చట్టబద్ధమైన అర్హత నిబంధనలు' : 'Statutory Eligibility Rules'}:
                      </strong>
                      <ul style={{ paddingLeft: 20, fontSize: 13, color: '#475569', marginTop: 4 }}>
                        {(s.eligibility_rules || []).map((r, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>
                            {r.description} {r.source_para && <span style={{ color: '#64748b', fontSize: 11 }}>[Para {r.source_para}]</span>}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div style={{ margin: '12px 0' }}>
                      <strong style={{ fontSize: 13, color: '#334155' }}>
                        📋 {isTe ? 'అవసరమైన పత్రాలు' : 'Required Verification Documents'}:
                      </strong>
                      <ul style={{ paddingLeft: 20, fontSize: 13, color: '#475569', marginTop: 4 }}>
                        {(s.required_documents || []).map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Application Steps */}
                    {s.application_steps && s.application_steps.length > 0 && (
                      <div style={{ margin: '12px 0' }}>
                        <strong style={{ fontSize: 13, color: '#334155' }}>
                          📝 {isTe ? 'దరఖాస్తు విధానం' : 'Application Procedure'}:
                        </strong>
                        <ol style={{ paddingLeft: 20, fontSize: 13, color: '#475569', marginTop: 4 }}>
                          {s.application_steps.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Gazette Audit Stamp */}
                    <div className="dir-dossier-footer">
                      <div>
                        <p style={{ fontSize: 11, color: '#64748b' }}>
                          <strong>Source:</strong> {s.source_document} • <strong>Verified:</strong> {s.last_verified}
                        </p>
                      </div>
                      <a
                        href={s.official_portal}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-portal"
                        style={{ padding: '6px 12px', fontSize: 11 }}
                      >
                        🌐 {isTe ? 'అధికారిక పోర్టల్' : 'Official Portal'} ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
