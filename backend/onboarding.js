const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

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

// Number words the speech service may return, in English and Telugu.
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  'సున్నా': 0, 'ఒకటి': 1, 'ఒక్కటి': 1, 'రెండు': 2, 'మూడు': 3, 'నాలుగు': 4, 'ఐదు': 5,
  'ఆరు': 6, 'ఏడు': 7, 'ఎనిమిది': 8, 'తొమ్మిది': 9, 'పది': 10, 'పదకొండు': 11,
  'పన్నెండు': 12, 'పదమూడు': 13, 'పద్నాలుగు': 14, 'పదిహేను': 15, 'పదహారు': 16,
  'పదిహేడు': 17, 'పద్దెనిమిది': 18, 'పందొమ్మిది': 19, 'ఇరవై': 20, 'ఇరవయ్': 20,
  'ఇరవైయ్': 20, 'ముప్పై': 30, 'నలభై': 40, 'యాభై': 50, 'అరవై': 60, 'డెబ్బై': 70,
  'ఎనభై': 80, 'తొంభై': 90,
};

// Store keys in the same Unicode form as the cleaned input, so they always match
const WORDS = new Map(
  Object.entries(NUMBER_WORDS).map(([word, value]) => [word.normalize('NFC'), value])
);

const QUESTIONS = [
  {
    field: 'age',
    prompt: { en: 'What is your age?', te: 'మీ వయస్సు ఎంత?' },
    followUp: {
      en: 'Please type your age in years, for example 20.',
      te: 'దయచేసి మీ వయస్సును సంవత్సరాలలో అంకెలతో టైప్ చేయండి, ఉదాహరణకు 20.',
    },
  },
  {
    field: 'occupation',
    prompt: {
      en: 'What is your occupation? Reply 1 to 7: 1) Student 2) Farmer 3) Daily wage worker 4) Self-employed 5) Salaried employee 6) Not working 7) Other',
      te: 'మీ వృత్తి ఏమిటి? 1 నుండి 7 వరకు సమాధానం ఇవ్వండి: 1) విద్యార్థి 2) రైతు 3) రోజువారీ కూలీ 4) స్వయం ఉపాధి 5) ఉద్యోగి 6) పని లేదు 7) ఇతరం',
    },
    followUp: {
      en: 'Please reply with a number from 1 to 7.',
      te: 'దయచేసి 1 నుండి 7 మధ్య ఒక సంఖ్యతో సమాధానం ఇవ్వండి.',
    },
  },
  {
    field: 'state',
    prompt: {
      en: 'Which state or union territory do you live in? Please type the name in English.',
      te: 'మీరు ఏ రాష్ట్రం లేదా కేంద్రపాలిత ప్రాంతంలో నివసిస్తున్నారు? దయచేసి పేరును ఇంగ్లీష్‌లో టైప్ చేయండి.',
    },
    followUp: {
      en: 'I did not recognise that state. Please type the full name in English, for example Telangana.',
      te: 'ఆ రాష్ట్రాన్ని గుర్తించలేకపోయాను. దయచేసి పూర్తి పేరును ఇంగ్లీష్‌లో టైప్ చేయండి, ఉదాహరణకు Telangana.',
    },
  },
  {
    field: 'income_range',
    prompt: {
      en: 'What is your family’s total annual income? Reply 1 to 6: 1) Up to ₹1 lakh 2) ₹1 to ₹2 lakh 3) ₹2 to ₹2.5 lakh 4) ₹2.5 to ₹3.5 lakh 5) ₹3.5 to ₹4.5 lakh 6) Above ₹4.5 lakh',
      te: 'మీ కుటుంబ మొత్తం వార్షిక ఆదాయం ఎంత? 1 నుండి 6 వరకు సమాధానం ఇవ్వండి: 1) ₹1 లక్ష వరకు 2) ₹1 నుండి ₹2 లక్షలు 3) ₹2 నుండి ₹2.5 లక్షలు 4) ₹2.5 నుండి ₹3.5 లక్షలు 5) ₹3.5 నుండి ₹4.5 లక్షలు 6) ₹4.5 లక్షలకు పైగా',
    },
    followUp: {
      en: 'Please reply with a number from 1 to 6.',
      te: 'దయచేసి 1 నుండి 6 మధ్య ఒక సంఖ్యతో సమాధానం ఇవ్వండి.',
    },
  },
];

const DONE = {
  en: 'Thank you. Your profile is complete. Next we will find schemes that may suit you.',
  te: 'ధన్యవాదాలు. మీ ప్రొఫైల్ పూర్తయింది. తదుపరి మీకు సరిపడే పథకాలను వెతుకుతాము.',
};

// Turn number words into digits, joining tens and units ("twenty one" -> "21")
function wordsToDigits(text) {
  const tokens = text.toLowerCase().replace(/[-.,!?।]/g, ' ').split(/\s+/).filter(Boolean);
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

// Clean the answer: standard Unicode form, no invisible joiners,
// Telugu digits to ASCII digits, then number words to digits.
function normalise(raw) {
  const cleaned = String(raw)
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[౦-౯]/g, (c) => String(c.charCodeAt(0) - 0x0c66));
  return wordsToDigits(cleaned.trim()).trim();
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
    const hit = STATES.find((s) => lower === s.toLowerCase() || lower.includes(s.toLowerCase()));
    return hit ? { ok: true, value: hit } : fail;
  }

  if (field === 'income_range') {
    if (/^[1-6]$/.test(text)) return { ok: true, value: INCOME_OPTIONS[Number(text) - 1].value };
    return fail;
  }

  return fail;
}

module.exports = { QUESTIONS, STATES, DONE, nextQuestion, parse, normalise };
