# JanSeva AI – API contract (v0.1, 6 Nov 2026)

Base URL (local): http://localhost:4000
All requests and responses are JSON, except /api/transcribe, which takes a file upload.

## 1. POST /api/transcribe
Converts a voice clip to text using Gnani Prisma v3.0.

Request: multipart/form-data
- audio_file: audio file, 30 seconds or less (wav, mp3, ogg, flac, aac, m4a)
- language_hint: "te-IN,en-IN" (optional, default "te-IN,en-IN")

Response 200:
{
  "transcript": "నేను ఈ scholarship గురించి ...",
  "detected_language": "te-IN",
  "source": "gnani"
}

Response 502 (Gnani failed, text fallback needed):
{
  "error": "speech_unavailable",
  "message": "Voice input is unavailable. Please type your answer."
}

## 2. POST /api/profile
Saves the user's answers and reports what is still missing.

Request:
{
  "session_id": "string",
  "answers": {
    "age": 19,
    "occupation": "student",
    "state": "Telangana",
    "income_range": "below_2.5_lakh"
  }
}

Response 200:
{
  "session_id": "string",
  "profile": { "age": 19, "occupation": "student", "state": "Telangana", "income_range": "below_2.5_lakh" },
  "missing_fields": [],
  "next_question": null
}

If fields are missing, "next_question" holds the one question to ask next, and "missing_fields" lists the remaining keys.

## 3. POST /api/match
Finds schemes for a profile and checks eligibility for each.

Request:
{
  "session_id": "string"
}

Response 200:
{
  "matches": [
    {
      "scheme_id": "pms-sc",
      "scheme_name": "Post-Matric Scholarship for SC Students",
      "eligibility_status": "eligible",
      "reasons": [
        { "condition": "Family income up to ₹2.5 lakh per year", "user_value": "below_2.5_lakh", "result": "met" }
      ],
      "missing_information": [],
      "verification": { "source_url": "https://...", "last_verified": "2026-11-06" }
    }
  ]
}

eligibility_status is one of: "eligible", "needs_more_information", "not_eligible".

## 4. GET /api/schemes/:id
Returns the full verified record for one scheme.

Response 200:
{
  "scheme_id": "pms-sc",
  "scheme_name": "...",
  "state": "central",
  "target_group": "SC students, post-matric",
  "eligibility_rules": [],
  "benefits": [],
  "required_documents": [],
  "application_steps": [],
  "deadline": null,
  "official_portal": "https://scholarships.gov.in",
  "source_url": "",
  "last_verified": ""
}

Response 404: { "error": "scheme_not_found" }

## Rules for everyone
- Scheme data comes only from data/schemes/*.json. The AI never invents eligibility.
- A null "deadline" means the official deadline isn't verified, so the UI must not show one.
- Only the backend calls Gnani. The frontend never sees the API key.
## Day 2 update: session-based onboarding (replaces /api/profile)
- POST /api/sessions  body {"language":"en" or "te"} returns {session_id, language, message, next_question}
- POST /api/sessions/:id/answer  body {"answer":"..."} returns {status: "saved" | "followup" | "complete", message, profile, next_question}
- GET /api/sessions/:id returns {session_id, language, profile}
- Income values: up_to_2_5_lakh, 2_5_to_3_5_lakh, 3_5_to_4_5_lakh, above_4_5_lakh
