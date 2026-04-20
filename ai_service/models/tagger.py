"""
tagger.py
Feature 4: Automated Dietary Tagging

Uses:
  - facebook/bart-large-mnli for zero-shot classification (primary)
  - Rule-based detection as fallback / lightweight mode

Ethics:
  - Only returns tags with confidence > 0.75 (never borderline classifications)
  - Disclosed accuracy limitations in EthicsStatement page
  - Users can report incorrect tags
"""

import os
from typing import Dict, List, Tuple

_classifier = None
USE_LIGHTWEIGHT = os.getenv("USE_LIGHTWEIGHT_MODE", "false").lower() == "true"

DIETARY_TAGS = [
    "vegan",
    "vegetarian",
    "gluten-free",
    "dairy-free",
    "keto",
    "nut-free",
    "high-protein",
]

CONFIDENCE_THRESHOLD = 0.75

# ── Rule-based fallback definitions ──────────────────────────────
MEAT_KEYWORDS = {"chicken", "beef", "pork", "lamb", "turkey", "fish", "salmon",
                 "tuna", "shrimp", "prawn", "crab", "lobster", "bacon", "ham",
                 "sausage", "meat", "gelatin", "lard", "anchovies"}

DAIRY_KEYWORDS = {"milk", "cream", "butter", "cheese", "parmesan", "mozzarella",
                  "cheddar", "feta", "ricotta", "yogurt", "sour cream", "cream cheese",
                  "ghee", "whey", "casein"}

GLUTEN_KEYWORDS = {"flour", "wheat", "bread", "pasta", "noodle", "barley", "rye",
                   "semolina", "breadcrumbs", "soy sauce", "croutons", "couscous",
                   "croissant", "malt"}

NUT_KEYWORDS = {"almond", "walnut", "cashew", "peanut", "pistachio", "hazelnut",
                "pecan", "macadamia", "pine nut", "chestnut", "brazil nut"}

HIGH_PROTEIN_KEYWORDS = {"chicken", "beef", "pork", "fish", "salmon", "tuna",
                         "eggs", "egg", "tofu", "tempeh", "lentils", "chickpeas",
                         "black beans", "protein", "whey", "quinoa"}

KETO_FORBIDDEN = {"sugar", "rice", "pasta", "bread", "flour", "potato", "oats",
                  "corn", "banana", "apple", "honey", "maple syrup", "fruit",
                  "beans", "lentils", "chickpeas", "quinoa", "noodle"}


def _load_classifier():
    global _classifier
    if _classifier is None and not USE_LIGHTWEIGHT:
        from transformers import pipeline
        print("Loading facebook/bart-large-mnli (this may take a moment)...")
        _classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            multi_label=True,
        )
        print("✅ BART-large-MNLI loaded")
    return _classifier


def _rule_based_tag(ingredients_lower: set, title_lower: str, description_lower: str) -> Dict[str, float]:
    """Fast rule-based tagging using keyword matching."""
    tags = {}
    text = ingredients_lower | {title_lower} | {description_lower}
    all_text = " ".join(text)

    has_meat = any(k in all_text for k in MEAT_KEYWORDS)
    has_dairy = any(k in all_text for k in DAIRY_KEYWORDS)
    has_gluten = any(k in all_text for k in GLUTEN_KEYWORDS)
    has_nuts = any(k in all_text for k in NUT_KEYWORDS)
    has_high_protein = any(k in all_text for k in HIGH_PROTEIN_KEYWORDS)
    has_keto_forbidden = any(k in all_text for k in KETO_FORBIDDEN)

    if not has_meat:
        if not has_dairy:
            tags["vegan"] = 0.88
        tags["vegetarian"] = 0.88

    if not has_gluten:
        tags["gluten-free"] = 0.85

    if not has_dairy:
        tags["dairy-free"] = 0.85

    if not has_nuts:
        tags["nut-free"] = 0.85

    if has_high_protein and not has_keto_forbidden:
        tags["keto"] = 0.80

    if has_high_protein:
        tags["high-protein"] = 0.82

    return tags


def tag_recipe(title: str, ingredients: List[str], description: str) -> Dict:
    """
    Classify a recipe into dietary tags.
    Returns only tags with confidence > CONFIDENCE_THRESHOLD (0.75).
    """
    ingredients_lower = {ing.lower() for ing in ingredients}
    title_lower = title.lower()
    description_lower = description.lower()

    if USE_LIGHTWEIGHT:
        # Lightweight: rule-based only
        all_scores = _rule_based_tag(ingredients_lower, title_lower, description_lower)
    else:
        # Primary: BART zero-shot
        try:
            classifier = _load_classifier()
            combined_text = (
                f"Recipe: {title}. "
                f"Ingredients: {', '.join(ingredients)}. "
                f"Description: {description}"
            )

            result = classifier(
                combined_text,
                candidate_labels=DIETARY_TAGS,
                multi_label=True,
            )

            all_scores = {
                label: round(score, 4)
                for label, score in zip(result["labels"], result["scores"])
            }

        except Exception as e:
            print(f"BART classification failed, falling back to rule-based: {e}")
            all_scores = _rule_based_tag(ingredients_lower, title_lower, description_lower)

    # Ethics: Only return high-confidence tags (> 0.75)
    confident_tags = {
        tag: score
        for tag, score in all_scores.items()
        if score >= CONFIDENCE_THRESHOLD
    }

    return {
        "tags": list(confident_tags.keys()),
        "scores": confident_tags,
    }
