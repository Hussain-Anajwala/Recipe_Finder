import React, { useState, useEffect } from 'react';
import API from '../config/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { toast } from '../utils/toast';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchMyRecipes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await API.get('/api/recipes/my-submissions', getAuthConfig());
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load your recipes');
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId, recipeTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${recipeTitle}"?`)) {
      return;
    }
    try {
      await API.delete(`/api/recipes/${recipeId}`, getAuthConfig());
      toast.success('Recipe deleted successfully!');
      fetchMyRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-[10px] font-label font-bold tracking-widest uppercase border";
    switch (status) {
      case 'approved':
        return <span className={`${base} bg-primary/10 text-primary border-primary/20`}>{status}</span>;
      case 'rejected':
        return <span className={`${base} bg-error/10 text-error border-error/20`}>{status}</span>;
      case 'pending':
        return <span className={`${base} bg-amber-500/10 text-amber-700 border-amber-500/20`}>{status}</span>;
      default:
        return <span className={`${base} bg-surface-container-high text-on-surface-variant border-outline`}>{status}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-surface pt-24 pb-12 px-6 lg:px-12 relative">
      <div className="absolute inset-0 grain-overlay z-[0] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        <header className="mb-12 border-b-2 border-primary/20 pb-8 text-center md:text-left">
          <span className="font-label text-primary tracking-[0.2em] text-xs font-bold block mb-2 uppercase">Your Kitchen</span>
          <h1 className="font-headline tracking-tighter text-5xl md:text-6xl text-on-surface mb-4">My Submissions</h1>
          <p className="font-body text-base text-on-surface-variant max-w-2xl">
            Track the curation status of your personal heirloom recipes. Pending volumes are awaiting review by our editorial board.
          </p>
        </header>

        {recipes.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-outline-variant bg-surface-container-lowest editorial-shadow">
            <h3 className="font-headline text-3xl text-on-surface mb-4">Empty Archives</h3>
            <p className="font-body text-on-surface-variant mb-8 max-w-sm mx-auto">You have not submitted any recipes for curation yet. Begin compiling your legacy.</p>
            <button 
              onClick={() => navigate('/add')}
              className="bg-primary text-on-primary font-label uppercase tracking-widest text-xs font-bold py-4 px-8 rounded-sm hover:-translate-y-1 transition-transform editorial-shadow"
            >
              Author a Recipe
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {recipes.map((recipe) => (
              <article 
                key={recipe._id} 
                className="bg-surface-container-lowest editorial-shadow flex flex-col md:flex-row border-t border-b sm:border border-outline/30 relative"
              >
                {/* Image Section */}
                <div className="w-full md:w-48 lg:w-64 aspect-[4/3] md:aspect-auto md:h-full bg-surface-container-low flex-shrink-0">
                  <img 
                    src={getImageUrl(recipe.imageUrl || recipe.image)} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                    onError={handleImageError}
                  />
                </div>
                
                {/* Content Section */}
                <div className="p-6 md:p-8 flex-1 flex flex-col pt-8 md:pt-8 min-h-[220px]">
                  
                  {/* Status & Date */}
                  <div className="absolute top-6 right-6 md:static md:mb-4 flex flex-col md:flex-row items-end md:items-center justify-between w-full md:w-auto">
                     {getStatusBadge(recipe.status)}
                     <div className="font-technical text-[10px] sm:text-xs text-on-surface-variant uppercase mt-2 md:mt-0 tracking-wider">
                       {new Date(recipe.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                     </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-headline text-3xl text-on-surface mb-2 mt-4 md:mt-0 pr-16 md:pr-0">{recipe.title}</h3>
                  <p className="font-body text-on-surface-variant text-sm line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl">
                    {recipe.description}
                  </p>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-4 font-technical text-xs text-on-surface-variant mb-6 mt-auto">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[1rem]">folder</span> {recipe.category}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[1rem]">schedule</span> {recipe.prepTime + recipe.cookTime}m</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[1rem]">restaurant</span> {recipe.servings} serves</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[1rem]">bar_chart</span> {recipe.difficulty}</span>
                  </div>

                  {/* Admin Notes */}
                  {recipe.adminNotes && (
                    <div className="bg-surface-container pt-3 pb-3 px-4 border-l-2 border-primary mb-6">
                      <strong className="font-label text-xs uppercase tracking-widest text-primary block mb-1">Editorial Note:</strong> 
                      <p className="font-body text-sm text-on-surface italic">{recipe.adminNotes}</p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-outline/30 mt-auto">
                    <button
                      onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                      className="font-label text-xs uppercase tracking-widest text-on-surface hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[1rem]">edit</span> Edit Draft
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe._id, recipe.title)}
                      className="font-label text-xs uppercase tracking-widest text-error hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[1rem]">delete</span> Permanently Delete
                    </button>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyRecipes;
