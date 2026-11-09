# JanSeva AI — Technical Interview Preparation & Defense Kit
### The Great Indian AI Internship Challenge • Gnani AI

> **Target**: Ace the 1-on-1 Technical Interview for the Paid 6-Month AI Internship (up to ₹1 Lakh/month stipend) & Project Awards.

---

## 1. Core Project & Motivation

### Q1: What is JanSeva AI and what exact problem does it solve?
**Answer**:
"JanSeva AI is a sovereign, voice-first welfare assistant engineered for 800+ million Indian citizens who are entitled to government benefits but miss out due to language barriers, complex bureaucratic terminology, and digital illiteracy. 

Instead of building a generic search bot that hallucinates policies, JanSeva AI couples **Gnani AI's sovereign speech and language stack** (Prisma v3.0, Timbre v3.0, and Evon v3.3) with a **100% deterministic eligibility engine** verified against official Ministry Gazette guidelines. It supports code-mixed Telugu-English voice conversations, verifies eligibility across three distinct states (*Eligible*, *Needs more information*, *Not eligible*), provides interactive document checklists, and explains the legal 'why' through Gnani Evon v3.3."

### Q2: Why did you pick Agriculture and Student welfare schemes rather than a generic chatbot?
**Answer**:
"Civic welfare has the highest real-world social impact in India. A farmer losing PM-KISAN or PMFBY because of a missed land cut-off date (1 Feb 2019) or an SC college student missing PMS-SC because they didn't know about the ₹2.5 lakh income threshold can change family livelihoods. 

Furthermore, from an AI engineering standpoint, welfare rules have rigorous constraints, mathematical boundary conditions, and regional code-mixing, making it the perfect benchmark for Gnani's Indic models."

---

## 2. Gnani AI Stack & Technical Integrations

### Q3: Exactly how did you integrate Gnani Prisma v3.0? What challenges did you face with audio?
**Answer**:
"We integrated **Prisma v3.0** via the REST endpoint `https://api.vachana.ai/stt/v3` with `format=codemix` and `language_code=te-IN,en-IN`.

**The Engineering Challenge**:
Browsers record audio in heterogeneous containers (WebM with Opus on Chrome/Android, MP4 with AAC on Safari/iOS). Feeding non-standard codecs directly to speech models causes latency spikes or decoding errors.

**Our Solution**:
We built an audio ingestion pipeline using `ffmpeg` on the Node.js backend (`toWav()`) that normalizes all browser audio into standardized **16 kHz mono linear PCM WAV** before transmission to Prisma. 
Our latency benchmarks showed ~500ms end-to-end response for 5-10 second code-mixed Telugu clips, flawlessly preserving English terms like *'scholarship'*, *'income'*, and *'regular degree'* inside the Telugu script."

### Q4: How is Gnani Timbre v3.0 integrated, and how do you handle Indic speech prosody?
**Answer**:
"We integrated **Timbre v3.0** (`https://api.vachana.ai/api/v1/tts/inference`) using the **Lakshmi** voice at 24 kHz linear PCM.

**Indic Numeral & Currency Normalization**:
TTS models often struggle with Indian numbering conventions (saying 'twenty-five thousand' instead of 'two point five lakh' or misreading '₹'). We wrote a dedicated pre-synthesis phonetic normalizer (`speechText` in `backend/tts.js`):
1. Converts currency symbols (`₹2.5 lakh` -> `2.5 lakh rupees` / `2.5 లక్షల రూపాయలు`).
2. Converts numbered list markers (`1)` -> `1.`) to prevent abrupt prosody pauses.
3. Implemented a promise queue to respect Gnani's single active synthesis concurrency limit."

### Q5: How do you use Gnani Evon v3.3? Why not let an LLM decide eligibility directly?
**Answer**:
"**Allowing a pure LLM to determine statutory eligibility is irresponsible and dangerous in public governance.** LLMs suffer from probabilistic hallucinations, outdated training cutoffs, and inability to enforce strict mathematical inequalities (e.g., verifying if income is strictly $\le ₹2,50,000$).

