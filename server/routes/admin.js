// File: /server/routes/admin.js

import express from 'express';
import {
  getDashboardStats,
  getAllSubmissions,
  getSingleSubmission,
  approveRecipe,
  rejectRecipe,
  getAllUsers,
  deleteUser,
  deleteRecipe
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require both authentication AND admin role
router.use(protect, adminOnly);

// Admin dashboard statistics
router.get('/stats', getDashboardStats);

// Get all submissions (with optional status filter)
router.get('/submissions', getAllSubmissions);

// Get single submission for review
router.get('/submissions/:id', getSingleSubmission);

// Approve a recipe
router.put('/submissions/:id/approve', approveRecipe);

// Reject a recipe
router.put('/submissions/:id/reject', rejectRecipe);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Recipe management
router.delete('/recipes/:id', deleteRecipe);

export default router;
