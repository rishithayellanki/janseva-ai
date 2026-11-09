import { useEffect, useState } from 'react';
import SpeakButton from './SpeakButton';
import { summaryText } from './summary';

const API = 'http://localhost:4000';

// Telugu labels are drafts for a native-speaker review. Scheme text stays in English.
const L = {
  en: {
    title: 'Your scheme results',
    indicative: 'These results are indicative. Confirm eligibility on the official portal before you apply.',
    loading: 'Checking schemes for you...',
    retry: 'Try again',
    error: 'Could not load scheme results. Is the backend running?',
    status: { eligible: 'Eligible', needs_more_information: 'Needs more information', not_eligible: 'Not eligible' },
    aishe: ' (subject to your institution having a valid AISHE code)',
    why: 'Why you match',
    unmet: 'Not met',
    missing: 'Still needs confirmation',
    docs: 'Required documents',
    portal: 'Official portal',
    show: 'View details',
    hide: 'Hide details',
    benefits: 'Benefits',
    steps: 'How to apply',
    source: 'Source',
    noSourceLink: 'Guideline link not added yet. Use the official portal above.',
    checked: 'Last checked',
    validity: 'Guideline valid for',
    deadline: 'Deadline',
    noDeadline: 'No deadline stated in the guideline.',
    open: 'Still to confirm with the official source',
    textNote: '',
  },
  te: {
    title: 'మీ పథకాల ఫలితాలు',
    indicative: 'ఈ ఫలితాలు సూచనాత్మకం మాత్రమే. దరఖాస్తు చేసే ముందు అధికారిక పోర్టల్‌లో అర్హతను నిర్ధారించుకోండి.',
    loading: 'మీ కోసం పథకాలను పరిశీలిస్తున్నాము...',
    retry: 'మళ్లీ ప్రయత్నించండి',
    error: 'ఫలితాలను లోడ్ చేయలేకపోయాము. బ్యాకెండ్ నడుస్తోందా?',
    status: { eligible: 'అర్హులు', needs_more_information: 'మరింత సమాచారం అవసరం', not_eligible: 'అర్హులు కాదు' },
    aishe: ' (మీ సంస్థకు చెల్లుబాటు అయ్యే AISHE కోడ్ ఉండాలి)',
    why: 'మీరు ఎందుకు సరిపోతారు',
    unmet: 'తీరని షరతులు',
    missing: 'ఇంకా నిర్ధారించాల్సినవి',
    docs: 'అవసరమైన పత్రాలు',
    portal: 'అధికారిక పోర్టల్',
    show: 'వివరాలు చూడండి',
    hide: 'వివరాలు దాచండి',
    benefits: 'ప్రయోజనాలు',
    steps: 'దరఖాస్తు చేసే విధానం',
    source: 'మూలం',
    noSourceLink: 'మార్గదర్శకాల లింక్ ఇంకా జోడించలేదు. పైన ఉన్న అధికారిక పోర్టల్ చూడండి.',
    checked: 'చివరిగా తనిఖీ చేసిన తేదీ',
    validity: 'మార్గదర్శకాల కాలపరిమితి',
    deadline: 'గడువు',
    noDeadline: 'మార్గదర్శకాలలో గడువు పేర్కొనలేదు.',
    open: 'అధికారిక మూలంతో ఇంకా నిర్ధారించాల్సినవి',
    textNote: 'గమనిక: పథకాల వివరాలు ప్రస్తుతం ఇంగ్లీష్‌లో ఉన్నాయి.',
  },
};

const COLORS = { eligible: '#1b7f3b', needs_more_information: '#8a6100', not_eligible: '#8a1c1c' };

function rupees(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// Builds one readable line from a benefit entry in a scheme record
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

function Section({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <strong>{title}</strong>
      <ul>
        {items.map((item) => <li key={item.id}>{item.description}</li>)}
      </ul>
    </>
  );
}

function TextList({ title, items, ordered }) {
  if (!items || items.length === 0) return null;
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <>
      <strong>{title}</strong>
      <Tag>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </Tag>
    </>
  );
}

export default function Results({ sessionId, language = 'en' }) {
  const t = L[language] || L.en;
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState({});
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setError(false);
    fetch(`${API}/api/sessions/${sessionId}/matches`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((data) => setMatches(data.matches))
      .catch(() => setError(true));
  }, [sessionId, attempt]);

  if (error) {
    return (
      <div>
        <p>{t.error}</p>
        <button type="button" onClick={() => setAttempt((n) => n + 1)}>{t.retry}</button>
      </div>
    );
  }
  if (!matches) return <p>{t.loading}</p>;

  return (
    <section>
      <h2>{t.title}</h2>
      <p style={{ fontSize: 13, color: '#555' }}>{t.indicative}</p>
      {t.textNote && <p style={{ fontSize: 13, color: '#555' }}>{t.textNote}</p>}
      <SpeakButton text={summaryText(matches, language)} language={language === 'te' ? 'auto' : 'en'} />

      {matches.map((m) => (
        <div key={m.scheme_id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, margin: '12px 0' }}>
          <h3 style={{ margin: '0 0 4px' }}>{m.scheme_name}</h3>
          <p style={{ margin: '0 0 6px', fontSize: 14 }}>{m.target_group}</p>
          <p style={{ margin: '0 0 6px', color: COLORS[m.eligibility_status] }}>
            <strong>{t.status[m.eligibility_status]}</strong>
            {m.scheme_id === 'pms-sc' && m.eligibility_status === 'eligible' ? t.aishe : ''}
          </p>

          <Section title={t.why} items={m.met} />
          <Section title={t.unmet} items={m.unmet} />
          <Section title={t.missing} items={m.missing} />
          <TextList title={t.docs} items={m.required_documents} />

          <p style={{ fontSize: 13 }}>
            {t.portal}:{' '}
            <a href={m.official_portal} target="_blank" rel="noreferrer">{m.official_portal}</a>
          </p>

          <button type="button" onClick={() => setOpen((o) => ({ ...o, [m.scheme_id]: !o[m.scheme_id] }))}>
            {open[m.scheme_id] ? t.hide : t.show}
          </button>

          {open[m.scheme_id] && (
            <div style={{ background: '#fafafa', padding: 10, borderRadius: 6, marginTop: 8 }}>
              <TextList title={t.benefits} items={(m.benefits || []).map(benefitText)} />
              {m.notes && m.notes.length > 0 && (
                <ul>
                  {m.notes.map((n, i) => <li key={i} style={{ fontSize: 13 }}>{n}</li>)}
                </ul>
              )}
              <TextList title={t.steps} items={m.application_steps} ordered />

              <p style={{ fontSize: 13, margin: '8px 0 2px' }}>
                <strong>{t.deadline}:</strong> {m.deadline_note || t.noDeadline}
              </p>
              <p style={{ fontSize: 13, margin: '2px 0' }}>
                <strong>{t.source}:</strong> {m.source_document}
              </p>
              <p style={{ fontSize: 13, margin: '2px 0' }}>
                {m.source_url ? (
                  <a href={m.source_url} target="_blank" rel="noreferrer">{m.source_url}</a>
                ) : (
                  t.noSourceLink
                )}
              </p>
              <p style={{ fontSize: 13, margin: '2px 0' }}>
                <strong>{t.checked}:</strong> {m.last_verified || '-'}
                {m.guideline_validity ? `. ${t.validity}: ${m.guideline_validity}` : ''}
              </p>
              <TextList title={t.open} items={m.open_items} />
              <p style={{ fontSize: 12, color: '#666' }}>{t.indicative}</p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