In JanSeva AI:
1. **The Policy Guardrail is Deterministic**: `eligibility.js` parses the verified JSON schema (extracted clause-by-clause from official Gazette notifications) and mathematically evaluates rules.
2. **Evon v3.3 is the Sovereign Reasoning & Counselor**: Evon v3.3 takes the deterministic facts (`rules_met`, `rules_unmet`, `benefits`) and generates culturally respectful, compassionate explanations in natural Telugu or English.
3. Evon also acts as our **Document Procurement Advisor**, guiding citizens on exactly where and how to obtain documents at MeeSeva, Grama Sachivalayams, and Tahsildar offices."

---

## 3. Algorithm & Natural Language Normalization

### Q6: How do you handle Telugu number words and phonetic spelling variations in voice input?
**Answer**:
"In `backend/onboarding.js`, we built a two-stage Indic entity normalizer:
1. **Unicode NFC Normalization**: Strips zero-width joiners (`\u200B-\u200D\uFEFF`) and maps Telugu numerals (`౦-౯`) to ASCII digits (`0-9`).
2. **Telugu & English Word-to-Digit Parser**: Maps number words in Telugu (*'ఇరవై'* -> 20, *'ముప్పై ఐదు'* -> 35, *'రెండు పాయింట్ ఐదు లక్షలు'* -> 2.5 lakh) and English (*'twenty'*, *'forty'*) into clean numerical bands.
3. **Fuzzy State Matching**: We implemented a Levenshtein distance matcher combined with phonetic aliases (`STATE_ALIASES`) so regional variations like *'తెలంగాణా'* vs *'తెలంగాణ'* match correctly with zero false rejections."

### Q7: Explain the 'Needs More Information' state. Why is a ternary state engine superior to binary eligible/ineligible?
**Answer**:
"A binary (yes/no) system in civic tech creates extreme disenfranchisement. If an applicant has not yet taken their Class VIII examination or doesn't know their exact land survey date, calling them 'Ineligible' discourages them from applying. Calling them 'Eligible' leads to application rejection at the government portal.

JanSeva AI implements a **3-State Verification System**:
- **Eligible**: All statutory criteria are positively satisfied.
- **Needs More Information**: Core criteria pass, but non-fatal conditions (e.g., institution AISHE code, specific mark cutoffs) require citizen confirmation.
- **Not Eligible**: An explicit statutory exclusion is violated (e.g., family pays income tax for PM-KISAN, or income exceeds ₹2.5L for PMS-SC). Every unmet rule cites the exact Gazette paragraph."

---

## 4. Integrity, Plagiarism & DPDP Compliance

### Q8: How did you ensure compliance with the contest rule: 'does not allow plagiarism or unauthorized AI content'?
**Answer**:
"1. **Original Ground-Up Engineering**: JanSeva AI is built from scratch with custom deterministic evaluation algorithms, audio pipeline transcoders, and bespoke UI.
2. **Deterministic Gazette Foundation**: Every scheme JSON in `data/schemes/` was manually cross-checked against official Government of India guideline PDFs (PMS-SC Para 5.2/5.3, PM-KISAN SOP Clause 3, PMFBY Operational Guidelines).
3. **Automated Unit Testing Suite**: We built an automated test harness (`npm test`) with 100% pass rates across entity normalization, boundary income conditions, and Evon counseling.
4. **DPDP Compliance & Synthetic Privacy**: Under the Digital Personal Data Protection Act (2023) and Gnani guidelines, our codebase contains zero real citizen PII (no real Aadhaar, phone numbers, or bank accounts). We built realistic synthetic test personas for ethical demonstration."

---

## 5. Vision & Scaling

### Q9: If Gnani AI selects you for the 6-month internship, how would you scale JanSeva AI?
**Answer**:
"Inside Gnani AI, I would:
1. **Scale to all 22 Scheduled Indian Languages**: Leverage Gnani's streaming WebSocket STT and multilingual TTS models.
2. **Direct Integration with India Stack**: Integrate DigiLocker API for instant, consent-based document verification, eliminating manual checklist verification.
3. **Real-time Telephony IVR**: Deploy JanSeva AI as an automated toll-free voice hotline on Gnani's Artha telephonic voice platform, allowing citizens without smartphones to call in from basic feature phones."
