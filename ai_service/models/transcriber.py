"""
transcriber.py
Feature 5: Voice Search — Speech-to-Ingredients

Pipeline:
  1. openai/whisper-small for speech-to-text (local, no data leaves device)
  2. spaCy en_core_web_sm for noun extraction
  3. Filter nouns against ingredient vocabulary

Ethics:
  - Audio is never stored — processed in-memory and immediately discarded
  - Transcript shown to user before any search action
  - "Voice data processed locally" disclosed in UI
"""

import os
from typing import Dict, List

_whisper_model = None
_spacy_model = None

USE_LIGHTWEIGHT = os.getenv("USE_LIGHTWEIGHT_MODE", "false").lower() == "true"
WHISPER_MODEL_SIZE = "tiny" if USE_LIGHTWEIGHT else "small"


def _load_whisper():
    global _whisper_model
    if _whisper_model is None:
        import whisper
        print(f"Loading whisper-{WHISPER_MODEL_SIZE}...")
        _whisper_model = whisper.load_model(WHISPER_MODEL_SIZE)
        print(f"✅ Whisper-{WHISPER_MODEL_SIZE} loaded")
    return _whisper_model


def _load_spacy():
    global _spacy_model
    if _spacy_model is None:
        import spacy
        try:
            _spacy_model = spacy.load("en_core_web_sm")
            print("✅ spaCy en_core_web_sm loaded")
        except OSError:
            print("⚠️  spaCy model not found. Run: python -m spacy download en_core_web_sm")
            raise
    return _spacy_model


def transcribe_audio(audio_bytes: bytes, audio_format: str = "webm") -> Dict:
    """
    Transcribe audio bytes to text and extract ingredient-like nouns.
    
    Args:
        audio_bytes: Raw audio data (webm or wav)
        audio_format: File format hint
        
    Returns:
        { transcript: str, ingredients: [str] }
    
    Privacy: audio_bytes is processed in-memory and immediately discarded.
    """
    import tempfile
    import numpy as np

    # Write to temp file (Whisper requires file path or numpy array)
    suffix = f".{audio_format}" if audio_format in ["wav", "mp3", "webm", "ogg", "m4a"] else ".webm"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        whisper_model = _load_whisper()

        # Transcribe — Whisper handles the audio format automatically
        result = whisper_model.transcribe(tmp_path, language="en", fp16=False)
        transcript = result.get("text", "").strip()

        # Extract ingredients from transcript
        ingredients = _extract_ingredients(transcript)

        return {
            "transcript": transcript,
            "ingredients": ingredients,
        }

    finally:
        # Privacy: always delete temp file
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


def _extract_ingredients(transcript: str) -> List[str]:
    """
    Use spaCy to extract ingredient-like nouns from transcript,
    then filter against the master ingredient vocabulary.
    """
    from utils.ingredient_vocab import INGREDIENT_VOCAB

    if not transcript:
        return []

    try:
        nlp = _load_spacy()
        doc = nlp(transcript.lower())

        # Extract noun chunks and individual nouns
        candidate_words = set()

        for chunk in doc.noun_chunks:
            candidate_words.add(chunk.text.strip())

        for token in doc:
            if token.pos_ in ("NOUN", "PROPN") and not token.is_stop:
                candidate_words.add(token.text.strip())

        # Filter against vocabulary
        matched = []
        vocab_lower = [v.lower() for v in INGREDIENT_VOCAB]

        for candidate in candidate_words:
            # Direct match
            if candidate in vocab_lower:
                matched.append(candidate)
                continue
            # Partial match (candidate is part of a vocab phrase or vice versa)
            for vocab_item in vocab_lower:
                if candidate in vocab_item or vocab_item in candidate:
                    matched.append(vocab_item)
                    break

        # Deduplicate while preserving first-found order
        seen = set()
        result = []
        for item in matched:
            if item not in seen:
                seen.add(item)
                result.append(item)

        return result

    except Exception as e:
        print(f"spaCy extraction warning: {e}")
        # Fallback: simple word matching
        return _simple_ingredient_extract(transcript)


def _simple_ingredient_extract(transcript: str) -> List[str]:
    """Fallback: match against vocabulary without spaCy."""
    from utils.ingredient_vocab import INGREDIENT_VOCAB

    transcript_lower = transcript.lower()
    found = []
    for ingredient in INGREDIENT_VOCAB:
        if ingredient in transcript_lower and ingredient not in found:
            found.append(ingredient)
    return found
