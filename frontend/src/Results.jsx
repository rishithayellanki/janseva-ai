import { useEffect, useState } from 'react';

const API = 'http://localhost:4000';

const STATUS = {
  eligible: { text: 'Eligible', color: '#1b7f3b' },
  needs_more_information: { text: 'Needs more information', color: '#8a6100' },
  not_eligible: { text: 'Not eligible', color: '#8a1c1c' },
};

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

export default function Results({ sessionId }) {
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/sessions/${sessionId}/matches`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((data) => setMatches(data.matches))
      .catch(() => setError(true));
  }, [sessionId]);

  if (error) return <p>Could not load scheme results. Is the backend running?</p>;
  if (!matches) return <p>Checking schemes for you...</p>;

  return (
    <section>
      <h2>Your scheme results</h2>
      <p style={{ fontSize: 13, color: '#555' }}>
        These results are indicative. Confirm eligibility on the official portal before you apply.
      </p>
      {matches.map((m) => (
        <div key={m.scheme_id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, margin: '12px 0' }}>
          <h3 style={{ margin: '0 0 4px' }}>{m.scheme_name}</h3>
          <p style={{ margin: '0 0 6px', fontSize: 14 }}>{m.target_group}</p>
          <p style={{ margin: '0 0 6px', color: STATUS[m.eligibility_status].color }}>
            <strong>{STATUS[m.eligibility_status].text}</strong>
            {m.scheme_id === 'pms-sc' && m.eligibility_status === 'eligible'
              ? ' (subject to your institution having a valid AISHE code)'
              : ''}
          </p>
          <Section title="Why you match" items={m.met} />
          <Section title="Not met" items={m.unmet} />
          <Section title="Still needs confirmation" items={m.missing} />
          {m.required_documents.length > 0 && (
            <>
              <strong>Required documents</strong>
              <ul>
                {m.required_documents.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </>
          )}
          <p style={{ fontSize: 13 }}>
            Official portal:{' '}
            <a href={m.official_portal} target="_blank" rel="noreferrer">{m.official_portal}</a>
          </p>
          <p style={{ fontSize: 12, color: '#666' }}>
            Source: {m.source_document}. Last checked: {m.last_verified || 'not recorded'}.
            {m.deadline_note ? ` ${m.deadline_note}` : ''}
          </p>
        </div>
      ))}
    </section>
  );
}
