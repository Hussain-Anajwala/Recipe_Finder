"""
recommender.py
Feature 3: Content-Based Recipe Recommendations

Uses:
  - sentence-transformers/all-MiniLM-L6-v2 for semantic embeddings
  - ChromaDB (fully local) as vector store
  - Cuisine diversity enforcement: top_k results must span ≥2 categories

Ethics: Recommendations based on content similarity only — no personal history,
no demographic data, no popularity bias. Disclosed to users in UI.
"""

import os
from typing import List, Dict, Optional
from datetime import datetime

_embedding_model = None
_chroma_client = None
_chroma_collection = None

CHROMA_PATH = os.path.join(os.path.dirname(__file__), "..", "chroma_db")
COLLECTION_NAME = "recipes"


def _load_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        print("Loading sentence-transformers/all-MiniLM-L6-v2...")
        _embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        print("✅ Sentence transformer loaded")
    return _embedding_model


def _get_chroma():
    global _chroma_client, _chroma_collection
    if _chroma_client is None:
        import chromadb
        os.makedirs(CHROMA_PATH, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
        _chroma_collection = _chroma_client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        print(f"✅ ChromaDB initialized at {CHROMA_PATH}")
    return _chroma_client, _chroma_collection


def _recipe_to_text(recipe: dict) -> str:
    """Build embedding input text from recipe fields."""
    title = recipe.get("title", "")
    ingredients = recipe.get("ingredients", [])
    description = recipe.get("description", "")
    category = recipe.get("category", "")
    ingredients_str = ", ".join(ingredients) if isinstance(ingredients, list) else str(ingredients)
    return f"{title}. Category: {category}. Ingredients: {ingredients_str}. {description}"


def build_index(db) -> int:
    """
    Build/rebuild the ChromaDB vector index from all approved recipes in MongoDB.
    Called on startup and via admin rebuild endpoint.
    Returns number of recipes indexed.
    """
    model = _load_embedding_model()
    _, collection = _get_chroma()

    # Fetch all approved recipes
    recipes = list(db["recipes"].find({"status": "approved"}))

    if not recipes:
        print("No approved recipes to index.")
        return 0

    texts = [_recipe_to_text(r) for r in recipes]
    ids = [str(r["_id"]) for r in recipes]
    metadatas = [
        {
            "title": r.get("title", ""),
            "category": r.get("category", ""),
            "recipe_id": str(r["_id"]),
        }
        for r in recipes
    ]

    print(f"Generating embeddings for {len(recipes)} recipes...")
    embeddings = model.encode(texts, show_progress_bar=False).tolist()

    # Batch upsert — ChromaDB handles duplicates via ID
    batch_size = 100
    for i in range(0, len(recipes), batch_size):
        collection.upsert(
            ids=ids[i:i+batch_size],
            documents=texts[i:i+batch_size],
            embeddings=embeddings[i:i+batch_size],
            metadatas=metadatas[i:i+batch_size],
        )

    # Update embeddingUpdatedAt on all indexed recipes
    from bson import ObjectId
    db["recipes"].update_many(
        {"_id": {"$in": [r["_id"] for r in recipes]}},
        {"$set": {"embeddingUpdatedAt": datetime.utcnow()}}
    )

    count = collection.count()
    print(f"✅ ChromaDB index built: {count} recipes")
    return count


def get_similar_recipes(recipe_id: str, top_k: int = 4, db=None) -> List[Dict]:
    """
    Find top_k similar recipes for a given recipe_id.
    Enforces cuisine diversity: at least 2 different categories if possible.
    Returns: [{ recipe_id, title, category, similarity_score }, ...]
    """
    model = _load_embedding_model()
    _, collection = _get_chroma()

    # Get the query recipe's document from ChromaDB
    try:
        result = collection.get(ids=[recipe_id], include=["documents", "embeddings"])
    except Exception:
        return []

    if not result["ids"]:
        return []

    query_embedding = result["embeddings"][0]

    # Query for top_k+2 to allow diversity reshuffling
    query_result = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k + 4, collection.count()),
        include=["metadatas", "distances"],
    )

    candidates = []
    if query_result and query_result["ids"]:
        for rid, metadata, distance in zip(
            query_result["ids"][0],
            query_result["metadatas"][0],
            query_result["distances"][0],
        ):
            if rid == recipe_id:
                continue  # Skip self
            similarity = round(1.0 - distance, 4)  # cosine: distance to similarity
            candidates.append({
                "recipe_id": rid,
                "title": metadata.get("title", ""),
                "category": metadata.get("category", ""),
                "similarity_score": similarity,
            })

    # ── Ethics: Diversity enforcement ───────────────────────────
    # If all top_k are same category, reshuffle to include ≥2 different categories
    final = _enforce_diversity(candidates, top_k)

    return final


def _enforce_diversity(candidates: List[Dict], top_k: int) -> List[Dict]:
    """Ensure at least 2 categories are represented in top_k results."""
    if len(candidates) <= top_k:
        return candidates

    top = candidates[:top_k]
    categories_in_top = set(c["category"] for c in top)

    if len(categories_in_top) >= 2:
        return top  # Already diverse

    # Find best candidate from a different category
    primary_category = top[0]["category"]
    diverse_candidate = None

    for candidate in candidates[top_k:]:
        if candidate["category"] != primary_category:
            diverse_candidate = candidate
            break

    if diverse_candidate:
        # Replace the last item in top with diverse candidate
        top[-1] = diverse_candidate

    return top
