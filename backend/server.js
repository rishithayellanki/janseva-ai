const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');
const multer = require('multer');
const db = require('./db');
const onboarding = require('./onboarding');
const eligibility = require('./eligibility');
const evon = require('./evon');

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

// Citizen Category Pathways for Fast-Track Entitlement Assessment (DPDP-compliant)
const DEMO_PRESETS = [
  {
    id: 'student-sc',
    name: 'College & Higher Education Students',
    name_te: 'ఉన్నత విద్య & కళాశాల విద్యార్థులు',
    badge: '🎓 Education Support',
    description: 'Post-matric and university degree students from low-income families (PMS-SC, PM-USP)',
    description_te: 'పోస్ట్ మెట్రిక్ ఉన్నత చదువులు చదువుతున్న కళాశాల విద్యార్థుల స్కాలర్‌షిప్ ప్రయోజనాలు',
    profile: {
      age: 20,
      occupation: 'College student',
      state: 'Telangana',
      income_range: 'up_to_1_lakh',
      category: 'SC',
      is_indian_national: true,
      has_aadhaar: true,
      has_bank_account: true,
      owns_land: false,
      paid_income_tax: false,
      family_excluded_group: false,
      receives_pension: false,
      course_recognised: true,
      regular_course: true,
      has_other_scholarship: false,
    },
  },
  {
    id: 'farmer-bc',
    name: 'Small & Marginal Landholding Farmers',
    name_te: 'సన్నకారు & చిన్నకారు రైతులు',
    badge: '🌾 Agricultural Welfare',
    description: 'Landholding agricultural families seeking income support and crop insurance (PM-KISAN, PMFBY)',
    description_te: 'సాగు భూమి ఉన్న రైతు కుటుంబాల పెట్టుబడి సహాయం & పంట నష్టపరిహార పథకాలు',
    profile: {
      age: 42,
      occupation: 'Farmer',
      state: 'Andhra Pradesh',
      income_range: '2_to_2_5_lakh',
      category: 'BC',
      is_indian_national: true,
      has_aadhaar: true,
      has_bank_account: true,
      owns_land: true,
      land_before_2019: true,
      paid_income_tax: false,
      family_excluded_group: false,
      receives_pension: false,
    },
  },
  {
    id: 'school-bc',
    name: 'Secondary School Students (Govt School)',
    name_te: 'ప్రభుత్వ పాఠశాల విద్యార్థులు',
    badge: '🎒 School Merit Aid',
    description: 'Students in Classes 8-12 in Government/Local Body schools (NMMSS National Merit Aid)',
    description_te: 'ప్రభుత్వ పాఠశాలల్లో 8-12 తరగతులు చదువుతున్న విద్యార్థుల జాతీయ మెరిట్ స్కాలర్‌షిప్',
    profile: {
      age: 14,
      occupation: 'School student',
      state: 'Telangana',
      income_range: '1_to_2_lakh',
      category: 'BC',
      is_indian_national: true,
      has_aadhaar: true,
      has_bank_account: true,
      owns_land: false,
      paid_income_tax: false,
      family_excluded_group: false,
      receives_pension: false,
      school_govt: true,
      has_other_scholarship: false,
    },
  },
  {
    id: 'vendor-se',
    name: 'Street Vendors & Micro-Entrepreneurs',
    name_te: 'చిరు వ్యాపారులు & స్వయం ఉపాధి',
    badge: '💼 Livelihood & MSME',
    description: 'Urban street vendors and self-employed individuals seeking micro-credit & health cover',
    description_te: 'పట్టణ చిరు వ్యాపారులు, స్వయం ఉపాధి మరియు ఉచిత ఆరోగ్య సంరక్షణ పథకాలు',
    profile: {
      age: 36,
      occupation: 'Self-employed',
      state: 'Telangana',
      income_range: '1_to_2_lakh',
      category: 'BC',
      is_indian_national: true,
      has_aadhaar: true,
      has_bank_account: true,
      owns_land: false,
      paid_income_tax: false,
      family_excluded_group: false,
      receives_pension: false,
    },
  },
  {
    id: 'farmer-kmy',
    name: 'Young Farmers & Social Security',
    name_te: 'యువ రైతులు & సామాజిక భద్రత',
    badge: '🛡️ Pension & Life Cover',
    description: 'Small farmers aged 18-40 seeking monthly social security pension and life cover (PM-KMY, PMJJBY)',
    description_te: '18-40 ఏళ్ల చిన్నకారు రైతుల వృద్ధాప్య పెన్షన్ మరియు జీవిత బీమా రక్షణ',
    profile: {
      age: 34,
      occupation: 'Farmer',
      state: 'Telangana',
      income_range: '1_to_2_lakh',
      category: 'OBC',
      is_indian_national: true,
      has_aadhaar: true,
      has_bank_account: true,
      owns_land: true,
      land_before_2019: true,
      paid_income_tax: false,
      family_excluded_group: false,
      receives_pension: false,
    },
  },
];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'janseva-backend',
    models: {
      stt: 'Gnani Prisma v3.0',
      tts: 'Gnani Timbre v3.0',
      reasoning: 'Gnani Evon v3.3',
    },
    apiKeyConfigured: Boolean(process.env.GNANI_API_KEY),
  });
});

