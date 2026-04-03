import React, { useState } from 'react';
import API from '../config/api';
import { useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';

function AddRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy',
    ingredients: '',
    instructions: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in to create a recipe.');
      navigate('/login');
      return;
    }

    const ingredientsArray = formData.ingredients.split('\n').map(item => item.trim()).filter(item => item);
    const instructionsArray = formData.instructions.split('\n').map(item => item.trim()).filter(item => item);

    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      
      const recipeData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        difficulty: formData.difficulty,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        image: formData.image
      };

      const response = await API.post('/api/recipes/submit', recipeData, config);
      
      console.log('Recipe created successfully:', response.data);
      toast.success('Recipe submitted for review! You can track its status in "My Recipes".');
      navigate('/my-recipes');
    } catch (error) {
      console.error('Error creating recipe:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Could not create recipe. Please try again.';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-6 relative overflow-hidden min-h-screen bg-surface">
      <div className="absolute inset-0 grain-overlay pointer-events-none opacity-50 z-[0]"></div>
      <div className="max-w-[800px] mx-auto relative z-10">
        <div className="mb-12">
          <span className="font-label text-xs tracking-[0.2em] text-primary mb-2 block font-medium">CONTRIBUTE</span>
          <h1 className="text-5xl md:text-6xl font-headline text-on-surface leading-tight tracking-tight">Share a Recipe With the Community</h1>
          <p className="mt-4 text-on-surface-variant font-body max-w-lg leading-relaxed">Your culinary expertise belongs in the world. Use this space to document your process, ingredients, and the story behind the plate.</p>
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
                  <option value="" disabled>Select Category</option>
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
                   placeholder="20" 
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
                   placeholder="45" 
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
                   placeholder="4" 
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
                   placeholder="2 cups All-purpose flour&#10;1 tsp Sea salt&#10;150g Cold butter..." 
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
                   placeholder="1. Sift the flour into a large bowl...&#10;2. Gradually incorporate the cold butter...&#10;3. Chill for 30 minutes before rolling..." 
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
                   placeholder="https://image-library.com/your-recipe-photo" 
                />
              </div>
              <p className="text-[10px] text-outline italic mt-2">Use high-resolution horizontal shots for the best editorial display.</p>
            </div>
            
            <div className="pt-6">
              <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full bg-primary text-on-primary flex justify-center items-center gap-2 py-5 px-8 font-label text-sm tracking-[0.15em] font-bold uppercase transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20" 
              >
                  {isSubmitting ? (
                    <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Submitting...</>
                  ) : 'Submit for Review'}
              </button>
              <p className="text-center mt-6 font-headline italic text-on-surface-variant text-sm">Every recipe is curated by our editors to ensure culinary integrity.</p>
            </div>
          </div>
        </form>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-outline-variant/20 pt-12">
          <div>
            <h3 className="font-headline text-2xl text-on-surface mb-3 italic">The Savour Standard</h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">We value precision in measurements and soul in storytelling. When sharing, think about the texture, the aroma, and the moment the dish is served.</p>
          </div>
          <div className="relative h-48 w-full overflow-hidden rounded-sm">
            <img alt="Kitchen inspiration" className="w-full h-full object-cover grayscale-[0.3] brightness-95" src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"/>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AddRecipe;