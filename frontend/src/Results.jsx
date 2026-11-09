import { useEffect, useState } from 'react';
import SpeakButton from './SpeakButton';
import { summaryText } from './summary';

const API = 'http://localhost:4000';

const L = {
  en: {
    title: 'Your Verified Scheme Results',
    subtitle: 'Calculated using deterministic statutory guidelines and verified against Gazette notifications.',
    indicative: 'These results are indicative. Confirm eligibility on the official portal before you apply.',
    loading: 'Verifying eligibility rules across Central and State schemes...',
    retry: 'Try again',
    error: 'Could not load scheme results. Is the backend running on http://localhost:4000?',
    status: {
      eligible: 'Eligible',
      needs_more_information: 'Needs More Information',
      not_eligible: 'Not Eligible',
    },
    aishe: ' (Subject to your institution possessing a valid AISHE/UDISE code)',
    why: 'Why You Match (Official Guidelines)',
    unmet: 'Unmet Statutory Conditions',
    missing: 'Pending Verification / Additional Info Required',
    docs: 'Required Document Checklist',
    portal: 'Official Application Portal',
    show: 'View Scheme Guidelines & Benefits',
    hide: 'Hide Details',
    benefits: 'Welfare Benefits Entitled',
    steps: 'Application Procedure',
    source: 'Gazette Source',
    noSourceLink: 'Official portal link provided above.',
    checked: 'Last Verified',
    validity: 'Guideline Validity',
    deadline: 'Application Deadline',
    noDeadline: 'No active cut-off deadline in guideline.',
    open: 'Items Under Official Review',
    evonTitle: 'Gnani Evon v3.3 Sovereign Counselor',
    evonExplainBtn: '💡 Explain My Eligibility with Evon AI',
    evonLoading: 'Generating grounded advisory via Gnani Evon v3.3...',
    procureGuide: 'Where to get this?',
    askPlaceholder: 'Ask a question about this scheme in Telugu or English...',
    askBtn: 'Ask Evon AI',
    filterAll: 'All Schemes',
    filterEdu: '🎓 Education',
    filterAgri: '🌾 Agriculture',
    filterHealth: '🏥 Health',
    filterLive: '💼 Livelihood & MSME',
    statusAll: 'All Statuses',
    printBtn: '🖨️ Print Welfare Slip',
    readyDocs: 'ready',
  },
  te: {
    title: 'మీ అధికారిక పథకాల ఫలితాలు',
    subtitle: 'ప్రభుత్వ మార్గదర్శకాల ప్రకారం ధృవీకరించబడిన సంక్షేమ పథకాల జాబితా.',
    indicative: 'ఈ ఫలితాలు సూచనాత్మకం మాత్రమే. దరఖాస్తు చేసే ముందు అధికారిక పోర్టల్‌లో అర్హతను నిర్ధారించుకోండి.',
    loading: 'మీ అర్హత వివరాలను అధికారిక నిబంధనలతో సరిపోలుస్తున్నాము...',
    retry: 'మళ్లీ ప్రయత్నించండి',
    error: 'ఫలితాలను లోడ్ చేయలేకపోయాము. బ్యాకెండ్ నడుస్తోందో లేదో తనిఖీ చేయండి.',
    status: {
      eligible: 'అర్హులు (Eligible)',
      needs_more_information: 'మరింత సమాచారం అవసరం (Needs Info)',
      not_eligible: 'అర్హులు కాదు (Not Eligible)',
    },
    aishe: ' (మీ కళాశాలకు చెల్లుబాటు అయ్యే AISHE కోడ్ ఉండాలి)',
    why: 'అర్హత నిబంధనలు (తీరిన షరతులు)',
    unmet: 'తీరని ప్రభుత్వ నిబంధనలు',
    missing: 'ఇంకా నిర్ధారించాల్సిన పాయింట్లు',
    docs: 'అవసరమైన పత్రాల చెక్‌లిస్ట్',
    portal: 'అధికారిక దరఖాస్తు పోర్టల్',
    show: 'పథకం పూర్తి వివరాలు & ప్రయోజనాలు',
    hide: 'వివరాలు దాచండి',
    benefits: 'పథకం ద్వారా లభించే ప్రయోజనాలు',
    steps: 'దరఖాస్తు విధానం',
    source: 'అధికారిక గెజిట్ మూలం',
    noSourceLink: 'పైన ఉన్న అధికారిక పోర్టల్ చూడండి.',
    checked: 'చివరిగా పరిశీలించిన తేదీ',
    validity: 'మార్గదర్శకాల చెల్లుబాటు',
    deadline: 'దరఖాస్తు గడువు',
    noDeadline: 'గైడ్‌లైన్‌లో గడువు పేర్కొనలేదు.',
    open: 'అధికారికంగా స్పష్టత రావాల్సిన అంశాలు',
    evonTitle: 'జ్ఞాని ఎవోన్ v3.3 సలహాదారు',
    evonExplainBtn: '💡 నా అర్హతను ఎవోన్ AI తో వివరించు',
    evonLoading: 'జ్ఞాని ఎవోన్ v3.3 ద్వారా మార్గదర్శకాలను విశ్లేషిస్తున్నాము...',
    procureGuide: 'ఎక్కడ పొందాలి?',
    askPlaceholder: 'ఈ పథకం గురించి ఏదైనా సందేహం అడగండి...',
    askBtn: 'అడగండి',
    filterAll: 'అన్ని పథకాలు',
    filterEdu: '🎓 విద్య',
    filterAgri: '🌾 వ్యవసాయం',
    filterHealth: '🏥 ఆరోగ్యం',
    filterLive: '💼 ఉపాధి / వ్యాపారం',
    statusAll: 'అన్ని ఫలితాలు',
    printBtn: '🖨️ సంక్షేమ పత్రం ప్రింట్ చేయండి',
    readyDocs: 'సిద్ధంగా ఉన్నాయి',
  },
};

