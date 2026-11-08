const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// Telugu state names (draft; a Telugu reviewer should confirm)
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

const STATE_ALIASES = {
  'Telangana': ['తెలంగాణా'],
  'Andhra Pradesh': ['ఆంధ్ర ప్రదేశ్'],
};

const OCCUPATIONS = [
  { value: 'School student', en: 'School student', te: 'పాఠశాల విద్యార్థి',
    keys: ['school', 'class 9', 'class 10', 'class 11', 'class 12', 'high school', 'పాఠశాల'] },
  { value: 'College student', en: 'College student', te: 'కళాశాల విద్యార్థి',
    keys: ['college', 'university', 'degree', 'btech', 'engineering', 'కళాశాల', 'కాలేజీ', 'యూనివర్సిటీ', 'డిగ్రీ'] },
  { value: 'Farmer', en: 'Farmer', te: 'రైతు',
    keys: ['farmer', 'farming', 'agriculture', 'రైతు', 'వ్యవసాయ'] },
  { value: 'Daily wage worker', en: 'Daily wage worker', te: 'రోజువారీ కూలీ',
    keys: ['daily wage', 'labour', 'labor', 'coolie', 'కూలీ', 'కూలి'] },
  { value: 'Self-employed', en: 'Self-employed', te: 'స్వయం ఉపాధి',
    keys: ['self-employed', 'self employed', 'business', 'shop', 'స్వయం', 'వ్యాపారం'] },
  { value: 'Not working', en: 'Not working', te: 'పని లేదు',
    keys: ['not working', 'unemployed', 'no job', 'పని లేదు', 'పనిలేదు'] },
  { value: 'Salaried employee', en: 'Salaried employee', te: 'ఉద్యోగి',
    keys: ['salaried', 'employee', 'job', 'ఉద్యోగ'] },
  { value: 'Other', en: 'Other', te: 'ఇతరం', keys: ['other', 'ఇతర'] },
];

const INCOME_OPTIONS = [
  { value: 'up_to_1_lakh', en: 'Up to ₹1 lakh', te: '₹1 లక్ష వరకు' },
  { value: '1_to_2_lakh', en: '₹1 to ₹2 lakh', te: '₹1 నుండి ₹2 లక్షలు' },
  { value: '2_to_2_5_lakh', en: '₹2 to ₹2.5 lakh', te: '₹2 నుండి ₹2.5 లక్షలు' },
  { value: '2_5_to_3_5_lakh', en: '₹2.5 to ₹3.5 lakh', te: '₹2.5 నుండి ₹3.5 లక్షలు' },
  { value: '3_5_to_4_5_lakh', en: '₹3.5 to ₹4.5 lakh', te: '₹3.5 నుండి ₹4.5 లక్షలు' },
  { value: 'above_4_5_lakh', en: 'Above ₹4.5 lakh', te: '₹4.5 లక్షలకు పైగా' },
];

// "Not sure" is stored as null, which the engine treats as unknown
const CATEGORY_OPTIONS = [
  { value: 'SC', en: 'SC', te: 'ఎస్సీ', keys: ['sc', 'scheduled caste', 'ఎస్సీ'] },
  { value: 'ST', en: 'ST', te: 'ఎస్టీ', keys: ['st', 'scheduled tribe', 'ఎస్టీ'] },
  { value: 'EBC', en: 'EBC', te: 'ఈబీసీ', keys: ['ebc', 'economically backward', 'ఈబీసీ'] },
  { value: 'BC', en: 'BC', te: 'బీసీ', keys: ['bc', 'backward class', 'బీసీ'] },
  { value: 'Minority', en: 'Minority', te: 'మైనారిటీ', keys: ['minority', 'minorities', 'మైనారిటీ'] },
  { value: 'General', en: 'General (open)', te: 'జనరల్', keys: ['general', 'open category', 'జనరల్', 'ఓసీ'] },
  { value: null, en: 'Not sure', te: 'తెలియదు', keys: ['not sure', "don't know", 'dont know', 'తెలియదు', 'తెలీదు'] },
];

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

const WORDS = new Map(
  Object.entries(NUMBER_WORDS).map(([word, value]) => [word.normalize('NFC'), value])
);

