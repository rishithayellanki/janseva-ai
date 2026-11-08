import Results from './Results';
import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:4000';
const STORE_KEY = 'janseva_session';

const UI = {
  en: {
    send: 'Send',
    mic: '🎤 Speak',
    stop: '⏹ Stop',
    placeholder: 'Type your answer...',
    profile: 'Your profile so far',
    restart: 'Start over',
    recording: 'Recording... tap Stop when you finish.',
    transcribing: 'Converting your voice to text...',
    micDenied: 'Microphone permission was denied. Allow microphone access in your browser settings, or type your answer.',
    micNone: 'No microphone was found. Please type your answer.',
    micUnsupported: 'Voice input is not supported in this browser. Please type your answer.',
    speechFail: 'I could not understand that recording. Please try again or type your answer.',
    speechDown: 'Voice recognition is unavailable right now. Please type your answer.',
    noServer: 'The server is not reachable. Please try again.',
  },
  te: {
    send: 'పంపు',
    mic: '🎤 మాట్లాడండి',
    stop: '⏹ ఆపు',
    placeholder: 'మీ సమాధానం టైప్ చేయండి...',
    profile: 'ఇప్పటివరకు మీ ప్రొఫైల్',
    restart: 'మొదటి నుండి ప్రారంభించండి',
    recording: 'రికార్డ్ అవుతోంది... పూర్తయ్యాక ఆపు నొక్కండి.',
    transcribing: 'మీ మాటను టెక్స్ట్‌గా మారుస్తున్నాము...',
    micDenied: 'మైక్రోఫోన్ అనుమతి ఇవ్వలేదు. బ్రౌజర్ సెట్టింగ్‌లో మైక్రోఫోన్ అనుమతించండి, లేదా టైప్ చేయండి.',
    micNone: 'మైక్రోఫోన్ కనబడలేదు. దయచేసి టైప్ చేయండి.',
    micUnsupported: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ పని చేయదు. దయచేసి టైప్ చేయండి.',
    speechFail: 'ఆ రికార్డింగ్ అర్థం కాలేదు. మళ్లీ ప్రయత్నించండి లేదా టైప్ చేయండి.',
    speechDown: 'వాయిస్ సేవ ప్రస్తుతం అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.',
    noServer: 'సర్వర్ అందుబాటులో లేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
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
  const endRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const t = UI[language || 'en'];

  // Restore the session after a page refresh
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

  // Save the session after every change
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
      else if (data.transcript) setInput(data.transcript);
      else addBot(t.speechFail);
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

          {recording && <p>{t.recording}</p>}
          {transcribing && <p>{t.transcribing}</p>}

          <form onSubmit={sendAnswer} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              disabled={busy || transcribing || complete}
            >
              {recording ? t.stop : t.mic}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={busy || complete}
              style={{ flex: 1, padding: 8 }}
            />
            <button type="submit" disabled={busy || complete || !input.trim()}>{t.send}</button>
          </form>

          <h3>{t.profile}</h3>
          <pre style={{ background: '#fafafa', padding: 8 }}>{JSON.stringify(profile, null, 2)}</pre>
          {complete && <Results sessionId={sessionId} />}
          <button onClick={startOver}>{t.restart}</button>
        </>
      )}
    </main>
  );
}
