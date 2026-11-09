// Gnani Evon v3.3 Sovereign Reasoning Integration
// Evon v3.3 is Gnani AI's 30B MoE Indian-language reasoning foundation model.
// In JanSeva AI, Evon acts as the Sovereign Scheme Counselor:
// 1. Explaining eligibility in plain, compassionate Telugu/English without legal jargon.
// 2. Guiding citizens on document procurement (MeeSeva, CSC, Tahsildar, UIDAI).
// 3. Grounding all responses strictly in official Gazette guidelines to eliminate hallucinations.

const DOCUMENT_PROCUREMENT_GUIDE = {
  'Caste Certificate': {
    en: 'Apply at your nearest MeeSeva or Grama Sachivalayam with parent caste certificate, school leaving certificate, and Aadhaar.',
    te: 'మీ సమీప మీసేవ లేదా గ్రామ సచివాలయంలో తల్లిదండ్రుల కుల ధృవీకరణ పత్రం, స్కూల్ లీవింగ్ సర్టిఫికేట్ మరియు ఆధార్‌తో దరఖాస్తు చేసుకోండి.',
    portal: 'https://meeseva.telangana.gov.in',
    processing_time: '15-30 days',
  },
  'Income Certificate': {
    en: 'Obtain from the Tahsildar office or MeeSeva by submitting ration card, salary slip / self-declaration, and land/rental details.',
    te: 'రేషన్ కార్డు, ఆదాయ ధృవీకరణ / స్వీయ ప్రకటన మరియు అద్దె లేదా భూమి వివరాలతో తహశీల్దార్ కార్యాలయం లేదా మీసేవ కేంద్రంలో పొందండి.',
    portal: 'https://meeseva.telangana.gov.in',
    processing_time: '7-14 days',
  },
  'Pattadar Passbook / Land Record (RoR-1B)': {
    en: 'Download digitised RoR-1B passbook copy from Dharani (Telangana) or MeeBhoomi (AP), or visit your Mandal Revenue Office (MRO).',
    te: 'ధరణి (తెలంగాణ) లేదా మీభూమి (ఆంధ్రప్రదేశ్) పోర్టల్ నుండి లేదా మీ మండల రెవెన్యూ కార్యాలయం (MRO) నుండి పట్టాదారు పాస్‌బుక్ కాపీ పొందండి.',
    portal: 'https://dharani.telangana.gov.in',
    processing_time: 'Instant online / 7 days offline',
  },
  'Aadhaar-Bank Account NPCI Seeding': {
    en: 'Visit your bank branch with Aadhaar card to fill the NPCI Direct Benefit Transfer (DBT) mandate form, or check status on myaadhaar.uidai.gov.in.',
    te: 'బ్యాంక్ బ్రాంచ్‌ను సందర్శించి ఆధార్ డీబీటీ (DBT/NPCI) లింకింగ్ ఫారమ్ సమర్పించండి లేదా myaadhaar.uidai.gov.in లో స్థితిని సరిచూసుకోండి.',
    portal: 'https://myaadhaar.uidai.gov.in',
    processing_time: '2-4 banking days',
  },
  'Bonafide / Admission Receipt': {
    en: 'Collect from your college or school administration office confirming current academic year enrollment and AISHE/UDISE code.',
    te: 'ప్రస్తుత విద్యా సంవత్సరం ప్రవేశం మరియు AISHE/UDISE కోడ్ ధృవీకరిస్తూ మీ కళాశాల లేదా పాఠశాల కార్యాలయం నుండి పొందండి.',
    portal: 'https://scholarships.gov.in',
    processing_time: '1-2 days',
  },
};

function getProcurementAdvice(docName, lang = 'en') {
  for (const [key, info] of Object.entries(DOCUMENT_PROCUREMENT_GUIDE)) {
    if (docName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(docName.toLowerCase())) {
      return {
        matched_document: key,
        instructions: info[lang] || info.en,
        portal: info.portal,
        processing_time: info.processing_time,
      };
    }
  }
  return {
    matched_document: docName,
    instructions: lang === 'te'
      ? 'ఈ పత్రాన్ని మీ సమీప మీసేవ లేదా సంబంధిత ప్రభుత్వ కార్యాలయంలో పొందవచ్చు.'
      : 'This document can be procured from your nearest MeeSeva or competent government authority.',
    portal: 'https://www.india.gov.in',
    processing_time: '7-15 days',
  };
}

