// File: /server/routes/ai.js
// Express proxy routes to the FastAPI AI microservice (port 8000)

import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// ── Reusable ECONNREFUSED-safe helper ─────────────────────────
function isServiceDown(err) {
  return (
    err.code === 'ECONNREFUSED' ||
    err.cause?.code === 'ECONNREFUSED' ||
    err.code === 'ENOTFOUND' ||
    err.type === 'system'
  );
}

// Forward JSON body (GET or POST)
async function proxyJSON(req, res, fastapiPath, method = 'POST') {
  try {
    const upstreamRes = await fetch(`${AI_SERVICE_URL}${fastapiPath}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await upstreamRes.json();
    if (!upstreamRes.ok) return res.status(upstreamRes.status).json(data);
    return res.json(data);

  } catch (err) {
    if (isServiceDown(err)) {
      return res.status(503).json({
        error: 'AI service unavailable',
        message: 'The AI microservice is not running. Start it with: cd ai_service && uvicorn main:app --port 8000',
        code: 'AI_SERVICE_DOWN',
      });
    }
    console.error(`AI proxy error (${fastapiPath}):`, err.stack);
    return res.status(500).json({ error: err.message });
  }
}

// Forward multipart/form-data as a raw stream
async function proxyMultipart(req, res, fastapiPath) {
  try {
    const upstreamRes = await fetch(`${AI_SERVICE_URL}${fastapiPath}`, {
      method: 'POST',
      headers: { 'content-type': req.headers['content-type'] },
      body: req,
      duplex: 'half',
    });

    const data = await upstreamRes.json();
    if (!upstreamRes.ok) return res.status(upstreamRes.status).json(data);
    return res.json(data);

  } catch (err) {
    if (isServiceDown(err)) {
      return res.status(503).json({
        error: 'AI service unavailable',
        message: 'The AI microservice is not running. Start it with: cd ai_service && uvicorn main:app --port 8000',
        code: 'AI_SERVICE_DOWN',
      });
    }
    console.error(`AI proxy error (${fastapiPath}):`, err.stack);
    return res.status(500).json({ error: err.message });
  }
}

// ── GET /api/ai/health ─────────────────────────────────────────
// Never 500s — always returns { status: 'online' | 'offline' }
router.get('/health', async (req, res) => {
  try {
    const upstreamRes = await fetch(`${AI_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(2000),
    });
    const data = await upstreamRes.json();
    return res.json({ status: 'online', ...data });
  } catch {
    return res.json({ status: 'offline', code: 'AI_SERVICE_DOWN' });
  }
});

// ── POST /api/ai/detect-ingredients ───────────────────────────
// Accepts multipart/form-data with image file
// Returns: { ingredients: [...], confidence_scores: {...} }
router.post('/detect-ingredients', protect, (req, res) => {
  proxyMultipart(req, res, '/ai/detect-ingredients');
});

// ── POST /api/ai/voice-to-ingredients ─────────────────────────
// Accepts multipart/form-data with audio file (webm/wav)
// Returns: { transcript: "...", ingredients: [...] }
router.post('/voice-to-ingredients', protect, (req, res) => {
  proxyMultipart(req, res, '/ai/voice-to-ingredients');
});

// ── POST /api/ai/recommend ─────────────────────────────────────
// Body: { recipe_id, limit }
// Returns: { recommendations: [...] }
router.post('/recommend', protect, (req, res) => {
  proxyJSON(req, res, '/ai/recommend');
});

// ── GET /api/ai/similar/:recipeId ─────────────────────────────
// Returns: { similar: [{ recipe_id, similarity_score, title, category }, ...] }
router.get('/similar/:recipeId', async (req, res) => {
  req.body = { recipe_id: req.params.recipeId, top_k: 4 };
  proxyJSON(req, res, '/ai/similar-recipes');
});

// ── POST /api/ai/tag-recipe (Admin) ───────────────────────────
// Body: { title, ingredients, description }
// Returns: { tags: [...], scores: {...} }
router.post('/tag-recipe', protect, adminOnly, (req, res) => {
  proxyJSON(req, res, '/ai/tag-recipe');
});

// ── POST /api/ai/rebuild-index (Admin) ────────────────────────
// Triggers reindexing of all approved recipes in ChromaDB
router.post('/rebuild-index', protect, adminOnly, (req, res) => {
  proxyJSON(req, res, '/ai/rebuild-index');
});

// ── POST /api/ai/retag-all (Admin) ────────────────────────────
// Re-runs BART zero-shot classifier on all approved recipes
router.post('/retag-all', protect, adminOnly, (req, res) => {
  proxyJSON(req, res, '/ai/retag-all');
});

export default router;
