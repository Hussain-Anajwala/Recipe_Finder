// File: /server/controllers/adminController.js

import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const pendingRecipes = await Recipe.countDocuments({ status: 'pending' });
    const approvedRecipes = await Recipe.countDocuments({ status: 'approved' });
    const rejectedRecipes = await Recipe.countDocuments({ status: 'rejected' });

    res.json({
      totalUsers,
      totalRecipes,
      pendingRecipes,
      approvedRecipes,
      rejectedRecipes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all recipe submissions (with optional status filter)
// @route   GET /api/admin/submissions?status=pending
export const getAllSubmissions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const recipes = await Recipe.find(filter)
      .populate('submittedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Approve a recipe
// @route   PUT /api/admin/submissions/:id/approve
export const approveRecipe = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.status = 'approved';
    recipe.reviewedBy = req.user.id; // Admin who approved it
    recipe.adminNotes = adminNotes || '';

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Reject a recipe
// @route   PUT /api/admin/submissions/:id/reject
export const rejectRecipe = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.status = 'rejected';
    recipe.reviewedBy = req.user.id; // Admin who rejected it
    recipe.adminNotes = adminNotes || '';

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single submission (for admin review)
// @route   GET /api/admin/submissions/:id
export const getSingleSubmission = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a user and all their recipes
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin accounts
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin accounts' });
    }

    // Delete all recipes by this user
    await Recipe.deleteMany({ submittedBy: req.params.id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and all their recipes deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a recipe (admin can delete any recipe)
// @route   DELETE /api/admin/recipes/:id
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
