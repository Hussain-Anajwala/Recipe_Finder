"""
mongo_client.py
PyMongo client for the same MongoDB instance as the Express server.
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

_client = None
_db = None


def get_db():
    """Return the shared MongoDB database instance (lazy singleton)."""
    global _client, _db
    if _db is None:
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/RecipeDB")
        _client = MongoClient(mongo_uri)
        # Extract db name from URI or default to RecipeDB
        db_name = mongo_uri.split("/")[-1].split("?")[0] or "RecipeDB"
        _db = _client[db_name]
        print(f"✅ PyMongo connected to: {db_name}")
    return _db


def close_db():
    """Close the MongoDB connection."""
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
