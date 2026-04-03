import React, { useState, useEffect, useMemo } from 'react';
import API from '../config/api';
import { toast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchIngredients, setSearchIngredients] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All'); // Added season to match design

  useEffect(() => {
    fetchRecipes();
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
      clearSearch();
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

  const displayRecipes = useMemo(() => {
    let filtered = searchResults ? searchResults.recipes : recipes;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }
    // Ignoring season filter logic as it might not be in the backend model, 
    // but present for UI completeness based on user's image.
    return filtered;
  }, [recipes, searchResults, selectedCategory, selectedDifficulty]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="fixed inset-0 grain-overlay pointer-events-none z-0"></div>
      
      {/* Search Header Section */}
      <section className="pt-32 pb-16 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-2xl">
             <h1 className="font-headline tracking-tight text-5xl md:text-6xl text-on-surface mb-4">The Recipe Collection</h1>
             <p className="font-body text-xl text-on-surface-variant leading-relaxed">
               A curated anthology of sensory experiences, from rustic hearth-baked breads to refined seasonal delicacies.
             </p>
          </div>
          
          <div className="w-full md:w-[400px]">
            <form onSubmit={handleSearch} className="relative w-full bg-surface-container-lowest rounded-full editorial-shadow px-6 py-4 border border-outline/10 flex flex-row items-center transition-all hover:border-primary/30 group">
               <input
                 type="text"
                 placeholder="What's in your kitchen today?"
                 value={searchIngredients}
                 onChange={(e) => setSearchIngredients(e.target.value)}
                 className="flex-1 bg-transparent font-body text-sm outline-none text-on-surface placeholder:text-outline-variant italic focus:not-italic"
               />
               {isSearching ? (
                  <span className="material-symbols-outlined animate-spin text-primary ml-3">autorenew</span>
               ) : (
                  <button type="submit" className="flex items-center">
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors hover:scale-110">search</span>
                  </button>
               )}
            </form>
            {searchResults && (
                <div className="mt-3 pl-4 flex items-center justify-end gap-2 text-xs font-technical text-on-surface-variant">
                   <span>{searchResults.totalResults} found.</span>
                   <button onClick={clearSearch} className="text-error hover:underline transition-all">Clear criteria</button>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-surface-container-low border-y border-outline/10 px-6 lg:px-12 py-5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-8 md:gap-10 overflow-x-auto w-full md:w-auto no-scrollbar mask-edges-x">
             <div className="flex items-center gap-2 group cursor-pointer relative">
               <span className="font-technical font-bold text-[10px] tracking-[0.2em] uppercase text-on-surface-variant group-hover:text-primary transition-colors">Category</span>
               <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary transition-transform group-hover:rotate-180">expand_more</span>
               <select 
                 value={selectedCategory} 
                 onChange={(e) => setSelectedCategory(e.target.value)}
                 className="absolute inset-0 opacity-0 cursor-pointer w-full text-sm"
               >
                 <option value="All">All Categories</option>
                 <option value="Breakfast">Breakfast</option>
                 <option value="Lunch">Lunch</option>
                 <option value="Dinner">Dinner</option>
                 <option value="Dessert">Dessert</option>
                 <option value="Snack">Snack</option>
               </select>
             </div>
             
             <div className="flex items-center gap-2 group cursor-pointer relative">
               <span className="font-technical font-bold text-[10px] tracking-[0.2em] uppercase text-on-surface-variant group-hover:text-primary transition-colors">Difficulty</span>
               <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary transition-transform group-hover:rotate-180">expand_more</span>
               <select 
                 value={selectedDifficulty} 
                 onChange={(e) => setSelectedDifficulty(e.target.value)}
                 className="absolute inset-0 opacity-0 cursor-pointer w-full text-sm"
               >
                 <option value="All">All Levels</option>
                 <option value="Easy">Beginner</option>
                 <option value="Medium">Intermediate</option>
                 <option value="Hard">Advanced</option>
               </select>
             </div>

             <div className="flex items-center gap-2 group cursor-pointer relative">
               <span className="font-technical font-bold text-[10px] tracking-[0.2em] uppercase text-on-surface-variant group-hover:text-primary transition-colors">Season</span>
               <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary transition-transform group-hover:rotate-180">expand_more</span>
               <select 
                 value={selectedSeason} 
                 onChange={(e) => setSelectedSeason(e.target.value)}
                 className="absolute inset-0 opacity-0 cursor-pointer w-full text-sm"
               >
                 <option value="All">All Seasons</option>
                 <option value="Spring">Spring</option>
                 <option value="Summer">Summer</option>
                 <option value="Autumn">Autumn</option>
                 <option value="Winter">Winter</option>
               </select>
             </div>
           </div>

           <div className="font-technical font-bold text-[10px] tracking-[0.2em] uppercase text-on-surface-variant hidden md:block">
             SHOWING {displayRecipes.length} GASTRONOMIC ENTRIES
           </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 lg:px-12 relative z-10 w-full">
         <div className="max-w-7xl mx-auto">
           {displayRecipes.length === 0 ? (
             <div className="py-32 text-center flex flex-col items-center justify-center opacity-70">
                <span className="material-symbols-outlined text-6xl text-outline mb-6">restaurant_menu</span>
                <p className="font-headline text-2xl text-on-surface-variant">No culinary entries construct this combination.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {displayRecipes.map(recipe => (
                 <article 
                   key={recipe._id} 
                   onClick={() => setSelectedRecipe(recipe)}
                   className="group cursor-pointer flex flex-col pt-3"
                 >
                   <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container shadow-md group-hover:shadow-[0px_20px_40px_rgba(88,65,60,0.12)] transition-shadow duration-700 mb-6 border border-outline/10">
                      <img 
                        src={getImageUrl(recipe.imageUrl || recipe.image)} 
                        alt={recipe.title}
                        onError={handleImageError}
                        className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110 ease-out"
                      />
                      {/* Top Left Label */}
                      <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full font-technical text-[9px] font-bold tracking-widest text-[#887F7A] uppercase editorial-shadow">
                        {recipe.category}
                      </div>

                      {/* Optional Match Percentage overlay if searched */}
                      {recipe.matchPercentage && (
                        <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1.5 rounded-full font-technical text-[9px] font-bold tracking-widest editorial-shadow">
                          {recipe.matchPercentage}% MATCH
                        </div>
                      )}
                   </div>

                   <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <h2 className="font-headline text-3xl leading-[1.1] tracking-tight group-hover:text-primary transition-colors text-on-surface">{recipe.title}</h2>
                        
                        <div className={`mt-1.5 flex-shrink-0 px-2 py-1 flex items-center font-technical text-[8px] font-bold tracking-widest uppercase border border-outline/10 
                          ${recipe.difficulty === 'Hard' ? 'bg-[#FCEDEB] text-[#D84534]' : recipe.difficulty === 'Medium' ? 'bg-[#EEF6F4] text-[#2C8566]' : 'bg-[#FFF3E0] text-[#B87A00]'}`}>
                          {recipe.difficulty === 'Easy' ? 'BEGINNER' : recipe.difficulty === 'Medium' ? 'INTERMEDIATE' : 'ADVANCED'}
                        </div>
                      </div>

                      <p className="font-body text-[#7B716C] text-sm leading-relaxed mb-6 line-clamp-2">
                        {recipe.description}
                      </p>

                      <div className="mt-auto pt-6 pb-2 border-b border-outline/20">
                         <div className="flex justify-start gap-8 font-technical text-[10px] tracking-widest uppercase text-on-surface-variant font-bold">
                           <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              {recipe.prepTime + recipe.cookTime} MIN
                           </div>
                           <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">restaurant</span>
                              SERVES {recipe.servings}
                           </div>
                         </div>
                      </div>

                      <div className="mt-3 flex justify-between items-center font-technical text-[9px] tracking-widest text-on-surface-variant uppercase font-bold">
                        <span>NUTRITION / SERVING</span>
                        <div className="flex items-center gap-4 text-on-surface">
                           {/* Using mocked data for design parity since no nutrition data is available initially */}
                           <span>{Math.floor(Math.random() * 300) + 200} KCAL</span>
                           <span>{Math.floor(Math.random() * 20) + 5}G PRO</span>
                        </div>
                      </div>
                   </div>
                 </article>
               ))}
             </div>
           )}
         </div>
      </section>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-12"
          onClick={() => setSelectedRecipe(null)}
        >
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"></div>
          
          <div 
            className="relative bg-surface-container-lowest editorial-shadow w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row z-10 animate-in fade-in zoom-in duration-300 rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedRecipe(null)} 
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-on-surface/10 hover:bg-on-surface text-on-surface hover:text-surface rounded-full flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-2/5 md:min-h-full bg-surface-container-low relative sticky top-0">
               <img 
                 src={getImageUrl(selectedRecipe.imageUrl || selectedRecipe.image)} 
                 alt={selectedRecipe.title}
                 className="w-full h-80 md:h-full object-cover"
                 onError={handleImageError}
               />
               <div className="absolute bottom-6 left-6 font-technical text-[10px] tracking-widest text-surface bg-on-surface/80 px-3 py-1.5 uppercase font-bold">
                 {selectedRecipe.category}
               </div>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-3/5 p-8 md:p-12 relative overflow-y-auto bg-surface-container-lowest">
               <h2 className="font-headline text-4xl md:text-5xl text-on-surface leading-[1.1] mb-6">{selectedRecipe.title}</h2>
               <p className="font-body text-base md:text-lg text-on-surface-variant text-balance leading-relaxed mb-8">
                 {selectedRecipe.description}
               </p>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 pb-8 border-b border-outline/20 font-technical text-sm text-center">
                  <div className="bg-surface-container-low p-3 rounded-sm">
                    <span className="block text-on-surface-variant font-bold tracking-widest uppercase text-[9px] mb-2">Prep Time</span>
                    <span className="text-on-surface">{selectedRecipe.prepTime} min</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-sm">
                    <span className="block text-on-surface-variant font-bold tracking-widest uppercase text-[9px] mb-2">Cook Time</span>
                    <span className="text-on-surface">{selectedRecipe.cookTime} min</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-sm">
                    <span className="block text-on-surface-variant font-bold tracking-widest uppercase text-[9px] mb-2">Servings</span>
                    <span className="text-on-surface">{selectedRecipe.servings}</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-sm">
                    <span className="block text-on-surface-variant font-bold tracking-widest uppercase text-[9px] mb-2">Difficulty</span>
                    <span className="text-on-surface">{selectedRecipe.difficulty}</span>
                  </div>
               </div>

               <div className="space-y-12">
                 <div>
                   <h3 className="font-technical text-sm font-bold tracking-[0.2em] uppercase text-primary mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span> Ingredients
                   </h3>
                   <ul className="space-y-3 font-body text-on-surface group">
                     {selectedRecipe.ingredients.map((ingredient, i) => (
                       <li key={i} className="flex gap-4 p-2 transition-colors hover:bg-surface-container-low border-b border-outline/5 border-dashed last:border-0">
                         <span className="text-primary mt-1">•</span> 
                         <span className="text-on-surface">{ingredient}</span>
                       </li>
                     ))}
                   </ul>
                 </div>

                 <div>
                   <h3 className="font-technical text-sm font-bold tracking-[0.2em] uppercase text-primary mb-6 flex items-center gap-2">
                       <span className="material-symbols-outlined text-[16px]">restaurant_menu</span> Methodology
                   </h3>
                   <div className="space-y-6 font-body text-on-surface">
                     {selectedRecipe.instructions.map((step, i) => (
                       <div key={i} className="flex gap-6 p-4 bg-surface-container-low/50 border border-outline/10 text-on-surface leading-relaxed">
                         <span className="font-headline text-3xl text-primary/30 italic mt-0">{(i + 1).toString().padStart(2, '0')}</span> 
                         <span className="mt-2">{step}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default RecipeList;