const isSchool = (p) => p.occupation === 'School student';
const isCollege = (p) => p.occupation === 'College student';

const QUESTIONS = [
  {
    field: 'age', type: 'number',
    base: { en: 'What is your age?', te: 'మీ వయస్సు ఎంత?' },
    followUp: {
      en: 'Please say or type your age in years, for example 20.',
      te: 'దయచేసి మీ వయస్సును సంవత్సరాలలో చెప్పండి లేదా టైప్ చేయండి, ఉదాహరణకు 20.',
    },
  },
  {
    field: 'occupation', type: 'choice', options: OCCUPATIONS,
    base: { en: 'What is your occupation?', te: 'మీ వృత్తి ఏమిటి?' },
    followUp: {
      en: 'Please reply with a number from the list, or say your occupation.',
      te: 'దయచేసి జాబితా నుండి ఒక సంఖ్యతో సమాధానం ఇవ్వండి, లేదా మీ వృత్తి చెప్పండి.',
    },
  },
  {
    field: 'state', type: 'state',
    base: {
      en: 'Which state or union territory do you live in? Say or type the name in English or Telugu.',
      te: 'మీరు ఏ రాష్ట్రం లేదా కేంద్రపాలిత ప్రాంతంలో నివసిస్తున్నారు? రాష్ట్రం పేరు తెలుగులో లేదా ఇంగ్లీష్‌లో చెప్పండి లేదా టైప్ చేయండి.',
    },
    followUp: {
      en: 'I did not recognise that state. Please say or type the full name in English or Telugu.',
      te: 'ఆ రాష్ట్రాన్ని గుర్తించలేకపోయాను. దయచేసి రాష్ట్రం పూర్తి పేరును తెలుగులో లేదా ఇంగ్లీష్‌లో చెప్పండి.',
    },
  },
  {
    field: 'income_range', type: 'income', options: INCOME_OPTIONS,
    base: {
      en: 'What is your family’s total annual income? Say the amount in lakh, or reply with a number.',
      te: 'మీ కుటుంబ మొత్తం వార్షిక ఆదాయం ఎంత? లక్షలలో చెప్పండి, లేదా సంఖ్యతో సమాధానం ఇవ్వండి.',
    },
    followUp: {
      en: 'Please say the amount in lakh, for example 2.5 lakh, or reply with a number from the list.',
      te: 'దయచేసి ఆదాయాన్ని లక్షలలో చెప్పండి, ఉదాహరణకు 2.5 లక్షలు, లేదా జాబితా నుండి సంఖ్యతో సమాధానం ఇవ్వండి.',
    },
  },
  {
    field: 'category', type: 'choice', options: CATEGORY_OPTIONS,
    base: { en: 'Which category do you belong to?', te: 'మీరు ఏ వర్గానికి చెందుతారు?' },
  },
  {
    field: 'is_indian_national', type: 'yesno',
    base: { en: 'Are you a citizen of India?', te: 'మీరు భారత పౌరులా?' },
  },
  {
    field: 'has_aadhaar', type: 'yesno',
    base: {
      en: 'Do you have an Aadhaar card or Aadhaar enrolment number?',
      te: 'మీ దగ్గర ఆధార్ కార్డు లేదా ఆధార్ నమోదు సంఖ్య ఉందా?',
    },
  },
  {
    field: 'has_bank_account', type: 'yesno',
    base: { en: 'Do you have a bank account in your own name?', te: 'మీ పేరు మీద బ్యాంక్ ఖాతా ఉందా?' },
  },
  {
    field: 'owns_land', type: 'yesno',
    base: { en: 'Do you own cultivable land in your own name?', te: 'మీ పేరు మీద సాగు భూమి ఉందా?' },
  },
  {
    field: 'land_before_2019', type: 'yesno', when: (p) => p.owns_land === true,
    base: {
      en: 'Did you own this land before 1 February 2019?',
      te: 'ఈ భూమి 2019 ఫిబ్రవరి 1కి ముందు నుండి మీ పేరు మీద ఉందా?',
    },
  },
  {
    field: 'paid_income_tax', type: 'yesno',
    base: {
      en: 'Did you or anyone in your family pay income tax last year?',
      te: 'గత సంవత్సరం మీరు లేదా మీ కుటుంబంలో ఎవరైనా ఆదాయపు పన్ను చెల్లించారా?',
    },
  },
  {
    field: 'family_excluded_group', type: 'yesno',
    base: {
      en: 'Does anyone in your family work for the government or a public sector company, hold or have held an elected or constitutional post, or work as a registered doctor, engineer, lawyer, chartered accountant or architect?',
      te: 'మీ కుటుంబంలో ఎవరైనా ప్రభుత్వ లేదా ప్రభుత్వ రంగ సంస్థలో పనిచేస్తున్నారా, ఎన్నికైన లేదా రాజ్యాంగ పదవిలో ఉన్నారా, లేదా నమోదైన వైద్యులు, ఇంజనీర్లు, న్యాయవాదులు, సీఏ లేదా ఆర్కిటెక్ట్ ఎవరైనా ఉన్నారా?',
    },
  },
  {
    field: 'receives_pension', type: 'yesno',
    base: {
      en: 'Does anyone in your family receive a monthly pension?',
      te: 'మీ కుటుంబంలో ఎవరికైనా నెలవారీ పెన్షన్ వస్తుందా?',
    },
  },
  {
    field: 'school_govt', type: 'yesno', when: isSchool,
    base: {
      en: 'Are you studying in a government, government-aided or local body school?',
      te: 'మీరు ప్రభుత్వ, ప్రభుత్వ సహాయ లేదా స్థానిక సంస్థ పాఠశాలలో చదువుతున్నారా?',
    },
  },
  {
    field: 'course_recognised', type: 'yesno', when: isCollege,
    base: {
      en: 'Are you studying in a recognised college or university?',
      te: 'మీరు గుర్తింపు పొందిన కళాశాల లేదా విశ్వవిద్యాలయంలో చదువుతున్నారా?',
    },
  },
  {
    field: 'regular_course', type: 'yesno', when: isCollege,
    base: {
      en: 'Is it a regular full-time degree course, not distance or correspondence?',
      te: 'ఇది రెగ్యులర్ పూర్తికాల డిగ్రీ కోర్సా, దూరవిద్య లేదా కరస్పాండెన్స్ కాదా?',
    },
  },
  {
    field: 'has_other_scholarship', type: 'yesno', when: (p) => isCollege(p) || isSchool(p),
    base: {
      en: 'Are you getting any other scholarship or fee reimbursement now?',
      te: 'ప్రస్తుతం మీకు వేరే స్కాలర్‌షిప్ లేదా ఫీజు రీయింబర్స్‌మెంట్ వస్తుందా?',
    },
  },
];

