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

const INCOME_VALUES = {
  '1': 'up_to_2_5_lakh',
  '2': '2_5_to_3_5_lakh',
  '3': '3_5_to_4_5_lakh',
  '4': 'above_4_5_lakh',
};

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
      en: 'What is your family’s total annual income? Reply 1 to 4: 1) Up to ₹2.5 lakh 2) ₹2.5 to ₹3.5 lakh 3) ₹3.5 to ₹4.5 lakh 4) Above ₹4.5 lakh',
      te: 'మీ కుటుంబ మొత్తం వార్షిక ఆదాయం ఎంత? 1 నుండి 4 వరకు సమాధానం ఇవ్వండి: 1) ₹2.5 లక్షల వరకు 2) ₹2.5 నుండి ₹3.5 లక్షలు 3) ₹3.5 నుండి ₹4.5 లక్షలు 4) ₹4.5 లక్షలకు పైగా',
    },
    followUp: {
      en: 'Please reply with a number from 1 to 4.',
      te: 'దయచేసి 1 నుండి 4 మధ్య ఒక సంఖ్యతో సమాధానం ఇవ్వండి.',
    },
  },
];

const DONE = {
  en: 'Thank you. Your profile is complete. Next we will find schemes that may suit you.',
  te: 'ధన్యవాదాలు. మీ ప్రొఫైల్ పూర్తయింది. తదుపరి మీకు సరిపడే పథకాలను వెతుకుతాము.',
};

function normalise(raw) {
  // Convert Telugu digits (౦-౯) to ASCII digits
  return String(raw).replace(/[౦-౯]/g, (c) => String(c.charCodeAt(0) - 0x0c66)).trim();
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
    return INCOME_VALUES[text] ? { ok: true, value: INCOME_VALUES[text] } : fail;
  }

  return fail;
}

module.exports = { QUESTIONS, STATES, DONE, nextQuestion, parse };
