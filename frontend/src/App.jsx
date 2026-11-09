import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import HomeView from './HomeView';
import AssistantView from './AssistantView';
import Results from './Results';
import SchemeDirectory from './SchemeDirectory';
import GnaniStudio from './GnaniStudio';

const API = 'http://localhost:4000';
const STORE_KEY = 'janseva_session';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [presets, setPresets] = useState([]);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  // Load demo presets
  useEffect(() => {
    fetch(`${API}/api/demo-presets`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPresets(data))
      .catch(() => {});
  }, []);

  // Restore session
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
        setLanguage(data.language || 'en');
        setSessionId(data.session_id);
        setProfile(data.profile || {});
        setComplete(!data.next_question);
        setMessages(saved.messages || []);
      })
      .catch(() => {});
  }, []);

  // Save session state
  useEffect(() => {
    if (sessionId) localStorage.setItem(STORE_KEY, JSON.stringify({ sessionId, messages }));
  }, [sessionId, messages]);

  function addBot(text) {
    setMessages((m) => [...m, { from: 'bot', text }]);
  }

  async function startSession(lang = language) {
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
      setActiveTab('assistant');
    } catch {
      addBot(lang === 'te' ? 'సర్వర్ అందుబాటులో లేదు.' : 'The server is not reachable.');
    }
    setBusy(false);
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
              ? 'పౌరుల వివరాలు ధృవీకరించబడ్డాయి. మీ అర్హత గల పథకాల ఫలితాలు క్రింద చూడండి:'
              : 'Citizen profile verified. Review your statutory scheme entitlements below:',
        },
      ]);
      setActiveTab('results');
    } catch {
      addBot(lang === 'te' ? 'సర్వర్ అందుబాటులో లేదు.' : 'The server is not reachable.');
    }
    setBusy(false);
  }

  function startOver() {
    localStorage.removeItem(STORE_KEY);
    setSessionId(null);
    setMessages([]);
    setProfile({});
    setInput('');
    setComplete(false);
    setActiveTab('home');
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
      if (data.status === 'complete') {
        setActiveTab('results');
      }
    } catch {
      addBot(language === 'te' ? 'సర్వర్ అందుబాటులో లేదు.' : 'Server unreachable.');
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
      if (!res.ok) {
        addBot(
          language === 'te'
            ? 'వాయిస్ సేవ ప్రస్తుతం అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.'
            : 'Voice recognition unavailable. Please type your answer.'
        );
      } else if (data.transcript) {
        setInput(data.transcript);
      } else {
        addBot(language === 'te' ? 'ఆడియో అర్థం కాలేదు.' : 'Could not understand recording.');
      }
    } catch {
      addBot(language === 'te' ? 'సర్వర్ అందుబాటులో లేదు.' : 'Server unreachable.');
    }
    setTranscribing(false);
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      addBot(language === 'te' ? 'మైక్రోఫోన్ అనుమతించబడలేదు.' : 'Voice input not supported in this browser.');
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      addBot(language === 'te' ? 'మైక్రోఫోన్ అనుమతి ఇవ్వలేదు.' : 'Microphone permission denied.');
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

  const resultsAvailable = complete || Object.keys(profile).length >= 4;

  return (
    <main>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        resultsAvailable={resultsAvailable}
      />

      {activeTab === 'home' && (
        <HomeView
          language={language}
          onStartVoice={() => {
            if (!sessionId) startSession(language);
            else setActiveTab('assistant');
          }}
          onSelectPreset={loadPreset}
          presets={presets}
          onOpenDirectory={() => setActiveTab('directory')}
          onOpenStudio={() => setActiveTab('studio')}
        />
      )}

      {activeTab === 'assistant' && (
        <AssistantView
          language={language}
          messages={messages.length === 0 ? [{ from: 'bot', text: language === 'te' ? 'నమస్కారం! మీ వయస్సు ఎంత?' : 'Welcome! What is your age?' }] : messages}
          profile={profile}
          input={input}
          setInput={setInput}
          onSend={sessionId ? sendAnswer : (e) => { e.preventDefault(); startSession(language); }}
          onStartRecord={sessionId ? startRecording : () => startSession(language)}
          onStopRecord={stopRecording}
          recording={recording}
          transcribing={transcribing}
          busy={busy}
          complete={complete}
          onViewResults={() => setActiveTab('results')}
          onRestart={startOver}
        />
      )}

      {activeTab === 'results' && (
        <div style={{ marginTop: 12 }}>
          {sessionId ? (
            <Results sessionId={sessionId} language={language} profile={profile} />
          ) : (
            <div style={{ textAlign: 'center', padding: 48, background: '#fff', borderRadius: 12 }}>
              <h3>{language === 'te' ? 'ఇంకా పౌరుల వివరాలు నమోదు కాలేదు' : 'No citizen profile registered yet'}</h3>
              <p style={{ color: '#64748b', margin: '12px 0 20px' }}>
                {language === 'te'
                  ? 'మీ అర్హతలను తెలుసుకోవడానికి వాయిస్ అసిస్టెంట్‌తో మాట్లాడండి లేదా వర్గం వారీగా ఎంచుకోండి.'
                  : 'Start with our Voice Assistant to evaluate your statutory eligibility, or explore a citizen pathway.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    startSession(language);
                    setActiveTab('assistant');
                  }}
                >
                  🎙️ {language === 'te' ? 'వాయిస్ అసిస్టెంట్ ప్రారంభించండి' : 'Start Voice Assistant'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveTab('home')}
                >
                  👥 {language === 'te' ? 'వర్గాల వారీగా పథకాలు' : 'Explore Citizen Categories'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'directory' && <SchemeDirectory language={language} />}

      {activeTab === 'studio' && <GnaniStudio language={language} />}
    </main>
  );
}
