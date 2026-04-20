import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const STATUS_STYLES = {
  pending: 'bg-tertiary-container/50 text-on-tertiary-container',
  approved: 'bg-secondary-container/60 text-on-secondary-container',
  rejected: 'bg-error-container text-on-error-container',
};

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    axios.get('/api/recipes/my-submissions')
      .then(({ data }) => setRecipes(data))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/recipes/${id}`);
      setRecipes(prev => prev.filter(r => r._id !== id));
    } catch {
      alert('Failed to delete recipe.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="font-headline text-4xl text-on-surface mb-1">My Recipes</h1>
            <p className="text-on-surface-variant text-sm">Recipes you've submitted to the Savour community.</p>
          </div>
          <Link to="/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded text-sm font-medium hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            New Recipe
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-surface-container-low border border-outline-variant rounded-lg p-5 flex gap-4">
                <div className="w-20 h-20 bg-surface-container-high rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-surface-container-high rounded w-1/2" />
                  <div className="h-4 bg-surface-container-high rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '48px' }}>inbox</span>
            <h2 className="font-headline text-2xl text-on-surface mt-4 mb-2">No recipes yet</h2>
            <p className="text-on-surface-variant text-sm mb-6">Share your first recipe with the community.</p>
            <Link to="/add" className="px-6 py-2.5 bg-primary text-on-primary rounded text-sm font-medium hover:bg-primary-container transition-colors">
              Submit a Recipe
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recipes.map(recipe => (
              <article key={recipe._id} className="bg-surface-container-low border border-outline-variant rounded-lg p-5 flex gap-4 items-start">
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-surface-container-high rounded overflow-hidden flex-shrink-0">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline" style={{ fontSize: '24px' }}>restaurant</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-headline text-xl text-on-surface">{recipe.title}</h3>
                    <span className={`font-technical text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[recipe.status] || ''}`}>
                      {recipe.status}
                    </span>
                  </div>

                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-2">{recipe.description}</p>

                  {/* Dietary tags */}
                  {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {recipe.dietaryTags.map(tag => (
                        <span key={tag} className="font-technical text-xs px-2 py-0.5 bg-secondary-container/40 text-on-secondary-container rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {recipe.status === 'rejected' && recipe.adminNotes && (
                    <p className="font-technical text-xs text-error mt-1">
                      Admin note: {recipe.adminNotes}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Link to={`/edit-recipe/${recipe._id}`}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface-variant rounded transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe._id, recipe.title)}
                      disabled={deleting === recipe._id}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-outline-variant text-on-surface-variant hover:text-error hover:border-error rounded transition-colors disabled:opacity-50"
                      aria-label={`Delete ${recipe.title}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                      {deleting === recipe._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;