// Fallback reasoning synthesizer (simulates Evon v3.3 with exact grounding)
function synthesizeCounseling(profile, match, lang = 'en') {
  const schemeName = match.scheme_name;
  const isTe = lang === 'te';

  if (match.eligibility_status === 'eligible') {
    if (isTe) {
      return (
        `మీ ప్రొఫైల్ ప్రకారం మీరు "${schemeName}" పథకానికి సంపూర్ణంగా అర్హులు. ` +
        `మీ వార్షిక ఆదాయం మరియు విద్య/భూమి వివరాలు ప్రభుత్వ నిబంధనలకు అనుగుణంగా ఉన్నాయి. ` +
        `తదుపరి దశగా అవసరమైన పత్రాలను సిద్ధం చేసుకుని అధికారిక పోర్టల్ (${match.official_portal}) ద్వారా దరఖాస్తు చేసుకోండి. ` +
        `బ్యాంక్ ఖాతాకు ఆధార్ NPCI సీడింగ్ పూర్తయిందని నిర్ధారించుకోండి.`
      );
    }
    return (
      `Based on your verified profile, you are eligible and meet all primary criteria for "${schemeName}". ` +
      `Your declared annual income and academic/land parameters fully align with the official guidelines. ` +
      `To proceed, gather the checklist documents and submit your application through the official portal at ${match.official_portal}. ` +
      `Ensure your bank account is active and seeded with Aadhaar on the NPCI mapper for Direct Benefit Transfer.`
    );
  }

  if (match.eligibility_status === 'needs_more_information') {
    const missingKeys = match.missing.map((m) => m.description).join(', ');
    if (isTe) {
      return (
        `"${schemeName}" పథకానికి మీ అర్హతను పూర్తిగా ఖరారు చేయడానికి మరింత సమాచారం అవసరం: ${missingKeys || 'కొన్ని వివరాలు'}. ` +
        `ఈ వివరాలను ఒకసారి నిర్ధారించుకుని సంబంధిత పత్రాలు మీ వద్ద ఉన్నాయో లేదో సరిచూసుకోండి.`
      );
    }
    return (
      `For "${schemeName}", additional verification is required before full eligibility can be confirmed. ` +
      `Key aspects still pending: ${missingKeys || 'specific parameters'}. ` +
      `Please review the guideline checklist or contact your local administrative office to verify these prerequisites.`
    );
  }

  // not_eligible
  const unmetKeys = match.unmet.map((u) => u.description).join('; ');
  if (isTe) {
    return (
      `మీరు అందించిన సమాచారం ప్రకారం మీరు "${schemeName}" పథకానికి అర్హులు కాదు. ` +
      `కారణం: ${unmetKeys || 'ప్రభుత్వ మార్గదర్శక నిబంధనలు సరిపోలలేదు'}. ` +
      `మీకు సరిపడే ఇతర పథకాలను పరిశీలించండి.`
    );
  }
  return (
    `According to the current guideline parameters, you are not eligible for "${schemeName}". ` +
    `Reason: ${unmetKeys || 'one or more statutory conditions were not satisfied'}. ` +
    `We recommend reviewing alternative schemes displayed in your results.`
  );
}

// Calls Gnani Evon v3.3 reasoning model via REST API or local grounded synthesizer
async function generateCounseling({ profile, match, query, language = 'en' }) {
  const apiKey = process.env.GNANI_API_KEY;
  const isTe = language === 'te';

  // If live Gnani API key is configured, invoke Gnani's model endpoint
  if (apiKey) {
    try {
      const systemPrompt = isTe
        ? 'మీరు JanSeva AI సార్వభౌమ సహాయకులు (Gnani Evon v3.3 చే ఆధారితం). మీరు భారతీయ పౌరులకు సంక్షేమ పథకాల గురించి స్పష్టమైన, సున్నితమైన మరియు అధికారిక మార్గదర్శకాలకు లోబడిన సమాధానాలు ఇవ్వాలి. ఎట్టి పరిస్థితుల్లోనూ తప్పుడు సమాచారం లేదా రూల్స్ వెలుపల ఊహాగానాలు చేయవద్దు.'
        : 'You are the JanSeva AI Sovereign Welfare Counselor powered by Gnani Evon v3.3. Provide clear, empathetic, and strictly guideline-grounded assistance to Indian citizens regarding welfare schemes. Never hallucinate rules or invent eligibility.';

      const userContent = JSON.stringify({
        task: query ? 'answer_citizen_query' : 'explain_eligibility',
        scheme_id: match.scheme_id,
        scheme_name: match.scheme_name,
        target_group: match.target_group,
        eligibility_status: match.eligibility_status,
        rules_met: match.met,
        rules_unmet: match.unmet,
        rules_missing: match.missing,
        benefits: match.benefits,
        user_profile: profile,
        citizen_query: query || null,
        language: isTe ? 'Telugu' : 'English',
      });

      const response = await fetch('https://api.vachana.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key-ID': apiKey,
        },
        body: JSON.stringify({
          model: 'gnani-evon-v3.3',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          temperature: 0.2, // Low temperature for high precision and zero hallucination
          max_tokens: 400,
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) {
          return { ok: true, source: 'gnani-evon-v3.3', text };
        }
      }
    } catch (err) {
      console.warn('Gnani Evon API request timed out or returned error, falling back to sovereign grounded engine:', err.message);
    }
  }

  // Deterministic Sovereign Grounded Synthesizer
  const text = synthesizeCounseling(profile, match, language);
  return { ok: true, source: 'sovereign-grounded-engine', text };
}

module.exports = {
  generateCounseling,
  getProcurementAdvice,
  DOCUMENT_PROCUREMENT_GUIDE,
};
