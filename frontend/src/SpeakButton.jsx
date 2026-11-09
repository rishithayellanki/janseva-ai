import { useState } from 'react';
import { speak, stopSpeaking } from './speak';

// Telugu labels are drafts for the native-speaker review
const T = {
  en: { listen: '🔊 Listen', stop: '⏹ Stop', loading: 'Loading audio...', fail: 'Could not play the audio. You can still read the text.' },
  te: { listen: '🔊 వినండి', stop: '⏹ ఆపు', loading: 'ఆడియో లోడ్ అవుతోంది...', fail: 'ఆడియో ప్లే చేయలేకపోయాము. మీరు టెక్స్ట్ చదవవచ్చు.' },
};

export default function SpeakButton({ text, language }) {
  const ui = language === 'en' ? T.en : T.te;
  const [status, setStatus] = useState('idle');

  async function onClick() {
    if (status === 'playing') {
      stopSpeaking();
      setStatus('idle');
      return;
    }
    if (status === 'loading') return;
    setStatus('loading');
    const result = await speak(text, language);
    if (!result.ok) {
      setStatus('error');
      return;
    }
    setStatus('playing');
    await result.done;
    setStatus('idle');
  }

  return (
    <span style={{ marginLeft: 6 }}>
      <button type="button" onClick={onClick} style={{ fontSize: 12 }}>
        {status === 'playing' ? ui.stop : status === 'loading' ? ui.loading : ui.listen}
      </button>
      {status === 'error' && <span style={{ fontSize: 12, color: '#8a1c1c', marginLeft: 6 }}>{ui.fail}</span>}
    </span>
  );
}
