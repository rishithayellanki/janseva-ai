const API = 'http://localhost:4000';

let token = 0;
let stopCurrent = null;

export function stopSpeaking() {
  token += 1;
  if (stopCurrent) {
    stopCurrent();
    stopCurrent = null;
  }
}

// Fetches speech from the backend and plays it. Returns { ok, done }.
export async function speak(text, language) {
  stopSpeaking();
  const mine = token;
  let res;
  try {
    res = await fetch(`${API}/api/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });
  } catch {
    return { ok: false };
  }
  if (!res.ok) return { ok: false };
  const blob = await res.blob();
  if (mine !== token) return { ok: true, done: Promise.resolve() };

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  const done = new Promise((resolve) => {
    const finish = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onended = finish;
    audio.onerror = finish;
    stopCurrent = () => {
      audio.pause();
      finish();
    };
  });
  try {
    await audio.play();
  } catch {
    stopCurrent = null;
    URL.revokeObjectURL(url);
    return { ok: false };
  }
  return { ok: true, done };
}
