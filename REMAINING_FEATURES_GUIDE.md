# Remaining Features Implementation Guide

## ✅ COMPLETED SO FAR (4/9):
1. ✅ Recipe Editing
2. ✅ Category Filters  
3. ⏳ Better Error Handling (Toast utility created, partially implemented)
4. ✅ User Profile Edit

---

## 🔄 IN PROGRESS: Feature 5 - Favorites System

### Backend Implementation:

#### 1. Create Favorites Controller (`server/controllers/favoritesController.js`):

```javascript
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

// @desc    Add recipe to favorites
// @route   POST /api/favorites/:recipeId
export const addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe || recipe.status !== 'approved') {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (user.favorites.includes(req.params.recipeId)) {
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    user.favorites.push(req.params.recipeId);
    await user.save();

    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Remove recipe from favorites
// @route   DELETE /api/favorites/:recipeId
export const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.recipeId
    );

    await user.save();

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user's favorite recipes
// @route   GET /api/favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favorites',
        match: { status: 'approved' },
        populate: { path: 'submittedBy', select: 'firstName lastName' }
      });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Check if recipe is favorited
// @route   GET /api/favorites/check/:recipeId
export const checkFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isFavorited = user.favorites.includes(req.params.recipeId);
    res.json({ isFavorited });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### 2. Create Favorites Routes (`server/routes/favorites.js`):

```javascript
import express from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite
} from '../controllers/favoritesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getFavorites);
router.get('/check/:recipeId', checkFavorite);
router.post('/:recipeId', addToFavorites);
router.delete('/:recipeId', removeFromFavorites);

export default router;
```

#### 3. Add to `server/index.js`:

```javascript
import favoritesRoutes from "./routes/favorites.js";

// Add this line with other routes
app.use("/api/favorites", favoritesRoutes);
```

### Frontend Implementation:

#### 1. Create Favorites Component (`client/src/components/Favorites.js`):

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { 'Authorization': `Bearer ${token}` }
    };
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites', getAuthConfig());
      setFavorites(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const handleRemove = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${recipeId}`, getAuthConfig());
      setFavorites(favorites.filter(recipe => recipe._id !== recipeId));
      alert('Removed from favorites');
    } catch (error) {
      alert('Failed to remove from favorites');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>My Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorite recipes yet. Start adding some!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
          {favorites.map(recipe => (
            <div key={recipe._id} style={{ background: 'white', borderRadius: '8px', padding: '20px' }}>
              {recipe.image && <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />}
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <button onClick={() => handleRemove(recipe._id)} style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
```

#### 2. Add Favorite Button to RecipeList Modal:

In `RecipeList.js`, add this inside the modal where recipe details are shown:

```javascript
const [isFavorited, setIsFavorited] = useState(false);

// Check if favorited when recipe is selected
useEffect(() => {
  if (selectedRecipe) {
    checkIfFavorited(selectedRecipe._id);
  }
}, [selectedRecipe]);

const checkIfFavorited = async (recipeId) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await axios.get(`http://localhost:5000/api/favorites/check/${recipeId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setIsFavorited(response.data.isFavorited);
  } catch (error) {
    console.error('Error checking favorite:', error);
  }
};

const toggleFavorite = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to save favorites');
    return;
  }

  try {
    if (isFavorited) {
      await axios.delete(`http://localhost:5000/api/favorites/${selectedRecipe._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsFavorited(false);
      alert('Removed from favorites');
    } else {
      await axios.post(`http://localhost:5000/api/favorites/${selectedRecipe._id}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsFavorited(true);
      alert('Added to favorites');
    }
  } catch (error) {
    alert('Failed to update favorites');
  }
};

// Add this button in the modal:
<button onClick={toggleFavorite} style={{ padding: '10px 20px', background: isFavorited ? '#e74c3c' : '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
  {isFavorited ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
</button>
```

#### 3. Add Route in `App.js`:

```javascript
import Favorites from "./components/Favorites";

<Route path="/favorites" element={<Favorites />} />
```

#### 4. Add Link in `Navbar.js`:

```javascript
<Link to="/favorites" style={{ color: "white", textDecoration: "none" }}>Favorites</Link>
```

---

## 📋 REMAINING FEATURES TO IMPLEMENT:

### Feature 6: Responsive Design
- Add media queries to all components
- Implement hamburger menu for mobile navbar
- Make recipe cards responsive
- Optimize forms for mobile

### Feature 7: Ratings & Reviews
- Add rating field to Recipe model
- Create reviews collection
- Implement star rating component
- Display average rating
- Add review submission form

### Feature 8: Advanced Search
- Add search by recipe name
- Combine multiple filters
- Add sorting options (newest, highest rated)
- Implement search history

### Feature 9: Email Notifications
- Install nodemailer
- Create email templates
- Send approval/rejection emails
- Implement password reset emails

---

## 🚀 TESTING CHECKLIST

### Recipe Editing:
- [ ] Edit recipe and verify changes save
- [ ] Check nutrition recalculates
- [ ] Verify rejected recipes reset to pending

### Category Filters:
- [ ] Filter by each category
- [ ] Filter by difficulty
- [ ] Combine filters
- [ ] Clear filters button works

### User Profile:
- [ ] Update name and email
- [ ] Change password
- [ ] Verify username cannot be changed

### Favorites (Once Implemented):
- [ ] Add recipe to favorites
- [ ] View favorites page
- [ ] Remove from favorites
- [ ] Check favorite button state

---

## 📝 NOTES

- **Restart backend server** after any backend changes
- **Clear browser cache** if you see old data
- **Check console** for any errors
- All features use JWT authentication
- Toast notifications are available in `/utils/toast.js`

---

Last Updated: 2025-10-01 03:40 AM
