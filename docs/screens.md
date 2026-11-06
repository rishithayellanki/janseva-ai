# JanSeva AI – Screen layouts (v0.1, 6 Nov 2026)

Design rules for all screens
- Mobile first. Large buttons, one main action per screen.
- Telugu and English text on every screen, switchable from the header.
- Every result screen shows the disclaimer: "This result is indicative. Confirm eligibility on the official portal."

## 1. Home
Purpose: choose language and start.

+-----------------------------------+
| JanSeva AI                  [తె/EN]|
| Your Voice. Your Rights.          |
| Your Government Benefits.         |
|                                   |
|   [  🎤  Start speaking  ]        |
|   [  ⌨  Type instead     ]        |
|                                   |
| How it works: answer a few        |
| questions, see schemes you may    |
| qualify for, and get the steps.   |
+-----------------------------------+

Maps to: POST /api/transcribe (voice), session creation.

## 2. Conversation
Purpose: onboarding questions, one at a time.

+-----------------------------------+
| ← Back                    Step 2/4|
|                                   |
| Bot: What is your age?            |
|                                   |
| You: 19 (spoken or typed)         |
|                                   |
| Bot: Which state do you live in?  |
|                                   |
| [ 🎤 Speak ]  [ type answer...  ] |
| [Send]                            |
+-----------------------------------+

Fields asked, in order: age, occupation, state, family income
range, category (SC/ST/BC/EBC/minority/general), owns cultivable
land (yes/no), family member pays income tax / is a government
employee / holds elected post (yes/no each).
Follow-up question shown when an answer is unclear.
If the mic fails, the text box is used. Never a dead end.

Maps to: POST /api/profile.

## 3. Recommendations
Purpose: show matched schemes with status.

+-----------------------------------+
| ← Back            Your matches    |
|                                   |
| ┌───────────────────────────────┐ |
| │ PM-KISAN          ● Eligible  │ |
| │ ₹6,000 a year                 │ |
| │ Why: you own cultivable land  │ |
| │ [View details]                │ |
| └───────────────────────────────┘ |
| ┌───────────────────────────────┐ |
| │ NMMSS         ◐ Needs info    │ |
| │ Missing: marks from Class VIII│ |
| │ [View details]                │ |
| └───────────────────────────────┘ |
|                                   |
| Disclaimer text                   |
+-----------------------------------+

Status labels: "Eligible" (green), "Needs more information"
(amber), "Not eligible" (grey, with the unmet rule shown).
Schemes that are closed or have no verified deadline show no
deadline line at all.

Maps to: POST /api/match.

## 4. Scheme details
Purpose: one scheme, all the facts the user needs to act.

+-----------------------------------+
| ← Back        PM-KISAN            |
| Status: Eligible                  |
|                                   |
| Benefit: ₹6,000 per year          |
| in 3 instalments of ₹2,000        |
|                                   |
| Why you match                     |
|  ✓ Owns cultivable land           |
|  ✓ No income tax paid last year   |
|                                   |
| Documents you need                |
|  □ Aadhaar                        |
|  □ Land record (Khatauni/Patta)   |
|                                   |
| How to apply                      |
|  1. Check your name on pmkisan.gov.in
|  2. ...                           |
|                                   |
| [ Open official portal ]          |
| Source: pmkisan.gov.in guidelines |
| Last checked: 6 Nov 2026          |
+-----------------------------------+

Shows only what the scheme record contains. If a field is empty
in the record, the screen says "not stated in the official
guideline" rather than leaving a blank.

Maps to: GET /api/schemes/:id.