const GENERIC_FOLLOW_UP = {
  choice: {
    en: 'Please reply with a number from the list, or say your answer.',
    te: 'దయచేసి జాబితా నుండి ఒక సంఖ్యతో సమాధానం ఇవ్వండి, లేదా మీ సమాధానం చెప్పండి.',
  },
  yesno: {
    en: 'Please reply yes, no or not sure.',
    te: 'దయచేసి అవును, లేదు లేదా తెలియదు అని చెప్పండి.',
  },
};

const YESNO_HINT = {
  en: ' Reply yes, no or not sure.',
  te: ' అవును, లేదు, లేదా తెలియదు అని చెప్పండి.',
};

for (const q of QUESTIONS) {
  if (!q.followUp) q.followUp = GENERIC_FOLLOW_UP[q.type];
  q.prompt = {};
  for (const lang of ['en', 'te']) {
    let text = q.base[lang];
    if (q.options) text += ' ' + q.options.map((o, i) => `${i + 1}) ${o[lang]}`).join(' ');
    if (q.type === 'yesno') text += YESNO_HINT[lang];
    q.prompt[lang] = text;
  }
}

const DONE = {
  en: 'Thank you. Your profile is complete. Next we will find schemes that may suit you.',
  te: 'ధన్యవాదాలు. మీ ప్రొఫైల్ పూర్తయింది. తదుపరి మీకు సరిపడే పథకాలను వెతుకుతాము.',
};

