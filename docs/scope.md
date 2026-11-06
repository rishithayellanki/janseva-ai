# JanSeva AI – Scope (frozen 6 Nov 2026)

Rule: anything not marked MUST is not built before 10 Nov.
Scheme coverage: five central schemes (PMS-SC, PM-USP CSSS, NMMSS, PM-KISAN, PMFBY). State-level schemes can be added later as data files without code changes.
## MUST (demo depends on these)
- Voice and text input, with text fallback if mic or speech fails
- Telugu and English interface, Telugu-English code-mixed input
- One-question-at-a-time onboarding: age, occupation, state, income range
- Follow-up question when an answer is unclear
- Recommendations from verified scheme records only (3–5 schemes)
- Eligibility with three states: Eligible / Needs more information / Not eligible
- Reason shown for each match or unmet condition
- Document checklist per scheme
- Application steps and official portal link per scheme
- Source URL and last-verified date per scheme
- Eligibility disclaimer on every results screen
- Works on a mobile screen size

## SHOULD (only after all MUST items work end to end)
- Spoken replies via TTS (Timbre), if the integration test passes
- Shareable summary (text or printable page)
- Where to get each document
- Feedback button (Helpful / Not helpful)

## LATER (roadmap only, not built)
- Deadline reminders
- Nearest help centre lookup
- Real-time application status
- Dynamic benefit calculations
- Automatic scheme updates
- Scheme comparison
- Conversation history persistence
- Additional states or languages beyond Telugu and English
