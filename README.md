# 🍽️ Savour — AI-Enhanced Recipe Finder

An editorial recipe platform with five AI-powered features, built as a MERN stack application with a Python FastAPI microservice for AI inference.

> **Ethics First:** Every AI feature exposes confidence scores, discloses limitations, and preserves user privacy. See [`/ethics`](#ethics-statement) or the live Ethics Statement page.

---

## Architecture

```
client/        React (CRA + Tailwind) — port 3000
server/        Express + MongoDB       — port 5000
ai_service/    FastAPI + Python        — port 8000
```

The React frontend calls Express exclusively. Express proxies AI requests to FastAPI.

---

## AI Features

| # | Feature | Model | Route |
|---|---------|-------|-------|
| 1 | Image Ingredient Detection | YOLOv8n + CLIP ViT-B/32 | `POST /api/ai/detect-ingredients` |
| 2 | ML Match Threshold Filtering | Combined scoring (built-in) | `GET /api/recipes/search?threshold=X` |
| 3 | Content-Based Recommendations | all-MiniLM-L6-v2 + ChromaDB | `GET /api/ai/similar/:id` |
| 4 | Automated Dietary Tagging | facebook/bart-large-mnli | Auto-runs on recipe submit/edit |
| 5 | Voice-Activated Search | openai/whisper-small + spaCy | `POST /api/ai/voice-to-ingredients` |

All models are **open-source** and run **locally** — no external AI APIs, no data leaves your server.

---

## Quick Start

### 1. Express Server

```bash
cd server
cp .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### 2. React Client

```bash
cd client
npm install
npm start
```

### 3. AI Service (Python 3.10+, 8GB+ RAM recommended)

```bash
cd ai_service
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cp .env.example .env           # set MONGO_URI if different
uvicorn main:app --port 8000 --reload
```

> **Low-memory mode:** Set `USE_LIGHTWEIGHT_MODE=true` in `ai_service/.env` to use whisper-tiny and rule-based dietary tagging instead of BART. Recommended for machines with < 8GB RAM.

---

## Feature Details

### Feature 1 — Image Ingredient Detection
- Upload a photo of your fridge or pantry
- YOLOv8n detects COCO-category food objects
- CLIP zero-shot extends coverage to ~80 ingredient types
- Detected ingredients are shown with confidence % — always visible
- **Privacy:** Image processed in-memory only. Never stored.

### Feature 2 — ML-Enhanced Match Threshold
- Recipes are ranked by a combined score: ingredient match % + coverage %
- Users control the minimum threshold via a slider (0–100%)
- Hidden recipe count is disclosed above the results
- Matched ingredients highlighted in recipe detail view

### Feature 3 — Content-Based Recommendations
- Semantic embeddings computed via sentence-transformers/all-MiniLM-L6-v2
- Stored locally in ChromaDB persistent vector store
- Diversity enforcement: results must span ≥2 recipe categories
- **No personal data used.** Content-based only.

### Feature 4 — Automated Dietary Tagging
- BART-large-MNLI zero-shot classifies recipes into 7 tag categories
- Only applied when confidence ≥ 75% — never borderline
- Confidence displayed alongside every tag
- Users can flag incorrect tags via the 🚩 icon
- Admin can rebuild the ChromaDB index from the Admin → AI Tools tab

### Feature 5 — Voice Search
- Browser records audio (WebM), sent to Whisper for transcription
- spaCy NLP extracts ingredient nouns from transcript
- Transcript shown to user before any search is performed
- **Privacy:** Temp audio file deleted immediately after processing

---

## Ethics Statement

Full model cards, data collection disclosure, and known limitations are documented at the `/ethics` route in the running app, and in `client/src/components/EthicsStatement.js`.

Key commitments:
- Confidence scores always shown; no black-box outputs
- Voice audio and uploaded images are never stored
- Dietary tags carry an explicit allergy warning
- Recommendations use zero personal or behavioral data
- All AI models are open-source (see Ethics page for links)

---

## Environment Variables

### `server/.env`
```
MONGO_URI=mongodb://localhost:27017/RecipeDB
JWT_SECRET=your-secret-key-here
AI_SERVICE_URL=http://localhost:8000
```

### `ai_service/.env`
```
MONGO_URI=mongodb://localhost:27017/RecipeDB
USE_LIGHTWEIGHT_MODE=false
```

---

## Admin Features

- Recipe approval / rejection workflow with optional admin notes
- User role management (promote/demote admin)
- AI Tools tab: rebuild ChromaDB recommendation index
- Dietary tag reports from users are stored in `tag_reports` collection

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Material Symbols |
| Backend | Express.js, MongoDB, Mongoose, JWT |
| AI Service | FastAPI, Uvicorn, PyMongo |
| CV | ultralytics YOLOv8n, openai/CLIP |
| NLP/Embeddings | sentence-transformers, spaCy |
| NLU | facebook/bart-large-mnli |
| Speech | openai/whisper |
| Vector DB | ChromaDB (local persistent) |
