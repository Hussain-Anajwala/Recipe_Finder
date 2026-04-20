// File: /server/controllers/recipeController.js

import Recipe from '../models/Recipe.js';
import fetch from 'node-fetch';
import crypto from 'crypto';
import mongoose from 'mongoose';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Helper function to get nutrition data
async function fetchNutrition(title, ingredients) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/guessNutrition?apiKey=${process.env.SPOONACULAR_API_KEY}&title=${encodeURIComponent(title)}`
    );
    if (!response.ok) return generateEstimatedNutrition(ingredients);
    const data = await response.json();
    if (data.calories && data.calories.value) {
      return {
        calories: data.calories.value || 0,
        protein: data.protein?.value || 0,
        fat: data.fat?.value || 0,
        carbs: data.carbs?.value || 0,
      };
    }
    return generateEstimatedNutrition(ingredients);
  } catch (err) {
    console.error('Spoonacular API error:', err.message);
    return generateEstimatedNutrition(ingredients);
  }
}

// Fallback: Generate estimated nutrition based on ingredients count
function generateEstimatedNutrition(ingredients) {
  const ingredientCount = ingredients.length;
  const baseCalories = 150;
  const caloriesPerIngredient = 50;
  const estimatedCalories = baseCalories + (ingredientCount * caloriesPerIngredient);
  return {
    calories: estimatedCalories,
    protein: Math.round(estimatedCalories * 0.15 / 4),
    fat: Math.round(estimatedCalories * 0.30 / 9),
    carbs: Math.round(estimatedCalories * 0.55 / 4),
  };
}

// ── Feature 4: Async AI auto-tagging ─────────────────────────────
// Called after recipe save — does NOT block the response
async function autoTagRecipe(recipeId, title, ingredients, description) {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/ai/tag-recipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, ingredients, description }),
    });
    if (!response.ok) return;
    const { tags, scores } = await response.json();
    if (tags && tags.length > 0) {
      await Recipe.findByIdAndUpdate(recipeId, {
        dietaryTags: tags,
        aiTagConfidence: scores || {},
      });
      console.log(`✅ Auto-tagged recipe ${recipeId}:`, tags);
    }
  } catch (err) {
    // Silently fail — AI service may not be running
    console.warn('AI auto-tagging skipped (service unavailable):', err.message);
  }
}

// @desc    Submit a new recipe for review
// @route   POST /api/recipes/submit
export const submitRecipe = async (req, res) => {
  try {
    const { title, description, ingredients } = req.body;
    const nutrition = await fetchNutrition(title, ingredients);

    const recipe = new Recipe({
      ...req.body,
      submittedBy: req.user.id,
      nutrition,
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);

    // Feature 4: Fire-and-forget async tagging (after response sent)
    autoTagRecipe(createdRecipe._id, title, ingredients, description);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all recipes submitted by the logged-in user
// @route   GET /api/recipes/my-submissions
export const getMySubmissions = async (req, res) => {
  try {
    const recipes = await Recipe.find({ submittedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all APPROVED recipes
// @route   GET /api/recipes
export const getAllApprovedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'approved' })
      .populate('submittedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single APPROVED recipe by ID
// @route   GET /api/recipes/:id
export const getSingleRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName');
    if (recipe && recipe.status === 'approved') {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found or is not approved.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete user's own recipe
// @route   DELETE /api/recipes/:id
export const deleteMyRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own recipes' });
    }
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Edit user's own recipe
// @route   PUT /api/recipes/:id
export const editMyRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own recipes' });
    }

    const { title, description, category, prepTime, cookTime, servings, difficulty, ingredients, instructions, image } = req.body;

    let nutrition = recipe.nutrition;
    if (title !== recipe.title || JSON.stringify(ingredients) !== JSON.stringify(recipe.ingredients)) {
      nutrition = await fetchNutrition(title, ingredients);
    }

    recipe.title = title;
    recipe.description = description;
    recipe.category = category;
    recipe.prepTime = prepTime;
    recipe.cookTime = cookTime;
    recipe.servings = servings;
    recipe.difficulty = difficulty;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.image = image;
    recipe.nutrition = nutrition;

    if (recipe.status === 'rejected') {
      recipe.status = 'pending';
      recipe.adminNotes = '';
      recipe.reviewedBy = null;
      recipe.reviewedAt = null;
    }

    await recipe.save();
    res.json({ message: 'Recipe updated successfully', recipe });

    // Re-tag on significant edit
    autoTagRecipe(recipe._id, title, ingredients, description);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Search recipes by ingredients (Feature 2: pantry match)
// @route   GET /api/recipes/search?ingredients=chicken,tomato
export const searchRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query;

    if (!ingredients) {
      return res.status(400).json({ message: 'Please provide ingredients to search' });
    }

    const searchIngredients = ingredients
      .split(',')
      .map(ing => ing.trim().toLowerCase())
      .filter(ing => ing.length > 0);

    if (searchIngredients.length === 0) {
      return res.status(400).json({ message: 'Please provide valid ingredients' });
    }

    console.log('[search] searchIngredients:', searchIngredients);

    // Escape regex special characters in each ingredient, then join with |
    // This prevents characters like '(' or '+' from breaking the whole query
    const escapedPattern = searchIngredients
      .map(i => i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');

    // Find approved recipes that contain ANY of the searched ingredients
    const recipes = await Recipe.find({
      status: 'approved',
      ingredients: {
        $elemMatch: {
          $regex: escapedPattern,
          $options: 'i'
        }
      }
    })
    .populate('submittedBy', 'firstName lastName')
    .sort({ createdAt: -1 });

    console.log('[search] DB candidates returned:', recipes.length);

    // Calculate match scores for every candidate
    const recipesWithScore = recipes.map(recipe => {
      const recipeIngs = recipe.ingredients;
      let matchCount = 0;

      recipeIngs.forEach(recipeIng => {
        const hasMatch = searchIngredients.some(searchIng =>
          recipeIng.toLowerCase().includes(searchIng)
        );
        if (hasMatch) matchCount++;
      });

      // Score A: how much of this recipe can the user make?
      const matchPercentage = Math.round((matchCount / recipeIngs.length) * 100);

      // Score B: how many of the user's pantry items does this recipe use?
      const pantryUtilization = Math.round((matchCount / searchIngredients.length) * 100);

      return {
        ...recipe.toObject(),
        matchScore: matchCount,
        matchPercentage,
        pantryUtilization,
        totalIngredients: recipeIngs.length,
      };
    });

    // Return ALL matches — no threshold filter, sort best coverage first
    recipesWithScore.sort((a, b) => b.matchPercentage - a.matchPercentage);

    console.log('[search] results after scoring:', recipesWithScore.length);

    res.json({
      searchedIngredients: searchIngredients,
      totalResults: recipesWithScore.length,
      recipes: recipesWithScore,
    });

  } catch (error) {
    console.error('[searchRecipesByIngredients]', error.stack);
    res.status(500).json({ error: error.message });
  }
};

// ── Feature 4 (Ethics): Report an incorrect dietary tag ──────────
// @desc    Report an incorrect AI-generated tag
// @route   POST /api/recipes/:id/report-tag
export const reportTag = async (req, res) => {
  try {
    const { reportedTag, suggestedCorrection } = req.body;
    const recipeId = req.params.id;

    if (!reportedTag) {
      return res.status(400).json({ message: 'reportedTag is required' });
    }

    // Store in raw MongoDB collection (no Mongoose model needed)
    const db = mongoose.connection.db;
    await db.collection('tag_reports').insertOne({
      recipeId: new mongoose.Types.ObjectId(recipeId),
      userId: new mongoose.Types.ObjectId(req.user.id),
      reportedTag,
      suggestedCorrection: suggestedCorrection || null,
      createdAt: new Date(),
      resolved: false,
    });

    res.status(201).json({ message: 'Thank you — your report has been submitted for admin review.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
