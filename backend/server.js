require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const onboarding = require('./onboarding');

const app = express();
app.use(cors());
app.use(express.json());

// Load verified scheme records from data/schemes/ into the schemes table
const schemesDir = path.join(__dirname, '..', 'data', 'schemes');
const upsertScheme = db.prepare('INSERT OR REPLACE INTO schemes (scheme_id, data_json) VALUES (?, ?)');
for (const file of fs.readdirSync(schemesDir).filter((f) => f.endsWith('.json'))) {
  const record = JSON.parse(fs.readFileSync(path.join(schemesDir, file), 'utf8'));
  upsertScheme.run(record.scheme_id, JSON.stringify(record));
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

app.get('/api/sessions/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM sessions WHERE session_id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'session_not_found' });
  res.json({ session_id: row.session_id, language: row.language, profile: JSON.parse(row.profile_json) });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
