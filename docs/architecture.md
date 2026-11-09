# JanSeva AI — System Architecture & Sovereign Indic AI Design

JanSeva AI is an institutional-grade, voice-first welfare assistance platform built on Gnani AI's sovereign speech and language foundation models.

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 19 + Vite)"]
        UI["Bilingual Interface (Telugu / English)"]
        AudioRec["Browser MediaRecorder (WAV/WebM)"]
        AudioPlay["Audio Playback (HTML5 Audio)"]
        PresetBar["DPDP Synthetic Demo Personas"]
        Checklist["Interactive Document Checklist"]
    end

    subgraph Gateway ["JanSeva Backend (Node.js + Express)"]
        API["REST API Layer"]
        AudioConv["FFmpeg (16kHz Mono WAV Transcoder)"]
        Normalizer["Indic Number & Entity Normalizer"]
        SessionStore[("SQLite (Session & Scheme Cache)")]
    end

    subgraph SovereignAI ["Gnani AI Sovereign Stack"]
        Prisma["Gnani Prisma v3.0 (STT)\n• Multilingual & Indic Code-Mixing\n• 14M+ hrs telephonic audio training"]
        Timbre["Gnani Timbre v3.0 (TTS)\n• Voice: Lakshmi\n• Lakh/Crore Cadence & Indic Prosody"]
        Evon["Gnani Evon v3.3 (Reasoning)\n• 30B MoE Indian Language Model\n• Grounded Scheme Counselor"]
    end

    subgraph DeterministicCore ["Deterministic Policy Guardrail"]
        RuleEngine["Gazette Eligibility Engine\n• Zero Hallucination Guarantee\n• 3 States: Eligible / Needs Info / Not Eligible"]
        SchemeDB[("Official Gazette Scheme Records (JSON)\nPMS-SC, PM-USP, NMMSS, PM-KISAN, PMFBY")]
        DocProcure["Document Procurement Directory\n(MeeSeva, Sachivalayam, CSC, UIDAI)"]
    end

    %% Client to Gateway
    AudioRec -->|Audio Buffer (Max 5MB)| AudioConv
    AudioConv -->|16kHz Mono WAV| API
    UI -->|Session Actions & Queries| API

    %% Gateway to Gnani AI
    API -->|X-API-Key-ID / Form-Data| Prisma
    Prisma -->|Code-mixed Indic Transcript| Normalizer
    Normalizer -->|Structured Profile Fields| SessionStore

    %% Deterministic Verification
    SessionStore --> RuleEngine
    SchemeDB --> RuleEngine
    RuleEngine -->|Deterministic Results| API

    %% Evon Reasoning & Timbre Speech
    RuleEngine -->|Grounded Facts & Clauses| Evon
    API -->|Prompt with Grounded Context| Evon
    Evon -->|Empathetic Citizen Advice| API
    API -->|Speech Synthesis Text| Timbre
    Timbre -->|24kHz Linear PCM WAV| AudioPlay
    DocProcure --> Checklist
```

---

## Architectural Principles

### 1. The Sovereign Hybrid Architecture (Deterministic Guardrail + Generative Warmth)
- **The Core Problem in Civic AI**: General LLMs hallucinate eligibility criteria, cite outdated cutoff dates, and mislead citizens on government benefits.
- **JanSeva's Solution**:
  1. **Eligibility is 100% Deterministic**: All qualification rules are parsed directly from official Ministry Gazette Guidelines and evaluated via deterministic boolean/relational operators (`lte`, `gte`, `equals`, `in`). The AI never guesses eligibility.
  2. **Perception is Sovereign**: Speech recognition is handled exclusively by **Gnani Prisma v3.0**, trained natively on Indic telephonic audio to handle code-mixing (e.g., Telugu mixed with English terms like *"degree"*, *"scholarship"*, *"agriculture"*).
  3. **Reasoning is Grounded**: **Gnani Evon v3.3** takes the mathematical verification output and generates warm, culturally respectful, plain-language Telugu and English explanations.
  4. **Voice is Authentic**: **Gnani Timbre v3.0** speaks the final output using the native *Lakshmi* voice with correct Indian numeral cadence (lakhs/crores).

### 2. DPDP Act & Synthetic Data Privacy
- Fully compliant with the **Digital Personal Data Protection Act (DPDP), 2023** and Gnani Challenge integrity rules.
- Zero storage of real Aadhaar numbers, PAN numbers, or citizen phone calls.
- Built-in synthetic test personas for instantaneous demo verification.

### 3. Resilience & Graceful Degradation
- **Network Outage / API Limit Fallback**: If speech endpoints or external keys face latency spikes, the system automatically falls back to text input and local deterministic advisory without dropping the citizen session.
- **Microphone Fallback**: Automatically senses browser permissions and provides fallback keyboard input.