function clean(raw) {
  return String(raw).normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');
}

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

function normalise(raw) {
  let t = clean(raw)
    .replace(/[౦-౯]/g, (c) => String(c.charCodeAt(0) - 0x0c66))
    .replace(/(\d),(?=\d)/g, '$1')
    .replace(/(?<!\d)\.|\.(?!\d)/g, ' ')
    .replace(/[!?।,\-]/g, ' ')
    .replace(/లక్షలకు|లక్షలు|లక్షల|లక్షకు|లక్ష/g, ' lakh ')
    .replace(/\s+/g, ' ')
    .trim();
  t = wordsToDigits(t);
  t = t.replace(/(\d+)\s*(?:point|పాయింట్)\s*(\d+)/gi, '$1.$2');
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

function parseIncome(text) {
  const t = text.toLowerCase();
  if (/^[1-6]$/.test(t)) return INCOME_OPTIONS[Number(t) - 1].value;
  const m = t.match(/\d+(\.\d+)?/);
  if (!m) return null;
  const hasLakh = /lakh/.test(t);
  let amount = Number(m[0]);
  if (!hasLakh) {
    if (amount >= 1000) amount = amount / 100000;
    else if (amount > 100) return null;
  }
  if (amount <= 0 || amount > 50) return null;
  const above = /above|over|more than|పైగా|పైన|ఎక్కువ/.test(t);
  if (above) return amount >= 4.5 ? 'above_4_5_lakh' : null;
  return bandFor(amount);
}

// "Not sure" is checked first, so "don't know" is not read as "no"
const NOT_SURE = /not sure|don.?t know|no idea|maybe|తెలియ|తెలీ/i;
const NO = /\b(no|nope|not)\b|కాదు|లేదు|లేరు|వద్దు/i;
const YES = /\b(yes|yeah|yep|haan)\b|అవును|ఔను|ఉంది|ఉన్నాయి|ఉన్నాను|ఉన్నారు|ఉంటుంది/i;

function parseYesNo(text) {
  if (NOT_SURE.test(text)) return { ok: true, value: null };
  if (NO.test(text)) return { ok: true, value: false };
  if (YES.test(text)) return { ok: true, value: true };
  return { ok: false };
}

// Short keys (3 letters or fewer) must match a whole word, so "sc" does not match "scheduled"
function matchChoice(options, text) {
  const lower = text.toLowerCase();
  const tokens = lower.split(/[\s,.;:!?।]+/).filter(Boolean);
  for (const o of options) {
    for (const k of o.keys || []) {
      const key = k.toLowerCase();
      const hit = key.length <= 3 ? tokens.includes(key) : lower.includes(key);
      if (hit) return o;
    }
  }
  return null;
}

function nextQuestion(profile) {
  return QUESTIONS.find((q) => profile[q.field] === undefined && (!q.when || q.when(profile))) || null;
}

function parse(field, raw, lang) {
  const q = QUESTIONS.find((x) => x.field === field);
  const fail = { ok: false, message: `${q.followUp[lang]} ${q.prompt[lang]}` };
  const text = normalise(raw);
  if (!text) return fail;

  if (q.type === 'number') {
    const m = text.match(/\d+/);
    const age = m ? Number(m[0]) : NaN;
    return age >= 5 && age <= 120 ? { ok: true, value: age } : fail;
  }

  if (q.type === 'choice') {
    if (/^\d+$/.test(text)) {
      const n = Number(text);
      return n >= 1 && n <= q.options.length ? { ok: true, value: q.options[n - 1].value } : fail;
    }
    const hit = matchChoice(q.options, text);
    return hit ? { ok: true, value: hit.value } : fail;
  }

  if (q.type === 'state') {
    const name = matchState(text);
    return name ? { ok: true, value: name } : fail;
  }

  if (q.type === 'income') {
    const value = parseIncome(text);
    return value ? { ok: true, value } : fail;
  }

  if (q.type === 'yesno') {
    const r = parseYesNo(text);
    return r.ok ? r : fail;
  }

  return fail;
}

module.exports = { QUESTIONS, STATES, DONE, nextQuestion, parse, normalise };
