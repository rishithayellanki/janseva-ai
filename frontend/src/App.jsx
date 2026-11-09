import Results from './Results';
import SpeakButton from './SpeakButton';
import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:4000';
const STORE_KEY = 'janseva_session';

const UI = {
  en: {
    tagline: 'Your Voice. Your Rights. Your Government Benefits.',
    sovereignBadge: 'Sovereign Indic AI • Digital Public Good',
    models: ['Gnani Prisma v3.0 (STT)', 'Gnani Timbre v3.0 (TTS)', 'Gnani Evon v3.3 (Reasoning)'],
    send: 'Send',
    mic: '🎤 Speak',
    stop: '⏹ Stop',
    placeholder: 'Type or speak your answer (Telugu or English)...',
    profile: 'Verified Citizen Snapshot',
    restart: 'Start Over / మళ్లీ ప్రారంభించండి',
    recording: 'Listening to your voice...',
    transcribing: 'Converting Indic speech via Gnani Prisma v3.0...',
    quickPersonas: 'Quick Demo Personas (DPDP Synthetic Data)',
    quickPersonasDesc: '1-Click validation of verified welfare journeys',
    micDenied: 'Microphone permission was denied. Please allow microphone access or type your answer.',
    micNone: 'No microphone was found. Please type your answer.',
    micUnsupported: 'Voice input is not supported in this browser. Please type your answer.',
    speechFail: 'Could not understand that recording. Please try again or type your answer.',
    speechDown: 'Voice recognition is unavailable right now. Please type your answer.',
    noServer: 'The backend server is not reachable on http://localhost:4000.',
    stepProgress: 'Citizen Onboarding Progress',
  },
  te: {
    tagline: 'మీ గొంతు. మీ హక్కులు. మీ ప్రభుత్వ పథకాలు.',
    sovereignBadge: 'భారతీయ సార్వభౌమ AI • ప్రజా సంక్షేమం',
    models: ['జ్ఞాని ప్రిజ్మా v3.0 (STT)', 'జ్ఞాని టింబ్రే v3.0 (TTS)', 'జ్ఞాని ఎవోన్ v3.3 (రీజనింగ్)'],
    send: 'పంపు',
    mic: '🎤 మాట్లాడండి',
    stop: '⏹ ఆపు',
    placeholder: 'తెలుగు లేదా ఇంగ్లీష్‌లో టైప్ చేయండి లేదా మాట్లాడండి...',
    profile: 'నిర్ధారించబడిన పౌరుల వివరాలు',
    restart: 'మొదటి నుండి ప్రారంభించండి',
    recording: 'మీ వాయిస్ వింటున్నాము...',
    transcribing: 'జ్ఞాని ప్రిజ్మా v3.0 ద్వారా మాటను టెక్స్ట్‌గా మారుస్తున్నాము...',
    quickPersonas: 'డెమో ప్రొఫైల్స్ (సింథటిక్ డేటా)',
    quickPersonasDesc: 'ఒక్క క్లిక్‌తో పథకాల అర్హత తనిఖీ చేయండి',
    micDenied: 'మైక్రోఫోన్ అనుమతి ఇవ్వలేదు. బ్రౌజర్ సెట్టింగ్‌లో అనుమతించండి, లేదా టైప్ చేయండి.',
    micNone: 'మైక్రోఫోన్ కనబడలేదు. దయచేసి టైప్ చేయండి.',
    micUnsupported: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ పని చేయదు. దయచేసి టైప్ చేయండి.',
    speechFail: 'ఆ రికార్డింగ్ అర్థం కాలేదు. మళ్లీ ప్రయత్నించండి లేదా టైప్ చేయండి.',
    speechDown: 'వాయిస్ సేవ ప్రస్తుతం అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.',
    noServer: 'సర్వర్ అందుబాటులో లేదు. దయచేసి బ్యాకెండ్ నడుస్తోందో లేదో చూడండి.',
    stepProgress: 'ప్రొఫైల్ నమోదు పురోగతి',
  },
};