const SCHEME_CATEGORIES = {
  'pms-sc': 'edu',
  'pm-usp-csss': 'edu',
  'nmmss': 'edu',
  'pm-kisan': 'agri',
  'pmfby': 'agri',
  'pm-jay': 'health',
  'pm-svanidhi': 'live',
};

function rupees(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function benefitText(b) {
  const parts = [b.component];
  if (b.amount) parts.push(String(b.amount));
  if (b.amount_per_year !== undefined) {
    parts.push(typeof b.amount_per_year === 'number' ? `${rupees(b.amount_per_year)} per year` : String(b.amount_per_year));
  }
  if (b.monthly) parts.push(`${rupees(b.monthly)} per month`);
  if (b.instalments) parts.push(b.instalments);
  if (b.duration) parts.push(b.duration);
  if (b.hostellers && b.day_scholars) {
    parts.push(
      Object.keys(b.hostellers)
        .map((g) => `${g}: hostellers ${rupees(b.hostellers[g])}, day scholars ${rupees(b.day_scholars[g])}`)
        .join('; ')
    );
  }
  if (b.divyang_extra) parts.push(`${b.divyang_extra} extra for Divyang students`);
  return parts.filter(Boolean).join('. ');
}

export default function Results({ sessionId, language = 'en', profile = {} }) {
  const t = L[language] || L.en;
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState({});
  const [counseling, setCounseling] = useState({});
  const [counselLoading, setCounselLoading] = useState({});
  const [queries, setQueries] = useState({});
  const [docGuides, setDocGuides] = useState({});
  const [checkedDocs, setCheckedDocs] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setError(false);
    fetch(`${API}/api/sessions/${sessionId}/matches`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((data) => setMatches(data.matches))
      .catch(() => setError(true));
  }, [sessionId, attempt]);

  async function fetchCounseling(schemeId) {
    setCounselLoading((prev) => ({ ...prev, [schemeId]: true }));
    try {
      const res = await fetch(`${API}/api/sessions/${sessionId}/counsel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme_id: schemeId }),
      });
      const data = await res.json();
      setCounseling((prev) => ({ ...prev, [schemeId]: data.text }));
    } catch {
      setCounseling((prev) => ({
        ...prev,
        [schemeId]: language === 'te' ? 'సలహాను పొందలేకపోయాము.' : 'Could not generate AI counseling at this moment.',
      }));
    }
    setCounselLoading((prev) => ({ ...prev, [schemeId]: false }));
  }

  async function askQuestion(schemeId, e) {
    e.preventDefault();
    const q = (queries[schemeId] || '').trim();
    if (!q) return;
    setCounselLoading((prev) => ({ ...prev, [schemeId]: true }));
    try {
      const res = await fetch(`${API}/api/sessions/${sessionId}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme_id: schemeId, query: q }),
      });
      const data = await res.json();
      setCounseling((prev) => ({ ...prev, [schemeId]: data.text }));
      setQueries((prev) => ({ ...prev, [schemeId]: '' }));
    } catch {
      setCounseling((prev) => ({
        ...prev,
        [schemeId]: language === 'te' ? 'సమాధానం పొందలేకపోయాము.' : 'Failed to retrieve answer.',
      }));
    }
    setCounselLoading((prev) => ({ ...prev, [schemeId]: false }));
  }

  async function fetchDocGuide(doc) {
    if (docGuides[doc]) {
      setDocGuides((prev) => ({ ...prev, [doc]: null }));
      return;
    }
    try {
      const res = await fetch(`${API}/api/documents/guide?doc=${encodeURIComponent(doc)}&lang=${language}`);
      const data = await res.json();
      setDocGuides((prev) => ({ ...prev, [doc]: data }));
    } catch {}
  }

  function toggleDoc(key) {
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <p style={{ color: '#dc2626', marginBottom: 12 }}>{t.error}</p>
        <button type="button" className="btn-secondary" onClick={() => setAttempt((n) => n + 1)}>
          🔄 {t.retry}
        </button>
      </div>
    );
  }

  if (!matches) {
    return (
      <div style={{ textAlign: 'center', padding: 32 }}>
        <p style={{ color: '#0369a1', fontWeight: 600 }}>⏳ {t.loading}</p>
      </div>
    );
  }

  const filteredMatches = matches.filter((m) => {
    const cat = SCHEME_CATEGORIES[m.scheme_id] || 'other';
    const matchesCat = categoryFilter === 'all' || cat === categoryFilter;
    const matchesStatus = statusFilter === 'all' || m.eligibility_status === statusFilter;
    return matchesCat && matchesStatus;
  });

  return (
    <section>
      {/* Print-Only Header for Citizen Welfare Passbook */}
      <div className="print-only-header">
        <h1 style={{ fontSize: 20 }}>JANSEVA AI — CITIZEN WELFARE ENTITLEMENT SLIP</h1>
        <p style={{ fontSize: 12 }}>Verified against Ministry Gazette Guidelines • Government of India</p>
        <p style={{ fontSize: 11, marginTop: 4 }}>Date of Verification: {new Date().toLocaleDateString('en-IN')}</p>
      </div>

      <div className="results-header">
        <h2 className="results-title">{t.title}</h2>
        <p className="results-subtitle">{t.subtitle}</p>

        <div className="results-top-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SpeakButton
              text={summaryText(matches, language)}
              language={language}
            />
            <span style={{ fontSize: 12, color: '#64748b' }}>
              🔊 {language === 'te' ? 'మొత్తం ఫలితాలను వినండి (Gnani Timbre)' : 'Listen to full results summary (Gnani Timbre)'}
            </span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => window.print()}
          >
            {t.printBtn}
          </button>
        </div>

        {/* Category & Status Filter Pills */}
        <div className="filter-pills-row">
          <button
            type="button"
            className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            {t.filterAll} ({matches.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${categoryFilter === 'edu' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('edu')}
          >
            {t.filterEdu}
          </button>
          <button
            type="button"
            className={`filter-btn ${categoryFilter === 'agri' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('agri')}
          >
            {t.filterAgri}
          </button>
          <button
            type="button"
            className={`filter-btn ${categoryFilter === 'health' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('health')}
          >
            {t.filterHealth}
          </button>
          <button
            type="button"
            className={`filter-btn ${categoryFilter === 'live' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('live')}
          >
            {t.filterLive}
          </button>

          <span style={{ borderLeft: '1px solid #cbd5e1', margin: '0 4px' }} />

          <button
            type="button"
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            {t.statusAll}
          </button>
          <button
            type="button"
            className={`filter-btn ${statusFilter === 'eligible' ? 'active' : ''}`}
            onClick={() => setStatusFilter('eligible')}
          >
            🟢 {t.status.eligible}
          </button>
          <button
            type="button"
            className={`filter-btn ${statusFilter === 'needs_more_information' ? 'active' : ''}`}
            onClick={() => setStatusFilter('needs_more_information')}
          >
            🟡 {t.status.needs_more_information}
          </button>
        </div>
      </div>

      {filteredMatches.map((m) => {
        const checkedCount = (m.required_documents || []).filter((_, idx) => checkedDocs[`${m.scheme_id}_${idx}`]).length;
        const totalDocs = (m.required_documents || []).length;

        return (
          <article key={m.scheme_id} className={`scheme-card ${m.eligibility_status}`}>
            <div className="scheme-card-top">
              <div>
                <h3 className="scheme-title">{m.scheme_name}</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{m.target_group}</p>
              </div>
              <span className={`status-badge ${m.eligibility_status}`}>
                {t.status[m.eligibility_status]}
              </span>
            </div>

            {/* Primary Benefit Callout */}
            {m.benefits && m.benefits.length > 0 && (
              <div className="benefit-highlight">
                🎁 <strong>{t.benefits}:</strong> {benefitText(m.benefits[0])}
              </div>
            )}

            {/* Rules Met */}
            {m.met && m.met.length > 0 && (
              <div style={{ margin: '10px 0' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#166534', marginBottom: 4 }}>
                  ✓ {t.why}
                </div>
                <ul style={{ paddingLeft: 18, fontSize: 13, color: '#334155' }}>
                  {m.met.map((item) => (
                    <li key={item.id} style={{ marginBottom: 2 }}>
                      {item.description}{' '}
                      {item.source_para && (
                        <span style={{ color: '#64748b', fontSize: 11 }}>[Para {item.source_para}]</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rules Unmet */}
            {m.unmet && m.unmet.length > 0 && (
              <div style={{ margin: '10px 0' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
                  ✗ {t.unmet}
                </div>
                <ul style={{ paddingLeft: 18, fontSize: 13, color: '#475569' }}>
                  {m.unmet.map((item) => (
                    <li key={item.id} style={{ marginBottom: 2 }}>
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rules Missing / Needs More Info */}
            {m.missing && m.missing.length > 0 && (
              <div style={{ margin: '10px 0' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#d97706', marginBottom: 4 }}>
                  ? {t.missing}
                </div>
                <ul style={{ paddingLeft: 18, fontSize: 13, color: '#475569' }}>
                  {m.missing.map((item) => (
                    <li key={item.id} style={{ marginBottom: 2 }}>
                      {item.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interactive Document Checklist */}
            {m.required_documents && m.required_documents.length > 0 && (
              <div className="checklist-container">
                <div className="checklist-title">
                  📋 {t.docs} ({checkedCount}/{totalDocs} {t.readyDocs})
                </div>
                {m.required_documents.map((doc, idx) => {
                  const docKey = `${m.scheme_id}_${idx}`;
                  const guide = docGuides[doc];
                  return (
                    <div key={idx} style={{ marginBottom: 6 }}>
                      <div className="checklist-item">
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(checkedDocs[docKey])}
                            onChange={() => toggleDoc(docKey)}
                          />
                          <span style={{ textDecoration: checkedDocs[docKey] ? 'line-through' : 'none' }}>
                            {doc}
                          </span>
                        </label>
                        <button
                          type="button"
                          className="guide-pill"
                          onClick={() => fetchDocGuide(doc)}
                        >
                          {guide ? '▲ Close' : `ℹ️ ${t.procureGuide}`}
                        </button>
                      </div>
                      {guide && (
                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '8px 12px', fontSize: 12, marginTop: 4 }}>
                          <p style={{ color: '#0f172a' }}>{guide.instructions}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: '#64748b' }}>
                            <span>⏱ Processing: {guide.processing_time}</span>
                            <a href={guide.portal} target="_blank" rel="noreferrer" style={{ color: '#0284c7' }}>
                              Official Portal ↗
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Evon v3.3 Sovereign Advisory Box */}
            {counseling[m.scheme_id] && (
              <div className="evon-counsel-box">
                <div className="evon-box-header">
                  <span className="evon-label">✨ {t.evonTitle}</span>
                  <SpeakButton text={counseling[m.scheme_id]} language={language} />
                </div>
                <p className="evon-text">{counseling[m.scheme_id]}</p>
              </div>
            )}

            {/* Action Row */}
            <div className="scheme-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => fetchCounseling(m.scheme_id)}
                disabled={counselLoading[m.scheme_id]}
              >
                {counselLoading[m.scheme_id] ? t.evonLoading : t.evonExplainBtn}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setOpen((o) => ({ ...o, [m.scheme_id]: !o[m.scheme_id] }))}
              >
                {open[m.scheme_id] ? `▲ ${t.hide}` : `▼ ${t.show}`}
              </button>

              <a
                href={m.official_portal}
                target="_blank"
                rel="noreferrer"
                className="btn-portal"
              >
                🌐 {t.portal} ↗
              </a>
            </div>

            {/* Ask Evon Input */}
            <form onSubmit={(e) => askQuestion(m.scheme_id, e)} style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input
                style={{ flex: 1, padding: '6px 12px', fontSize: 12.5, borderRadius: 6, border: '1px solid #cbd5e1' }}
                placeholder={t.askPlaceholder}
                value={queries[m.scheme_id] || ''}
                onChange={(e) => setQueries({ ...queries, [m.scheme_id]: e.target.value })}
              />
              <button
                type="submit"
                className="btn-secondary"
                disabled={counselLoading[m.scheme_id] || !(queries[m.scheme_id] || '').trim()}
              >
                {t.askBtn}
              </button>
            </form>

            {/* Detailed Collapsible Accordion */}
            {open[m.scheme_id] && (
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, marginTop: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ fontSize: 13, color: '#334155' }}>🎁 {t.benefits}:</strong>
                  <ul style={{ paddingLeft: 18, fontSize: 13, color: '#475569', marginTop: 4 }}>
                    {(m.benefits || []).map((b, i) => (
                      <li key={i}>{benefitText(b)}</li>
                    ))}
                  </ul>
                </div>

                {m.notes && m.notes.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <ul style={{ paddingLeft: 18, fontSize: 12.5, color: '#64748b' }}>
                      {m.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginBottom: 10 }}>
                  <strong style={{ fontSize: 13, color: '#334155' }}>📝 {t.steps}:</strong>
                  <ol style={{ paddingLeft: 18, fontSize: 13, color: '#475569', marginTop: 4 }}>
                    {(m.application_steps || []).map((s, i) => (
                      <li key={i} style={{ marginBottom: 2 }}>{s}</li>
                    ))}
                  </ol>
                </div>

                <div style={{ fontSize: 12, color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                  <p><strong>{t.deadline}:</strong> {m.deadline_note || t.noDeadline}</p>
                  <p><strong>{t.source}:</strong> {m.source_document}</p>
                  <p><strong>{t.checked}:</strong> {m.last_verified} {m.guideline_validity ? `• ${t.validity}: ${m.guideline_validity}` : ''}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
