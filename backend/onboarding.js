const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// Telugu names (draft; a Telugu reviewer should confirm the spellings)
const STATE_TE = {
  'Andhra Pradesh': 'ఆంధ్రప్రదేశ్', 'Arunachal Pradesh': 'అరుణాచల్‌ప్రదేశ్', 'Assam': 'అస్సాం',
  'Bihar': 'బీహార్', 'Chhattisgarh': 'ఛత్తీస్‌గఢ్', 'Goa': 'గోవా', 'Gujarat': 'గుజరాత్',
  'Haryana': 'హర్యానా', 'Himachal Pradesh': 'హిమాచల్‌ప్రదేశ్', 'Jharkhand': 'జార్ఖండ్',
  'Karnataka': 'కర్ణాటక', 'Kerala': 'కేరళ', 'Madhya Pradesh': 'మధ్యప్రదేశ్',
  'Maharashtra': 'మహారాష్ట్ర', 'Manipur': 'మణిపూర్', 'Meghalaya': 'మేఘాలయ',
  'Mizoram': 'మిజోరం', 'Nagaland': 'నాగాలాండ్', 'Odisha': 'ఒడిశా', 'Punjab': 'పంజాబ్',
  'Rajasthan': 'రాజస్థాన్', 'Sikkim': 'సిక్కిం', 'Tamil Nadu': 'తమిళనాడు',
  'Telangana': 'తెలంగాణ', 'Tripura': 'త్రిపుర', 'Uttar Pradesh': 'ఉత్తరప్రదేశ్',
  'Uttarakhand': 'ఉత్తరాఖండ్', 'West Bengal': 'పశ్చిమ బెంగాల్',
  'Andaman and Nicobar Islands': 'అండమాన్ నికోబార్ దీవులు', 'Chandigarh': 'చండీగఢ్',
  'Dadra and Nagar Haveli and Daman and Diu': 'దాద్రా నగర్ హవేలీ మరియు డామన్ డయ్యూ',
  'Delhi': 'ఢిల్లీ', 'Jammu and Kashmir': 'జమ్మూ కాశ్మీర్', 'Ladakh': 'లడఖ్',
  'Lakshadweep': 'లక్షద్వీప్', 'Puducherry': 'పుదుచ్చేరి',
};

// Other spellings people commonly say
const STATE_ALIASES = {
  'Telangana': ['తెలంగాణా'],
  'Andhra Pradesh': ['ఆంధ్ర ప్రదేశ్'],
};

const OCCUPATIONS = [
  { label: 'Student', keys: ['student', 'studying', 'college', 'school', 'విద్యార్థి', 'చదువు'] },
  { label: 'Farmer', keys: ['farmer', 'farming', 'agriculture', 'రైతు', 'వ్యవసాయ'] },
  { label: 'Daily wage worker', keys: ['daily wage', 'labour', 'labor', 'coolie', 'కూలీ', 'కూలి'] },
  { label: 'Self-employed', keys: ['self-employed', 'self employed', 'business', 'shop', 'స్వయం'] },
  { label: 'Salaried employee', keys: ['salaried', 'employee', 'job', 'ఉద్యోగి'] },
  { label: 'Not working', keys: ['not working', 'unemployed', 'no job', 'పని లేదు'] },
  { label: 'Other', keys: ['other', 'ఇతర'] },
];

// Six fixed income bands, matched to the scheme thresholds
const INCOME_OPTIONS = [
  { value: 'up_to_1_lakh' },
  { value: '1_to_2_lakh' },
  { value: '2_to_2_5_lakh' },
  { value: '2_5_to_3_5_lakh' },
  { value: '3_5_to_4_5_lakh' },
  { value: 'above_4_5_lakh' },
];

// Number words the speech service may return, in English and Telugu
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  'సున్నా': 0, 'ఒక': 1, 'ఒకటి': 1, 'ఒక్కటి': 1, 'రెండు': 2, 'మూడు': 3, 'నాలుగు': 4,
  'ఐదు': 5, 'ఆరు': 6, 'ఏడు': 7, 'ఎనిమిది': 8, 'తొమ్మిది': 9, 'పది': 10, 'పదకొండు': 11,
  'పన్నెండు': 12, 'పదమూడు': 13, 'పద్నాలుగు': 14, 'పదిహేను': 15, 'పదహారు': 16,
  'పదిహేడు': 17, 'పద్దెనిమిది': 18, 'పందొమ్మిది': 19, 'ఇరవై': 20, 'ఇరవయ్': 20,
  'ఇరవైయ్': 20, 'ముప్పై': 30, 'నలభై': 40, 'యాభై': 50, 'అరవై': 60, 'డెబ్బై': 70,
  'ఎనభై': 80, 'తొంభై': 90,
};