export default function App() {
  const [language, setLanguage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [presets, setPresets] = useState([]);
  const endRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const t = UI[language || 'en'];

  // Load demo presets from backend
  useEffect(() => {
    fetch(`${API}/api/demo-presets`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPresets(data))
      .catch(() => {});
  }, []);

  // Restore session after refresh
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (!saved) return;
    fetch(`${API}/api/sessions/${saved.sessionId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          localStorage.removeItem(STORE_KEY);
          return;
        }
        setLanguage(data.language);
        setSessionId(data.session_id);
        setProfile(data.profile);
        setComplete(!data.next_question);
        setMessages(saved.messages || []);
      })
      .catch(() => {});
  }, []);

  // Save session state
  useEffect(() => {
    if (sessionId) localStorage.setItem(STORE_KEY, JSON.stringify({ sessionId, messages }));
  }, [sessionId, messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function addBot(text) {
    setMessages((m) => [...m, { from: 'bot', text }]);
  }

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
      setComplete(false);
      setMessages([{ from: 'bot', text: data.message }]);
    } catch {
      addBot(UI[lang].noServer);
    }
    setBusy(false);
  }

  async function switchLanguage(newLang) {
    if (newLang === language) return;
    setLanguage(newLang);
    if (!sessionId) {
      await startSession(newLang);
    }
  }

  async function loadPreset(presetId) {
    setBusy(true);
    const lang = language || 'en';
    try {
      const res = await fetch(`${API}/api/sessions/preset/${presetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang }),
      });
      const data = await res.json();
      setLanguage(lang);
      setSessionId(data.session_id);
      setProfile(data.profile);
      setComplete(true);
      setMessages([
        {
          from: 'bot',
          text:
            lang === 'te'
              ? 'సింథటిక్ డెమో ప్రొఫైల్ లోడ్ అయింది. అధికారిక పథకాల ఫలితాలు క్రింద చూడండి:'
              : 'Synthetic demo profile loaded. See your verified statutory scheme matches below:',
        },
      ]);
    } catch {
      addBot(t.noServer);
    }
    setBusy(false);
  }

  function startOver() {
    localStorage.removeItem(STORE_KEY);
    setLanguage(null);
    setSessionId(null);
    setMessages([]);
    setProfile({});
    setInput('');
    setComplete(false);
  }

  async function sendAnswer(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !sessionId || busy || complete) return;
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
      setComplete(data.status === 'complete');
      addBot(data.message);
    } catch {
      addBot(t.noServer);
    }
    setBusy(false);
  }

  async function transcribe(blob) {
    setTranscribing(true);
    const form = new FormData();
    const ext = blob.type.includes('mp4') ? 'm4a' : 'webm';
    form.append('audio', blob, `voice.${ext}`);
    form.append('language', language || 'en');
    try {
      const res = await fetch(`${API}/api/transcribe`, { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) addBot(data.error === 'speech_unavailable' ? t.speechDown : t.speechFail);
      else if (data.transcript) {
        setInput(data.transcript);
      } else addBot(t.speechFail);
    } catch {
      addBot(t.noServer);
    }
    setTranscribing(false);
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      addBot(t.micUnsupported);
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') addBot(t.micNone);
      else addBot(t.micDenied);
      return;
    }
    streamRef.current = stream;
    const mimeType = ['audio/webm', 'audio/mp4'].find((m) => MediaRecorder.isTypeSupported(m));
    const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    chunksRef.current = [];
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      transcribe(new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' }));
    };
    recorderRef.current = rec;
    rec.start();
    setRecording(true);
    setTimeout(() => {
      if (recorderRef.current?.state === 'recording') stopRecording();
    }, 25000);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  const answeredCount = Object.keys(profile).length;
  const progressPercent = Math.min(100, Math.round((answeredCount / 10) * 100));

  return (
    <main>
      <header className="app-header">
        <div className="header-top-bar">
          <div className="brand-badge">
            <span>🇮🇳</span> {t.sovereignBadge}
          </div>
          <div className="lang-switch-pill">
            <button
              type="button"
              className={`lang-switch-btn ${language === 'en' || !language ? 'active' : ''}`}
              onClick={() => switchLanguage('en')}
            >
              English
            </button>
            <button
              type="button"
              className={`lang-switch-btn ${language === 'te' ? 'active' : ''}`}
              onClick={() => switchLanguage('te')}
            >
              తెలుగు
            </button>
          </div>
        </div>

        <h1 className="brand-title">JanSeva AI</h1>
        <p className="brand-tagline">{t.tagline}</p>
        <div className="model-stack-pills">
          {t.models.map((m, idx) => (
            <span key={idx} className="model-pill">
              ⚡ {m}
            </span>
          ))}
        </div>
      </header>

      {/* Quick Demo Presets Bar */}
      <section className="demo-preset-container">
        <div className="preset-header">
          <span className="preset-title">{t.quickPersonas}</span>
          <span className="preset-badge-info">DPDP Synthetic • Zero PII</span>
        </div>
        <div className="preset-buttons-grid">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className="preset-btn"
              onClick={() => loadPreset(p.id)}
              disabled={busy}
            >
              <span className="preset-btn-name">
                {language === 'te' ? p.name_te : p.name}
              </span>
              <span className="preset-btn-desc">
                {language === 'te' ? p.description_te : p.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      {!language && (
        <section className="language-card">
          <h2>Select Interface Language / భాషను ఎంచుకోండి</h2>
          <p style={{ marginTop: 8, color: '#64748b', fontSize: 14 }}>
            Voice and text support in bilingual Telugu and English
          </p>
          <div className="lang-btn-group">
            <button className="btn-lang btn-lang-en" onClick={() => startSession('en')} disabled={busy}>
              English
            </button>
            <button className="btn-lang btn-lang-te" onClick={() => startSession('te')} disabled={busy}>
              తెలుగు (Telugu)
            </button>
          </div>
        </section>
      )}

      {language && (
        <>
          {/* Stepper Progress Bar */}
          {!complete && (
            <div className="stepper-container">
              <span>{t.stepProgress} ({answeredCount}/10)</span>
              <div className="stepper-bar">
                <div className="stepper-progress" style={{ width: `${progressPercent}%` }} />
              </div>
              <span>{progressPercent}%</span>
            </div>
          )}

          <section className="chat-window">
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`message-row ${m.from}`}>
                  <div className="message-bubble">{m.text}</div>
                  {m.from === 'bot' && (
                    <div className="bot-actions">
                      <SpeakButton text={m.text} language={language} />
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {recording && (
              <div className="voice-status-indicator">
                <div className="soundwave">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <span>{t.recording}</span>
              </div>
            )}
            {transcribing && (
              <div className="voice-status-indicator" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                <span>⏳ {t.transcribing}</span>
              </div>
            )}

            <form onSubmit={sendAnswer} className="chat-controls-bar">
              <button
                type="button"
                className={`btn-mic ${recording ? 'recording' : ''}`}
                onClick={recording ? stopRecording : startRecording}
                disabled={busy || transcribing || complete}
              >
                {recording ? t.stop : t.mic}
              </button>
              <input
                className="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                disabled={busy || complete}
              />
              <button type="submit" className="btn-primary" disabled={busy || complete || !input.trim()}>
                {t.send}
              </button>
            </form>
          </section>

          {/* Profile Summary Badge Bar */}
          {answeredCount > 0 && (
            <section className="profile-card">
              <div className="profile-card-title">
                <span>{t.profile}</span>
                <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>● Active Session</span>
              </div>
              <div className="profile-chips">
                {profile.age && <span className="profile-chip">🎂 Age: {profile.age}</span>}
                {profile.occupation && <span className="profile-chip">💼 {profile.occupation}</span>}
                {profile.state && <span className="profile-chip">📍 {profile.state}</span>}
                {profile.income_range && (
                  <span className="profile-chip">💰 Income: {profile.income_range.replace(/_/g, ' ')}</span>
                )}
                {profile.category && <span className="profile-chip">🏷️ Category: {profile.category}</span>}
                {profile.owns_land !== undefined && (
                  <span className="profile-chip">🌾 Land: {profile.owns_land ? 'Yes' : 'No'}</span>
                )}
              </div>
            </section>
          )}

          {complete && <Results sessionId={sessionId} language={language} profile={profile} />}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={startOver}>
              🔄 {t.restart}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
