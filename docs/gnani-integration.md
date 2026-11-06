# Gnani STT integration log

## Test 1 – 6 Nov 2026: PASS

Endpoint: POST https://api.vachana.ai/stt/v3
Model: prisma-v3.0
Language: te-IN,en-IN, format=codemix
Audio: test.m4a, about 5–10 seconds, Telugu-English speech

Command (API key replaced with <API_KEY>):

    curl --request POST \
      --url https://api.vachana.ai/stt/v3 \
      --header "X-API-Key-ID: <API_KEY>" \
      --form audio_file=@test.m4a \
      --form model=prisma-v3.0 \
      --form language_code=te-IN,en-IN \
      --form format=codemix

Response:

    {"success":true,
     "request_id":"01a1b0cf-89a8-7e1c-b42d-1fd225cec4a6",
     "transcript":"నేను ఈ scholarship గురించి తెలుసుకోవాలి, దానికి ఏ documents కావాలి చెప్తారా?",
     "model":"prisma-v3.0",
     "processing_time":0.518,
     "end_to_end_latency":0.521,
     "detected_language_code":"te-IN"}

Result: English words kept in Latin script inside a Telugu transcript (codemix works).
Latency: about 0.5 seconds for a short clip.

Notes:
- Audio is 30 seconds or less per request.
- The API key is never stored in this file or in the repo.