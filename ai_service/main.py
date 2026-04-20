"""
main.py
Savour AI Microservice — FastAPI entry point

Endpoints:
  POST /ai/detect-ingredients   — Feature 1: YOLOv8n + CLIP image analysis
  POST /ai/similar-recipes      — Feature 3: ChromaDB semantic recommendations
  POST /ai/rebuild-index        — Feature 3: Admin rebuild ChromaDB index
  POST /ai/tag-recipe           — Feature 4: BART dietary tag classification
  POST /ai/voice-to-ingredients — Feature 5: Whisper + spaCy voice search

Start: uvicorn main:app --port 8000 --reload
"""

import os
from contextlib import asynccontextmanager
from typing import Dict, List, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# ── Lazy-imported models (heavy — load once on startup) ──────────
from utils.mongo_client import get_db
from utils.ingredient_vocab import INGREDIENT_VOCAB


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    print("🚀 Savour AI Service starting up...")

    # Connect to MongoDB
    db = get_db()

    # Feature 3: Build ChromaDB index on first run (persisted to disk)
    try:
        from models.recommender import build_index, _get_chroma
        _, collection = _get_chroma()
        count = collection.count()
        if count == 0:
            print("Building recipe embeddings index from scratch...")
            indexed = build_index(db)
            print(f"✅ Indexed {indexed} recipes")
        else:
            print(f"✅ ChromaDB index already contains {count} recipes (using persisted)")
    except Exception as e:
        print(f"⚠️  ChromaDB init warning (non-critical): {e}")

    yield  # App runs here

    print("Savour AI Service shutting down...")


app = FastAPI(
    title="Savour AI Service",
    description="AI microservice for ingredient detection, recommendations, dietary tagging, and voice search.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow Express (5000) and React dev (3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════════
# Feature 1: Image-Based Ingredient Detection
# ══════════════════════════════════════════════════════════════════

@app.post("/ai/detect-ingredients")
async def detect_ingredients(
    file: UploadFile = File(..., description="Image file (jpg/png/webp)")
):
    """
    Detect food ingredients in an uploaded image using YOLOv8n + CLIP.
    Returns detected ingredients with confidence scores.
    
    Ethics: Confidence scores are always returned to the user.
    Privacy: Image is processed in-memory and immediately discarded.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (jpg, png, webp, etc.)")

    try:
        image_bytes = await file.read()

        from models.detector import detect_ingredients as run_detection, log_detection

        result = run_detection(image_bytes, INGREDIENT_VOCAB)

        # Ethics: Log metadata for bias auditing (hash only, no image)
        try:
            db = get_db()
            log_detection(db, image_bytes, result["detection_count"], result["confidence_scores"])
        except Exception:
            pass  # Non-critical

        return {
            "ingredients": result["ingredients"],
            "confidence_scores": result["confidence_scores"],
            "disclaimer": "AI detection may miss ingredients or misidentify items. Please review before searching.",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")


# ══════════════════════════════════════════════════════════════════
# Feature 3: Content-Based Recipe Recommendations
# ══════════════════════════════════════════════════════════════════

class SimilarRecipesRequest(BaseModel):
    recipe_id: str
    top_k: int = 4


@app.post("/ai/similar-recipes")
async def similar_recipes(request: SimilarRecipesRequest):
    """
    Return semantically similar recipes using ChromaDB + sentence-transformers.
    Ethics: Recommendation is content-based only; no personal data used.
    """
    try:
        from models.recommender import get_similar_recipes
        db = get_db()
        results = get_similar_recipes(request.recipe_id, request.top_k, db)
        return {
            "similar": results,
            "note": "Suggestions based on ingredient and flavor similarity only — not personal history or demographic data.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")


class RebuildIndexResponse(BaseModel):
    indexed: int
    message: str


@app.post("/ai/rebuild-index", response_model=RebuildIndexResponse)
async def rebuild_index():
    """
    Admin: Rebuild the ChromaDB recipe embedding index from MongoDB.
    Call this after approving new recipes.
    """
    try:
        from models.recommender import build_index
        db = get_db()
        indexed = build_index(db)
        return {"indexed": indexed, "message": f"Successfully indexed {indexed} recipes."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Index rebuild failed: {str(e)}")


# ══════════════════════════════════════════════════════════════════
# Feature 4: Automated Dietary Tagging
# ══════════════════════════════════════════════════════════════════

class TagRecipeRequest(BaseModel):
    title: str
    ingredients: List[str]
    description: str = ""


@app.post("/ai/tag-recipe")
async def tag_recipe(request: TagRecipeRequest):
    """
    Classify a recipe into dietary tags using BART zero-shot classification.
    Only returns tags with confidence > 0.75 to prevent mislabeling.
    """
    try:
        from models.tagger import tag_recipe as run_tagger
        result = run_tagger(request.title, request.ingredients, request.description)
        return {
            "tags": result["tags"],
            "scores": result["scores"],
            "threshold_used": 0.75,
            "disclaimer": "Dietary tags are AI-generated. Always verify ingredients for serious dietary requirements.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tagging failed: {str(e)}")


# ══════════════════════════════════════════════════════════════════
# Feature 5: Voice Search
# ══════════════════════════════════════════════════════════════════

@app.post("/ai/voice-to-ingredients")
async def voice_to_ingredients(
    file: UploadFile = File(..., description="Audio file (webm/wav)")
):
    """
    Transcribe audio and extract ingredient names using Whisper + spaCy.
    
    Ethics:
      - Audio processed in-memory, temp file deleted immediately after
      - Transcript returned to user for verification before search
      - No audio data stored or transmitted externally
    """
    if not file.content_type:
        raise HTTPException(status_code=400, detail="No content type provided")

    # Accept common audio formats
    valid_types = {"audio/webm", "audio/wav", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/m4a"}
    if file.content_type not in valid_types:
        # Permissive — allow if unsure
        pass

    try:
        audio_bytes = await file.read()

        # Determine format from content type
        fmt_map = {
            "audio/webm": "webm",
            "audio/wav": "wav",
            "audio/ogg": "ogg",
            "audio/mp4": "m4a",
            "audio/mpeg": "mp3",
            "audio/m4a": "m4a",
        }
        audio_format = fmt_map.get(file.content_type, "webm")

        from models.transcriber import transcribe_audio
        result = transcribe_audio(audio_bytes, audio_format)

        return {
            "transcript": result["transcript"],
            "ingredients": result["ingredients"],
            "note": "Voice data is processed locally and never stored or transmitted externally.",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


# ── Health Check ──────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "Savour AI Service"}
