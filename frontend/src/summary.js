// Short spoken summary built from the engine result, so it always agrees with the cards.
// Telugu sentences are drafts for the native-speaker review.
const SHORT = {
  'pms-sc': 'Post Matric Scholarship for SC students',
  'pms-obc': 'Post Matric Scholarship for OBC students',
  'pm-usp-csss': 'PM USP college scholarship',
  nmmss: 'NMMSS merit scholarship',
  'pm-kisan': 'PM KISAN',
  pmfby: 'PMFBY crop insurance',
  'pm-kmy': 'PM Kisan Maan Dhan pension',
  'pm-jay': 'Ayushman Bharat PM JAY',
  'pm-svanidhi': 'PM SVANidhi street vendor loan',
  pmjjby: 'PM Jeevan Jyoti life insurance',
};

function names(list) {
  return list.map((m) => SHORT[m.scheme_id] || m.scheme_name).join(', ');
}

export function summaryText(matches, language) {
  const eligible = matches.filter((m) => m.eligibility_status === 'eligible');
  const more = matches.filter((m) => m.eligibility_status === 'needs_more_information');
  const no = matches.filter((m) => m.eligibility_status === 'not_eligible');
  const parts = [];

  if (language === 'te') {
    if (eligible.length) parts.push(`మీ సమాధానాల ప్రకారం మీరు ${names(eligible)} పథకాలకు అర్హులుగా కనిపిస్తున్నారు.`);
    if (more.length) parts.push(`${names(more)} పథకాలకు మరింత సమాచారం అవసరం.`);
    if (no.length) parts.push(`${names(no)} పథకాలకు మీరు అర్హులు కాదు.`);
    parts.push('ఈ ఫలితాలు సూచనాత్మకం మాత్రమే. దరఖాస్తు చేసే ముందు అధికారిక పోర్టల్‌లో నిర్ధారించుకోండి.');
    return parts.join(' ');
  }

  if (eligible.length) parts.push(`Based on your answers, you appear eligible for ${names(eligible)}.`);
  else parts.push('No scheme is fully confirmed as eligible yet.');
  if (more.length) parts.push(`More information is needed for ${names(more)}.`);
  if (no.length) parts.push(`You are not eligible for ${names(no)}.`);
  parts.push('These results are indicative. Please confirm on the official portal before you apply.');
  return parts.join(' ');
}
