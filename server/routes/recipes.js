// File: /server/routes/recipes.js

import express from 'express';
import { 
  submitRecipe, 
  getMySubmissions, 
  getAllApprovedRecipes,
  getSingleRecipe,
  deleteMyRecipe,
  editMyRecipe,
  searchRecipesByIngredients,
  reportTag,
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- PROTECTED USER ROUTES (Requires login) ---
// IMPORTANT: Specific routes must come before parameterized routes
router.post('/submit', protect, submitRecipe);
router.get('/my-submissions', protect, getMySubmissions);
router.put('/:id', protect, editMyRecipe);
router.delete('/:id', protect, deleteMyRecipe);

// Feature 4 (Ethics): Report an incorrect dietary tag
router.post('/:id/report-tag', protect, reportTag);

// --- PUBLIC ROUTES (No 'protect' middleware) ---
// Search route must come before /:id to avoid conflicts
router.get('/search', searchRecipesByIngredients);
router.get('/', getAllApprovedRecipes);
router.get('/:id', getSingleRecipe);

export default router;