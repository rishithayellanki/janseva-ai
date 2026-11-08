import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:4000';

const UI = {
  en: { send: 'Send', placeholder: 'Type your answer...', profile: 'Your profile so far' },
  te: { send: 'పంపు', placeholder: 'మీ సమాధానం టైప్ చేయండి...', profile: 'ఇప్పటివరకు మీ ప్రొఫైల్' },
};

export default function App() {
  const [language, setLanguage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function startSession(lang) {
    setBusy(true);
    try {
      const res = await fetch(`${API}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang }),
      });
      const data = await res.json();
      setLanguage(lang);
      setSessionId(data.session_id);
      setProfile({});
      setMessages([{ from: 'bot', text: data.message }]);
    } catch {
      setMessages([{ from: 'bot', text: 'The backend is not reachable. Is it running on port 4000?' }]);
    }
    setBusy(false);
  }

  async function sendAnswer(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !sessionId || busy) return;
    setInput('');
    setBusy(true);
    setMessages((m) => [...m, { from: 'user', text }]);
    try {
      const res = await fetch(`${API}/api/sessions/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: text }),
      });
      const data = await res.json();
      setProfile(data.profile || {});
      setMessages((m) => [...m, { from: 'bot', text: data.message }]);
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Could not reach the server. Please try again.' }]);
    }
    setBusy(false);
  }

  const t = UI[language || 'en'];

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 640, margin: '0 auto', padding: '1rem' }}>
      <h1>JanSeva AI</h1>
      <p>Your Voice. Your Rights. Your Government Benefits.</p>

      {!language && (
        <div>
          <p>Choose a language / భాష ఎంచుకోండి</p>
          <button onClick={() => startSession('en')} disabled={busy}>English</button>{' '}
          <button onClick={() => startSession('te')} disabled={busy}>తెలుగు</button>
        </div>
      )}

      {language && (
        <>
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, height: 360, overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.from === 'user' ? 'right' : 'left', margin: '8px 0' }}>
                <span style={{
                  display: 'inline-block', padding: '8px 12px', borderRadius: 12, maxWidth: '80%',
                  background: m.from === 'user' ? '#d6f0ff' : '#f0f0f0',
                }}>
                  {m.text}
                </span>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendAnswer} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={busy}
              style={{ flex: 1, padding: 8 }}
            />
            <button type="submit" disabled={busy || !input.trim()}>{t.send}</button>
          </form>

          <h3>{t.profile}</h3>
          <pre style={{ background: '#fafafa', padding: 8 }}>{JSON.stringify(profile, null, 2)}</pre>
        </>
      )}
    </main>
  );
}
