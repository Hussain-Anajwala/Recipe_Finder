import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../config/api';
import { toast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Breakfast',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy',
    ingredients: '',
    instructions: '',
    image: ''
  });

  useEffect(() => {
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  const fetchRecipe = async () => {
    try {
      const response = await API.get(`/api/recipes/my-submissions`, getAuthConfig());
      const recipe = response.data.find(r => r._id === id);
      
      if (!recipe) {
        toast.error('Recipe not found');
        navigate('/my-recipes');
        return;
      }

      setFormData({
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients.join('\n'),
        instructions: recipe.instructions.join('\n'),
        image: recipe.image || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast.error('Failed to load recipe');
      navigate('/my-recipes');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ingredientsArray = formData.ingredients.split('\n').map(item => item.trim()).filter(item => item.length > 0);
    const instructionsArray = formData.instructions.split('\n').map(item => item.trim()).filter(item => item.length > 0);

    const recipeData = {
      ...formData,
      prepTime: parseInt(formData.prepTime),
      cookTime: parseInt(formData.cookTime),
      servings: parseInt(formData.servings),
      ingredients: ingredientsArray,
      instructions: instructionsArray
    };

    try {
      await API.put(`/api/recipes/${id}`, recipeData, getAuthConfig());
      toast.success('Recipe updated successfully!');
      navigate('/my-recipes');
    } catch (error) {
      console.error('Error updating recipe:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update recipe. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="pt-32 pb-24 px-6 relative overflow-hidden min-h-screen bg-surface">
      <div className="absolute inset-0 grain-overlay pointer-events-none opacity-50 z-[0]"></div>
      <div className="max-w-[800px] mx-auto relative z-10">
        <div className="mb-12">
          <span className="font-label text-xs tracking-[0.2em] text-primary mb-2 block font-medium">REVISE</span>
          <h1 className="text-5xl md:text-6xl font-headline text-on-surface leading-tight tracking-tight">Refine Your Recipe</h1>
          <p className="mt-4 text-on-surface-variant font-body max-w-lg leading-relaxed">Continuous improvement is the mark of a great chef. Make your adjustments and update your archive.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest shadow-[0px_20px_40px_rgba(88,65,60,0.08)] p-8 md:p-12 border border-outline-variant/10">
          <div className="space-y-10">
            <div>
              <label htmlFor="title" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">Recipe Title</label>
              <input 
                 type="text" 
                 id="title" 
                 name="title" 
                 value={formData.title} 
                 onChange={handleChange} 
                 required
                 className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 text-2xl font-headline placeholder:text-surface-variant italic" 
                 placeholder="e.g. Heirloom Tomato &amp; Basil Galette" 
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">Description &amp; Story</label>
              <textarea 
                 id="description" 
                 name="description" 
                 value={formData.description} 
                 onChange={handleChange} 
                 required
                 className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body placeholder:text-surface-variant resize-none" 
                 placeholder="Briefly describe the flavor profile, origin, or why this recipe matters to you..." 
                 rows="3"
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="category" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">Category</label>
                <select 
                   id="category" 
                   name="category" 
                   value={formData.category} 
                   onChange={handleChange} 
                   required
                   className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body cursor-pointer"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snack">Snack</option>
                  <option value="Beverage">Beverage</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">Difficulty Level</label>
                <select 
                   id="difficulty" 
                   name="difficulty" 
                   value={formData.difficulty} 
                   onChange={handleChange} 
                   required
                   className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body cursor-pointer"
                >
                  <option value="Easy">Beginner (Easy)</option>
                  <option value="Medium">Intermediate</option>
                  <option value="Hard">Advanced Chef (Hard)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div>
                <label htmlFor="prepTime" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">Prep Time (min)</label>
                <input 
                   type="number" 
                   id="prepTime" 
                   name="prepTime" 
                   value={formData.prepTime} 
                   onChange={handleChange} 
                   required min="0"
                   className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body placeholder:text-surface-variant" 
                />
              </div>
              <div>
                <label htmlFor="cookTime" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">Cook Time (min)</label>
                <input 
                   type="number" 
                   id="cookTime" 
                   name="cookTime" 
                   value={formData.cookTime} 
                   onChange={handleChange} 
                   required min="0"
                   className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body placeholder:text-surface-variant" 
                />
              </div>
              <div>
                <label htmlFor="servings" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">Servings</label>
                <input 
                   type="number" 
                   id="servings" 
                   name="servings" 
                   value={formData.servings} 
                   onChange={handleChange} 
                   required min="1"
                   className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary transition-colors py-3 font-body placeholder:text-surface-variant" 
                />
              </div>
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-sm">
              <label htmlFor="ingredients" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-4">Ingredients (One per line)</label>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-outline-variant select-none pt-1">edit_note</span>
                <textarea 
                   id="ingredients" 
                   name="ingredients" 
                   value={formData.ingredients} 
                   onChange={handleChange} 
                   required
                   className="w-full bg-transparent border-none focus:ring-0 font-technical text-sm leading-relaxed text-on-surface-variant placeholder:text-outline-variant/50 resize-none" 
                   rows="6"
                 ></textarea>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-sm">
              <label htmlFor="instructions" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-4">Method &amp; Preparation (One step per line)</label>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-outline-variant select-none pt-1">format_list_numbered</span>
                <textarea 
                   id="instructions" 
                   name="instructions" 
                   value={formData.instructions} 
                   onChange={handleChange} 
                   required
                   className="w-full bg-transparent border-none focus:ring-0 font-technical text-sm leading-relaxed text-on-surface-variant placeholder:text-outline-variant/50 resize-none" 
                   rows="8"
                 ></textarea>
              </div>
            </div>
            
            <div>
              <label htmlFor="image" className="block font-label text-[10px] tracking-[0.15em] font-semibold text-outline uppercase mb-3">Recipe Hero Image URL</label>
              <div className="flex items-center gap-3 border-b border-outline pb-2 group focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-outline group-focus-within:text-primary">add_photo_alternate</span>
                <input 
                   type="url" 
                   id="image" 
                   name="image" 
                   value={formData.image} 
                   onChange={handleChange}
                   className="w-full bg-transparent border-0 focus:ring-0 py-1 font-body text-sm placeholder:text-surface-variant" 
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="flex-1 bg-primary text-on-primary flex justify-center items-center gap-2 py-5 px-8 font-label text-sm tracking-[0.15em] font-bold uppercase transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20" 
              >
                  {isSubmitting ? (
                    <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Updating...</>
                  ) : 'Update Archive'}
              </button>
              <button
                type="button" 
                onClick={() => navigate('/my-recipes')}
                className="flex-[0.5] bg-surface text-on-surface border border-outline flex justify-center items-center gap-2 py-5 px-8 font-label text-sm tracking-[0.15em] font-bold uppercase transition-all hover:bg-surface-container active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditRecipe;
