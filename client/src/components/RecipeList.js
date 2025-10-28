import React, { useState, useEffect } from 'react';
import API from '../config/api';
import { toast } from '../utils/toast';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchIngredients, setSearchIngredients] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchRecipes();
    
    // Add scroll listener for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await API.get('/api/recipes');
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      toast.error('Failed to load recipes. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchIngredients.trim()) {
      toast.warning('Please enter at least one ingredient');
      return;
    }

    setIsSearching(true);
    try {
      const response = await API.get(`/api/recipes/search?ingredients=${encodeURIComponent(searchIngredients)}`);
      setSearchResults(response.data);
      setIsSearching(false);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchIngredients('');
    setSearchResults(null);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading recipes...</div>;
  }

  // Filter recipes by category and difficulty
  const getFilteredRecipes = () => {
    let filtered = searchResults ? searchResults.recipes : recipes;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }
    
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }
    
    return filtered;
  };

  const displayRecipes = getFilteredRecipes();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }} className="responsive-container">
      <style>{`
        @media screen and (max-width: 768px) {
          .responsive-container {
            padding: 20px 15px !important;
          }

          /* Search bar responsive */
          .search-header {
            flex-direction: column !important;
            gap: 20px !important;
          }

          .search-title {
            font-size: 24px !important;
          }

          .search-form {
            width: 100% !important;
          }

          .search-input {
            width: 100% !important;
          }

          /* Filter bar responsive */
          .filter-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 15px !important;
          }

          .filter-group {
            width: 100%;
          }

          .filter-group select {
            width: 100% !important;
          }

          /* Recipe grid responsive */
          .recipe-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          /* Recipe card metadata */
          .recipe-meta {
            font-size: 12px !important;
          }

          /* Nutrition grid */
          .nutrition-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          /* Modal responsive */
          .recipe-modal {
            padding: 20px !important;
          }

          .modal-meta {
            flex-wrap: wrap !important;
            gap: 10px !important;
            font-size: 13px !important;
          }

          .nutrition-grid-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media screen and (max-width: 480px) {
          .responsive-container {
            padding: 15px 10px !important;
          }

          .search-title {
            font-size: 20px !important;
          }

          .recipe-meta {
            flex-direction: column !important;
          }

          .nutrition-grid-mobile {
            grid-template-columns: 1fr !important;
          }

          .nutrition-grid-4 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      {/* Header with Search Bar */}
      <div className="search-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 className="search-title" style={{ margin: 0, fontSize: '32px', color: '#2c3e50' }}>Recipe Gallery</h1>
          {searchResults && (
            <p style={{ margin: '5px 0 0 0', color: '#70757a', fontSize: '14px' }}>
              {searchResults.totalResults} results for: <strong>{searchResults.searchedIngredients.join(', ')}</strong>
              <button
                onClick={clearSearch}
                style={{
                  marginLeft: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#3498db',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                Clear
              </button>
            </p>
          )}
        </div>

        {/* Compact Search Bar - Top Right */}
        <form className="search-form" onSubmit={handleSearch}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '25px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              paddingLeft: '15px',
              flex: 1
            }}>
              <span style={{ fontSize: '16px', color: '#95a5a6', marginRight: '8px' }}>🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Enter ingredients (e.g., chicken, tomato)..."
                value={searchIngredients}
                onChange={(e) => setSearchIngredients(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  padding: '10px 0',
                  width: '280px',
                  background: 'transparent'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSearching ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Filters:</span>
        
        <div className="filter-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', color: '#7f8c8d' }}>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            <option value="All">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
            <option value="Snack">Snack</option>
            <option value="Beverage">Beverage</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', color: '#7f8c8d' }}>Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {(selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            style={{
              padding: '8px 16px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            Clear Filters
          </button>
        )}

        <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#7f8c8d' }}>
          Showing {displayRecipes.length} recipe(s)
        </div>
      </div>

      {displayRecipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#ecf0f1', borderRadius: '8px' }}>
          <h3>No recipes available yet</h3>
          <p>Be the first to submit a recipe!</p>
        </div>
      ) : (
        <div className="recipe-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
          {displayRecipes.map((recipe) => (
            <div 
              key={recipe._id} 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedRecipe(recipe)}
            >
              {recipe.image && (
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div style={{ padding: '20px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#2c3e50' }}>{recipe.title}</h3>
                <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '15px' }}>
                  {recipe.description}
                </p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                  {recipe.matchPercentage && (
                    <span style={{ padding: '4px 10px', background: '#27ae60', color: 'white', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      ✓ {recipe.matchPercentage}% Match
                    </span>
                  )}
                  <span style={{ padding: '4px 10px', background: '#e8f4f8', color: '#3498db', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                    {recipe.category}
                  </span>
                  <span style={{ padding: '4px 10px', background: '#fef5e7', color: '#f39c12', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                    {recipe.difficulty}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#95a5a6' }}>
                  <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                  <span>🍽️ {recipe.servings} servings</span>
                </div>

                {recipe.nutrition && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ecf0f1', display: 'flex', justifyContent: 'space-around', fontSize: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#e74c3c' }}>{recipe.nutrition.calories.toFixed(0)}</div>
                      <div style={{ color: '#95a5a6' }}>Calories</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#3498db' }}>{recipe.nutrition.protein.toFixed(0)}g</div>
                      <div style={{ color: '#95a5a6' }}>Protein</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#f39c12' }}>{recipe.nutrition.carbs.toFixed(0)}g</div>
                      <div style={{ color: '#95a5a6' }}>Carbs</div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '15px', fontSize: '12px', color: '#95a5a6' }}>
                  By {recipe.submittedBy?.firstName} {recipe.submittedBy?.lastName}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedRecipe(null)}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto', padding: '40px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedRecipe(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>

            {selectedRecipe.image && (
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title}
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}

            <h2 style={{ marginTop: 0, marginBottom: '15px' }}>{selectedRecipe.title}</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>{selectedRecipe.description}</p>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '14px' }}>
              <span>📁 {selectedRecipe.category}</span>
              <span>⏱️ Prep: {selectedRecipe.prepTime}m</span>
              <span>🔥 Cook: {selectedRecipe.cookTime}m</span>
              <span>🍽️ {selectedRecipe.servings} servings</span>
              <span>📊 {selectedRecipe.difficulty}</span>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3>Ingredients</h3>
              <ul style={{ paddingLeft: '20px' }}>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{ing}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3>Instructions</h3>
              <ol style={{ paddingLeft: '20px' }}>
                {selectedRecipe.instructions.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '12px', lineHeight: '1.6' }}>{step}</li>
                ))}
              </ol>
            </div>

            {selectedRecipe.nutrition && (
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0 }}>Nutrition Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{selectedRecipe.nutrition.calories.toFixed(0)}</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Calories</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>{selectedRecipe.nutrition.protein.toFixed(0)}g</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Protein</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>{selectedRecipe.nutrition.carbs.toFixed(0)}g</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Carbs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>{selectedRecipe.nutrition.fat.toFixed(0)}g</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Fat</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ fontSize: '14px', color: '#95a5a6', borderTop: '1px solid #ecf0f1', paddingTop: '15px' }}>
              Submitted by <strong>{selectedRecipe.submittedBy?.firstName} {selectedRecipe.submittedBy?.lastName}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#3498db',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          title="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default RecipeList;
