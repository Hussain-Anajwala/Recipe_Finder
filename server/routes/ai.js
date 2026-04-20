// File: /server/routes/ai.js
// Express proxy routes to the FastAPI AI microservice (port 8000)

import express from 'express';
import fetch from 'node-fetch';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// ── Helper: forward multipart/form-data to FastAPI ────────────────
async function forwardMultipart(req, res, fastapiPath) {
  try {
    // Re-stream the raw body to FastAPI preserving all headers
    const upstreamRes = await fetch(`${AI_SERVICE_URL}${fastapiPath}`, {
      method: 'POST',
      headers: {
        // Forward content-type with boundary for multipart
        'content-type': req.headers['content-type'],
      },
      body: req,
      // node-fetch supports streaming request bodies
      duplex: 'half',
    });

    const data = await upstreamRes.json();

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error(`AI proxy error (${fastapiPath}):`, err.message);
    res.status(502).json({ error: 'AI service unavailable. Please ensure the AI service is running on port 8000.' });
  }
}

// ── Helper: forward JSON request to FastAPI ────────────────────────
async function forwardJSON(req, res, fastapiPath, method = 'POST') {
  try {
    const upstreamRes = await fetch(`${AI_SERVICE_URL}${fastapiPath}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await upstreamRes.json();

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error(`AI proxy error (${fastapiPath}):`, err.message);
    res.status(502).json({ error: 'AI service unavailable. Please ensure the AI service is running on port 8000.' });
  }
}

// ── Feature 1: Image-Based Ingredient Detection ────────────────────
// POST /api/ai/detect-ingredients
// Accepts multipart/form-data with image file
// Returns: { ingredients: [...], confidence_scores: {...} }
router.post('/detect-ingredients', protect, (req, res) => {
  forwardMultipart(req, res, '/ai/detect-ingredients');
});

// ── Feature 3: Similar Recipe Recommendations ──────────────────────
// GET /api/ai/similar/:recipeId
// Returns: [{ recipe_id, similarity_score, title, category }, ...]
router.get('/similar/:recipeId', async (req, res) => {
  try {
    const upstreamRes = await fetch(`${AI_SERVICE_URL}/ai/similar-recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipe_id: req.params.recipeId, top_k: 4 }),
    });

    const data = await upstreamRes.json();

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('AI proxy error (similar-recipes):', err.message);
    res.status(502).json({ error: 'AI service unavailable.' });
  }
});

// ── Feature 5: Voice Search ────────────────────────────────────────
// POST /api/ai/voice-to-ingredients
// Accepts multipart/form-data with audio file (webm/wav)
// Returns: { transcript: "...", ingredients: [...] }
router.post('/voice-to-ingredients', protect, (req, res) => {
  forwardMultipart(req, res, '/ai/voice-to-ingredients');
});

// ── Feature 4: Manual Re-tag (Admin) ──────────────────────────────
// POST /api/ai/tag-recipe
// Body: { title, ingredients, description }
// Returns: { tags: [...], scores: {...} }
router.post('/tag-recipe', protect, adminOnly, (req, res) => {
  forwardJSON(req, res, '/ai/tag-recipe');
});

// ── Feature 3: Rebuild Recommendation Index (Admin) ───────────────
// POST /api/ai/rebuild-index
// Triggers reindexing of all approved recipes in ChromaDB
router.post('/rebuild-index', protect, adminOnly, (req, res) => {
  forwardJSON(req, res, '/ai/rebuild-index');
});

export default router;