// Keys stored in the same Unicode form as cleaned input, so lookups always match
const WORDS = new Map(
  Object.entries(NUMBER_WORDS).map(([word, value]) => [word.normalize('NFC'), value])
);

const QUESTIONS = [
  {
    field: 'age',
    prompt: { en: 'What is your age?', te: 'మీ వయస్సు ఎంత?' },
    followUp: {
      en: 'Please say or type your age in years, for example 20.',
      te: 'దయచేసి మీ వయస్సును సంవత్సరాలలో చెప్పండి లేదా టైప్ చేయండి, ఉదాహరణకు 20.',
    },
  },
  {
    field: 'occupation',
    prompt: {
      en: 'What is your occupation? Reply 1 to 7: 1) Student 2) Farmer 3) Daily wage worker 4) Self-employed 5) Salaried employee 6) Not working 7) Other',
      te: 'మీ వృత్తి ఏమిటి? 1 నుండి 7 వరకు సమాధానం ఇవ్వండి: 1) విద్యార్థి 2) రైతు 3) రోజువారీ కూలీ 4) స్వయం ఉపాధి 5) ఉద్యోగి 6) పని లేదు 7) ఇతరం',
    },
    followUp: {
      en: 'Please reply with a number from 1 to 7, or say your occupation.',
      te: 'దయచేసి 1 నుండి 7 మధ్య ఒక సంఖ్యతో సమాధానం ఇవ్వండి, లేదా మీ వృత్తి చెప్పండి.',
    },
  },
  {
    field: 'state',
    prompt: {
      en: 'Which state or union territory do you live in? Say or type the name in English or Telugu.',
      te: 'మీరు ఏ రాష్ట్రం లేదా కేంద్రపాలిత ప్రాంతంలో నివసిస్తున్నారు? రాష్ట్రం పేరు తెలుగులో లేదా ఇంగ్లీష్‌లో చెప్పండి లేదా టైప్ చేయండి.',
    },
    followUp: {
      en: 'I did not recognise that state. Please say or type the full name in English or Telugu.',
      te: 'ఆ రాష్ట్రాన్ని గుర్తించలేకపోయాను. దయచేసి రాష్ట్రం పూర్తి పేరును తెలుగులో లేదా ఇంగ్లీష్‌లో చెప్పండి లేదా టైప్ చేయండి.',
    },
  },
  {
    field: 'income_range',
    prompt: {
      en: 'What is your family’s total annual income? Reply 1 to 6: 1) Up to ₹1 lakh 2) ₹1 to ₹2 lakh 3) ₹2 to ₹2.5 lakh 4) ₹2.5 to ₹3.5 lakh 5) ₹3.5 to ₹4.5 lakh 6) Above ₹4.5 lakh',
      te: 'మీ కుటుంబ మొత్తం వార్షిక ఆదాయం ఎంత? 1 నుండి 6 వరకు సమాధానం ఇవ్వండి: 1) ₹1 లక్ష వరకు 2) ₹1 నుండి ₹2 లక్షలు 3) ₹2 నుండి ₹2.5 లక్షలు 4) ₹2.5 నుండి ₹3.5 లక్షలు 5) ₹3.5 నుండి ₹4.5 లక్షలు 6) ₹4.5 లక్షలకు పైగా',
    },
    followUp: {
      en: 'Please say the amount in lakh, for example 2.5 lakh, or reply with a number from 1 to 6.',
      te: 'దయచేసి ఆదాయాన్ని లక్షలలో చెప్పండి, ఉదాహరణకు 2.5 లక్షలు, లేదా 1 నుండి 6 మధ్య సంఖ్యతో సమాధానం ఇవ్వండి.',
    },
  },
];

const DONE = {
  en: 'Thank you. Your profile is complete. Next we will find schemes that may suit you.',
  te: 'ధన్యవాదాలు. మీ ప్రొఫైల్ పూర్తయింది. తదుపరి మీకు సరిపడే పథకాలను వెతుకుతాము.',
};

// Standard Unicode form with invisible joiners removed
function clean(raw) {
  return String(raw).normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');
}

// Turn number words into digits, joining tens and units ("twenty one" -> "21")
function wordsToDigits(text) {
  const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const v = WORDS.get(tokens[i]);
    if (v === undefined) {
      out.push(tokens[i]);
      continue;
    }
    let total = v;
    const next = WORDS.get(tokens[i + 1]);
    if (v >= 20 && v % 10 === 0 && next !== undefined && next < 10) {
      total = v + next;
      i++;
    }
    out.push(String(total));
  }
  return out.join(' ');
}

