require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const multer = require('multer');
const db = require('./db');
const onboarding = require('./onboarding');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

// Load verified scheme records from data/schemes/ into the schemes table
const schemesDir = path.join(__dirname, '..', 'data', 'schemes');
const upsertScheme = db.prepare('INSERT OR REPLACE INTO schemes (scheme_id, data_json) VALUES (?, ?)');
for (const file of fs.readdirSync(schemesDir).filter((f) => f.endsWith('.json'))) {
  const record = JSON.parse(fs.readFileSync(path.join(schemesDir, file), 'utf8'));
  upsertScheme.run(record.scheme_id, JSON.stringify(record));
}

// Convert any browser recording (WebM, MP4, OGG) to 16 kHz mono WAV
function toWav(buffer) {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const inPath = path.join(os.tmpdir(), `${id}.in`);
    const outPath = path.join(os.tmpdir(), `${id}.wav`);
    fs.writeFileSync(inPath, buffer);
    execFile('ffmpeg', ['-y', '-i', inPath, '-ac', '1', '-ar', '16000', '-f', 'wav', outPath], (err) => {
      fs.rmSync(inPath, { force: true });
      if (err) {
        fs.rmSync(outPath, { force: true });
        return reject(err);
      }
      const wav = fs.readFileSync(outPath);
      fs.rmSync(outPath, { force: true });
      resolve(wav);
    });
  });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'janseva-backend' });
});

app.post('/api/sessions', (req, res) => {
  const language = req.body && req.body.language === 'te' ? 'te' : 'en';
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare('INSERT INTO sessions (session_id, language, profile_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
    .run(id, language, '{}', now, now);
  const first = onboarding.QUESTIONS[0];
  res.status(201).json({ session_id: id, language, message: first.prompt[language], next_question: first.field });
});

app.get('/api/sessions/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM sessions WHERE session_id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'session_not_found' });
  const profile = JSON.parse(row.profile_json);
  const next = onboarding.nextQuestion(profile);
  res.json({
    session_id: row.session_id,
    language: row.language,
    profile,
    next_question: next ? next.field : null,
    message: next ? next.prompt[row.language] : onboarding.DONE[row.language],
  });
});

app.post('/api/sessions/:id/answer', (req, res) => {
  const row = db.prepare('SELECT * FROM sessions WHERE session_id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'session_not_found' });

  const lang = row.language;
  const profile = JSON.parse(row.profile_json);
  const current = onboarding.nextQuestion(profile);
  if (!current) {
    return res.json({ status: 'complete', message: onboarding.DONE[lang], profile, next_question: null });
  }

  const answer = String((req.body && req.body.answer) || '');
  const result = onboarding.parse(current.field, answer, lang);
  if (!result.ok) {
    return res.json({ status: 'followup', message: result.message, profile, next_question: current.field });
  }

  profile[current.field] = result.value;
  db.prepare('UPDATE sessions SET profile_json = ?, updated_at = ? WHERE session_id = ?')
    .run(JSON.stringify(profile), new Date().toISOString(), row.session_id);

  const next = onboarding.nextQuestion(profile);
  if (!next) {
    return res.json({ status: 'complete', message: onboarding.DONE[lang], profile, next_question: null });
  }
  res.json({ status: 'saved', message: next.prompt[lang], profile, next_question: next.field });
});

// Speech to text through Gnani Prisma v3.0. The API key never leaves the backend.
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  const lang = req.body.language === 'te' ? 'te' : 'en';
  if (!req.file) return res.status(400).json({ error: 'no_audio' });

  const key = process.env.GNANI_API_KEY;
  if (!key) {
    console.error('GNANI_API_KEY is not set in ../.env');
    return res.status(502).json({ error: 'speech_unavailable' });
  }

  let wav;
  try {
    wav = await toWav(req.file.buffer);
  } catch (err) {
    console.error('ffmpeg conversion failed. Is ffmpeg installed?', err.message);
    return res.status(502).json({ error: 'speech_unavailable' });
  }

  const form = new FormData();
  form.append('audio_file', new Blob([wav], { type: 'audio/wav' }), 'voice.wav');
  form.append('model', 'prisma-v3.0');
  form.append('language_code', lang === 'te' ? 'te-IN,en-IN' : 'en-IN');
  form.append('format', 'codemix');

  try {
    const r = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: { 'X-API-Key-ID': key },
      body: form,
      signal: AbortSignal.timeout(20000),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.success) {
      console.error('Gnani STT failed:', r.status, JSON.stringify(data));
      return res.status(502).json({ error: 'speech_unavailable' });
    }
    if (!data.transcript || !data.transcript.trim()) {
      return res.status(422).json({ error: 'no_speech' });
    }
    res.json({ transcript: data.transcript, detected_language: data.detected_language_code, source: 'gnani' });
  } catch (err) {
    console.error('Gnani STT error:', err.message);
    res.status(502).json({ error: 'speech_unavailable' });
  }
});

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'audio_too_large' });
  console.error(err);
  res.status(500).json({ error: 'server_error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
