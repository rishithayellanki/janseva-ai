import React, { useRef, useEffect } from 'react';
import SpeakButton from './SpeakButton';

export default function AssistantView({
  language,
  messages,
  profile,
  input,
  setInput,
  onSend,
  onStartRecord,
  onStopRecord,
  recording,
  transcribing,
  busy,
  complete,
  onViewResults,
  onRestart,
}) {
  const isTe = language === 'te';
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const answeredCount = Object.keys(profile).length;
  const progressPercent = Math.min(100, Math.round((answeredCount / 10) * 100));

  return (
    <div className="assistant-view-container">
      {/* Onboarding Stepper */}
      <div className="stepper-container">
        <span style={{ fontWeight: 600 }}>
          {isTe ? 'ప్రొఫైల్ నమోదు పురోగతి' : 'Citizen Onboarding Progress'} ({answeredCount}/10)
        </span>
        <div className="stepper-bar">
          <div className="stepper-progress" style={{ width: `${progressPercent}%` }} />
        </div>
        <span style={{ fontWeight: 700, color: '#0284c7' }}>{progressPercent}%</span>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="chat-window">
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

        {/* Live Audio Recording Waveform Indicator */}
        {recording && (
          <div className="voice-status-indicator">
            <div className="soundwave">
              <span />
              <span />
              <span />
              <span />
            </div>
            <span>{isTe ? 'మీ వాయిస్ వింటున్నాము... (పూర్తయ్యాక ఆపు నొక్కండి)' : 'Listening to your voice... (Tap Stop when done)'}</span>
          </div>
        )}

        {transcribing && (
          <div className="voice-status-indicator" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
            <span>⏳ {isTe ? 'జ్ఞాని ప్రిజ్మా v3.0 ద్వారా మాటను టెక్స్ట్‌గా మారుస్తున్నాము...' : 'Transcribing voice via Gnani Prisma v3.0...'}</span>
          </div>
        )}

        {/* Chat Control Bar */}
        <form onSubmit={onSend} className="chat-controls-bar">
          <button
            type="button"
            className={`btn-mic ${recording ? 'recording' : ''}`}
            onClick={recording ? onStopRecord : onStartRecord}
            disabled={busy || transcribing || complete}
          >
            {recording ? (isTe ? '⏹ ఆపు' : '⏹ Stop') : (isTe ? '🎤 మాట్లాడండి' : '🎤 Speak')}
          </button>
          <input
            className="input-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTe ? 'సమాధానం చెప్పండి లేదా టైప్ చేయండి (తెలుగు/English)...' : 'Speak or type your answer (Telugu or English)...'}
            disabled={busy || complete}
          />
          <button type="submit" className="btn-primary" disabled={busy || complete || !input.trim()}>
            {isTe ? 'పంపు' : 'Send'}
          </button>
        </form>
      </div>

      {/* Completion Banner */}
      {complete && (
        <div className="completion-banner">
          <div className="completion-text">
            <h3>🎉 {isTe ? 'ప్రొఫైల్ నమోదు పూర్తయింది!' : 'Profile Evaluation Complete!'}</h3>
            <p>{isTe ? 'మీ అర్హత గల ప్రభుత్వ సంక్షేమ పథకాల ఫలితాలను చూడండి.' : 'Review your verified Central and State scheme entitlements.'}</p>
          </div>
          <button type="button" className="btn-view-results" onClick={onViewResults}>
            📋 {isTe ? 'నా అర్హతలు చూడండి →' : 'View Scheme Matches →'}
          </button>
        </div>
      )}

      {/* Profile Snapshot Chips */}
      {answeredCount > 0 && (
        <section className="profile-card">
          <div className="profile-card-title">
            <span>{isTe ? 'నిర్ధారించబడిన పౌరుల వివరాలు' : 'Verified Citizen Profile Snapshot'}</span>
            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>● Active Session</span>
          </div>
          <div className="profile-chips">
            {profile.age && <span className="profile-chip">🎂 {isTe ? 'వయస్సు' : 'Age'}: {profile.age}</span>}
            {profile.occupation && <span className="profile-chip">💼 {profile.occupation}</span>}
            {profile.state && <span className="profile-chip">📍 {profile.state}</span>}
            {profile.income_range && (
              <span className="profile-chip">💰 {profile.income_range.replace(/_/g, ' ')}</span>
            )}
            {profile.category && <span className="profile-chip">🏷️ {profile.category}</span>}
            {profile.owns_land !== undefined && (
              <span className="profile-chip">🌾 {isTe ? 'భూమి' : 'Land'}: {profile.owns_land ? 'Yes' : 'No'}</span>
            )}
          </div>
        </section>
      )}

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button type="button" className="btn-secondary" onClick={onRestart}>
          🔄 {isTe ? 'మొదటి నుండి ప్రారంభించండి' : 'Reset Conversation'}
        </button>
      </div>
    </div>
  );
}
