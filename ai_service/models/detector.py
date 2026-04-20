"""
detector.py
Feature 1: Image-Based Ingredient Detection

Pipeline:
  1. YOLOv8n (COCO-trained) → detects food-relevant objects
  2. CLIP ViT-B/32 zero-shot → classifies against full ingredient vocab
  3. Merge & deduplicate results
  4. Log detection metadata to MongoDB (privacy-safe: hash only, no image)

Ethics: Always return confidence scores; never hide detection uncertainty.
Limitation: YOLOv8n (COCO) has limited food vocabulary — disclosed in EthicsStatement.
"""

import hashlib
import os
from datetime import datetime
from typing import Dict, List, Tuple

import numpy as np
from PIL import Image

# Lazy-loaded models
_yolo_model = None
_clip_model = None
_clip_processor = None


def _load_yolo():
    global _yolo_model
    if _yolo_model is None:
        from ultralytics import YOLO
        print("Loading YOLOv8n model...")
        _yolo_model = YOLO("yolov8n.pt")  # Downloads automatically on first run
        print("✅ YOLOv8n loaded")
    return _yolo_model


def _load_clip():
    global _clip_model, _clip_processor
    if _clip_model is None:
        from transformers import CLIPProcessor, CLIPModel
        print("Loading CLIP ViT-B/32 model...")
        _clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        print("✅ CLIP loaded")
    return _clip_model, _clip_processor


# COCO classes that are food-relevant
COCO_FOOD_CLASSES = {
    "banana", "apple", "sandwich", "orange", "broccoli", "carrot",
    "hot dog", "pizza", "donut", "cake", "bowl", "cup",
}


def detect_ingredients(image_bytes: bytes, ingredient_vocab: List[str]) -> Dict:
    """
    Run YOLOv8n + CLIP detection on image bytes.
    Returns: { ingredients: [...], confidence_scores: {ingredient: float} }
    """
    # Load image
    import io
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    confidence_scores = {}

    # ── Step 1: YOLOv8n Detection ────────────────────────────────
    yolo = _load_yolo()
    results = yolo(image, verbose=False)

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = result.names[class_id].lower()
            confidence = float(box.conf[0])

            if class_name in COCO_FOOD_CLASSES and confidence > 0.3:
                # Map COCO names to ingredient names where needed
                ingredient_name = _map_coco_to_ingredient(class_name)
                if ingredient_name:
                    # Take highest confidence if detected multiple times
                    if ingredient_name not in confidence_scores or confidence_scores[ingredient_name] < confidence:
                        confidence_scores[ingredient_name] = round(confidence, 3)

    # ── Step 2: CLIP Zero-Shot Classification ────────────────────
    try:
        clip_model, clip_processor = _load_clip()
        import torch

        # Use a subset of vocab for efficiency (top 50 most common)
        candidate_labels = ingredient_vocab[:80]

        inputs = clip_processor(
            text=candidate_labels,
            images=image,
            return_tensors="pt",
            padding=True
        )

        with torch.no_grad():
            outputs = clip_model(**inputs)

        # Get probabilities via softmax over image-text similarity
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)[0]

        # Add ingredients where CLIP confidence > 0.02 (relative to full vocab)
        for idx, prob in enumerate(probs.tolist()):
            ingredient = candidate_labels[idx]
            if prob > 0.02:  # Filter noise
                # Merge: take max of YOLO and CLIP confidence
                existing = confidence_scores.get(ingredient, 0)
                confidence_scores[ingredient] = round(max(existing, prob), 3)

    except Exception as e:
        print(f"CLIP detection warning: {e}")
        # Continue with YOLO results only

    # ── Step 3: Deduplicate & Sort ───────────────────────────────
    # Sort by confidence descending, take top 15
    sorted_items = sorted(confidence_scores.items(), key=lambda x: x[1], reverse=True)[:15]
    detected = [item[0] for item in sorted_items]
    final_scores = {item[0]: item[1] for item in sorted_items}

    return {
        "ingredients": detected,
        "confidence_scores": final_scores,
        "detection_count": len(detected),
    }


def _map_coco_to_ingredient(coco_class: str) -> str:
    """Map COCO class names to common ingredient names."""
    mapping = {
        "hot dog": "sausage",
        "donut": "donut",
        "bowl": None,  # container, not ingredient
        "cup": None,
    }
    return mapping.get(coco_class, coco_class)


def log_detection(db, image_bytes: bytes, num_ingredients: int, confidence_scores: dict, user_id: str = None):
    """
    Ethics: Log detection metadata to MongoDB for bias auditing.
    NEVER stores the image itself — only a SHA-256 hash.
    """
    try:
        image_hash = hashlib.sha256(image_bytes).hexdigest()
        avg_confidence = (
            sum(confidence_scores.values()) / len(confidence_scores)
            if confidence_scores else 0.0
        )

        db["ai_detection_logs"].insert_one({
            "timestamp": datetime.utcnow(),
            "num_ingredients_detected": num_ingredients,
            "avg_confidence": round(avg_confidence, 4),
            "image_hash_sha256": image_hash,  # Privacy: hash only, not image
            "userId": user_id,
        })
    except Exception as e:
        print(f"Detection log error (non-critical): {e}")
