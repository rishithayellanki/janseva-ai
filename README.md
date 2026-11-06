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

## Status
Scheme records marked "verified_against_uploaded_guideline" have been checked against the official PDF. The Telangana ePASS records are not yet verified and must not be shown as verified.
