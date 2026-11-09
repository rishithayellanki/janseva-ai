// Text to speech through Gnani Timbre v3.0. The API key stays on the backend.
// Gnani allows one active request at a time, so requests are queued.
let queue = Promise.resolve();

const VOICE = 'Lakshmi';
const MODEL = 'timbre-v3.0';
const LANGUAGE = { en: 'en-IN', te: 'te-IN', auto: 'auto' };

// Money is written as words, as the Gnani docs advise, and list markers are simplified
function speechText(text, lang) {
  const rupees = lang === 'en' ? 'rupees' : 'రూపాయలు';
  return String(text)
    .replace(/₹\s*([\d.,]+)\s*(lakh|లక్ష\S*)/gi, (m, n, unit) => `${n} ${unit} ${rupees}`)
    .replace(/₹/g, '')
    .replace(/(\d+)\)\s*/g, '$1. ')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = function register(app) {
  app.post('/api/speak', async (req, res) => {
    const body = req.body || {};
    const lang = ['en', 'te', 'auto'].includes(body.language) ? body.language : 'en';
    const text = speechText(body.text || '', lang);
    if (!text) return res.status(400).json({ error: 'no_text' });
    if (text.length > 1200) return res.status(413).json({ error: 'text_too_long' });

    const key = process.env.GNANI_API_KEY;
    if (!key) {
      console.error('GNANI_API_KEY is not set in ../.env');
      return res.status(502).json({ error: 'speech_unavailable' });
    }

    const run = async () => {
      try {
        const r = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key-ID': key },
          body: JSON.stringify({
            text,
            voice: VOICE,
            model: MODEL,
            language: LANGUAGE[lang] || 'en-IN',
            speed: 1.0,
            audio_config: { sample_rate: 24000, num_channels: 1, sample_width: 2, encoding: 'linear_pcm', container: 'wav' },
          }),
          signal: AbortSignal.timeout(20000),
        });
        if (!r.ok) {
          console.error('Gnani TTS failed:', r.status, (await r.text().catch(() => '')).slice(0, 300));
          return { ok: false };
        }
        return { ok: true, audio: Buffer.from(await r.arrayBuffer()) };
      } catch (err) {
        console.error('Gnani TTS error:', err.message);
        return { ok: false };
      }
    };

    const job = queue.then(run);
    queue = job;
    const result = await job;
    if (!result.ok) {
      return res.status(502).json({ error: 'speech_unavailable' });
    }
    res.set('Content-Type', 'audio/wav').send(result.audio);
  });
};
