# JanSeva AI

Your Voice. Your Rights. Your Government Benefits.

A voice-first assistant that helps Indian citizens find government schemes, check eligibility, see required documents, and reach official portals.

## Stack
- Frontend: React with Vite
- Backend: Node.js with Express
- Database: SQLite for sessions; scheme records as JSON in data/schemes/
- Speech-to-text: Gnani Prisma v3.0, called from the backend only
- Text-to-speech: Gnani Timbre, only if the integration test passes

## Setup
1. Copy .env.example to .env and add your GNANI_API_KEY.
2. Never commit .env or audio files.
3. See docs/scope.md, docs/api-contract.md and docs/gnani-integration.md.
4. Voice input needs ffmpeg. On macOS run `brew install ffmpeg`.

## Status
Scheme records with status "checked_against_uploaded_guideline" have been checked against the official guideline PDF. Each record lists its open items. Do not present a scheme as fully verified until its open items are closed.

Current scheme set: five central schemes (PMS-SC, PM-USP CSSS, NMMSS, PM-KISAN, PMFBY). State-level schemes can be added later as data files without code changes.