// Clean an answer for parsing. Decimals (4.5) and amounts (1,00,000) are kept intact.
function normalise(raw) {
  let t = clean(raw)
    .replace(/[౦-౯]/g, (c) => String(c.charCodeAt(0) - 0x0c66)) // Telugu digits to ASCII
    .replace(/(\d),(?=\d)/g, '$1')                               // 1,00,000 -> 100000
    .replace(/(?<!\d)\.|\.(?!\d)/g, ' ')                         // drop full stops, keep decimals
    .replace(/[!?।,\-]/g, ' ')
    .replace(/లక్షలకు|లక్షలు|లక్షల|లక్షకు|లక్ష/g, ' lakh ')        // Telugu "lakh" forms
    .replace(/\s+/g, ' ')
    .trim();
  t = wordsToDigits(t);
  t = t.replace(/(\d+)\s*(?:point|పాయింట్)\s*(\d+)/gi, '$1.$2'); // "four point five" -> 4.5
  return t.trim();
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

const STATE_LIST = STATES.map((name) => ({
  name,
  forms: [name, STATE_TE[name], ...(STATE_ALIASES[name] || [])]
    .map((f) => clean(f).toLowerCase().trim())
    .filter(Boolean),
}));

// Match a state by exact name, by name inside a sentence, or by a close spelling
function matchState(text) {
  const t = clean(text).toLowerCase().trim();
  if (!t) return null;
  for (const s of STATE_LIST) {
    for (const f of s.forms) {
      if (t === f || (f.length > 3 && t.includes(f))) return s.name;
    }
  }
  let best = null;
  let bestDistance = Infinity;
  for (const s of STATE_LIST) {
    for (const f of s.forms) {
      const d = levenshtein(t, f);
      if (d < bestDistance) {
        bestDistance = d;
        best = s.name;
      }
    }
  }
  const allowed = t.length >= 8 ? 2 : 1;
  return bestDistance <= allowed ? best : null;
}

function bandFor(amountInLakh) {
  if (amountInLakh <= 1) return 'up_to_1_lakh';
  if (amountInLakh <= 2) return '1_to_2_lakh';
  if (amountInLakh <= 2.5) return '2_to_2_5_lakh';
  if (amountInLakh <= 3.5) return '2_5_to_3_5_lakh';
  if (amountInLakh <= 4.5) return '3_5_to_4_5_lakh';
  return 'above_4_5_lakh';
}

// Accepts 1 to 6, or an amount in lakh or rupees, with optional "above" or "up to"
function parseIncome(text) {
  const t = text.toLowerCase();
  if (/^[1-6]$/.test(t)) return INCOME_OPTIONS[Number(t) - 1].value;

  const m = t.match(/\d+(\.\d+)?/);
  if (!m) return null;

  const hasLakh = /lakh/.test(t);
  let amount = Number(m[0]);
  if (!hasLakh) {
    if (amount >= 1000) amount = amount / 100000; // rupees, e.g. 100000
    else if (amount > 100) return null;           // unclear, ask again
  }
  if (amount <= 0 || amount > 50) return null;

  const above = /above|over|more than|పైగా|పైన|ఎక్కువ/.test(t);
  if (above) return amount >= 4.5 ? 'above_4_5_lakh' : null;

  return bandFor(amount);
}

function nextQuestion(profile) {
  return QUESTIONS.find((q) => profile[q.field] === undefined) || null;
}

function parse(field, raw, lang) {
  const q = QUESTIONS.find((x) => x.field === field);
  const fail = { ok: false, message: `${q.followUp[lang]} ${q.prompt[lang]}` };
  const text = normalise(raw);
  const lower = text.toLowerCase();
  if (!text) return fail;

  if (field === 'age') {
    const m = text.match(/\d+/);
    const age = m ? Number(m[0]) : NaN;
    return age >= 5 && age <= 120 ? { ok: true, value: age } : fail;
  }

  if (field === 'occupation') {
    if (/^[1-7]$/.test(text)) return { ok: true, value: OCCUPATIONS[Number(text) - 1].label };
    const hit = OCCUPATIONS.find((o) => o.keys.some((k) => lower.includes(k.toLowerCase())));
    return hit ? { ok: true, value: hit.label } : fail;
  }

  if (field === 'state') {
    const name = matchState(text);
    return name ? { ok: true, value: name } : fail;
  }

  if (field === 'income_range') {
    const value = parseIncome(text);
    return value ? { ok: true, value } : fail;
  }

  return fail;
}

module.exports = { QUESTIONS, STATES, DONE, nextQuestion, parse, normalise };