app.get('/api/demo-presets', (req, res) => {
  res.json(DEMO_PRESETS);
});

app.post('/api/sessions/preset/:presetId', (req, res) => {
  const preset = DEMO_PRESETS.find((p) => p.id === req.params.presetId);
  if (!preset) return res.status(404).json({ error: 'preset_not_found' });
  const language = req.body && req.body.language === 'te' ? 'te' : 'en';
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare('INSERT INTO sessions (session_id, language, profile_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
    .run(id, language, JSON.stringify(preset.profile), now, now);
  res.status(201).json({
    session_id: id,
    language,
    profile: preset.profile,
    message: onboarding.DONE[language],
    next_question: null,
  });
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

// Scheme matches for a session. Scheme records come from the database.
app.get('/api/schemes', (req, res) => {
  const records = db.prepare('SELECT data_json FROM schemes').all().map((r) => JSON.parse(r.data_json));
  res.json(records);
});

app.get('/api/sessions/:id/matches', (req, res) => {
  const row = db.prepare('SELECT * FROM sessions WHERE session_id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'session_not_found' });
  const profile = JSON.parse(row.profile_json);
  const records = db.prepare('SELECT data_json FROM schemes').all().map((r) => JSON.parse(r.data_json));
  res.json({ profile, matches: eligibility.matchSchemes(records, profile) });
});

// Evon v3.3 Sovereign Counselor: Personalized explanation of eligibility
app.post('/api/sessions/:id/counsel', async (req, res) => {
  const row = db.prepare('SELECT * FROM sessions WHERE session_id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'session_not_found' });
  const profile = JSON.parse(row.profile_json);
  const schemeId = req.body && req.body.scheme_id;
  const records = db.prepare('SELECT data_json FROM schemes').all().map((r) => JSON.parse(r.data_json));
  const matches = eligibility.matchSchemes(records, profile);
  const match = matches.find((m) => m.scheme_id === schemeId) || matches[0];
  if (!match) return res.status(404).json({ error: 'scheme_not_found' });

  const advice = await evon.generateCounseling({
    profile,
    match,
    language: row.language,
  });
  res.json(advice);
});

// Evon v3.3 Citizen Scheme Q&A: Grounded conversational answers
app.post('/api/sessions/:id/ask', async (req, res) => {
  const row = db.prepare('SELECT * FROM sessions WHERE session_id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'session_not_found' });
  const profile = JSON.parse(row.profile_json);
  const schemeId = req.body && req.body.scheme_id;
  const query = req.body && req.body.query;
  if (!query) return res.status(400).json({ error: 'no_query' });

  const records = db.prepare('SELECT data_json FROM schemes').all().map((r) => JSON.parse(r.data_json));
  const matches = eligibility.matchSchemes(records, profile);
  const match = matches.find((m) => m.scheme_id === schemeId) || matches[0];
  if (!match) return res.status(404).json({ error: 'scheme_not_found' });

  const answer = await evon.generateCounseling({
    profile,
    match,
    query,
    language: row.language,
  });
  res.json(answer);
});

// Document Procurement Guide Endpoint
app.get('/api/documents/guide', (req, res) => {
  const doc = req.query.doc || '';
  const lang = req.query.lang === 'te' ? 'te' : 'en';
  res.json(evon.getProcurementAdvice(doc, lang));
});

require('./tts')(app);

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
    return res.status(502).json({ error: 'speech_unavailable' });
  }
});

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'audio_too_large' });
  console.error(err);
  res.status(500).json({ error: 'server_error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`JanSeva AI Backend running on http://localhost:${PORT}`);
  console.log(`Powered by Gnani Prisma v3.0 (STT), Timbre v3.0 (TTS) & Evon v3.3 (Reasoning)`);
});
