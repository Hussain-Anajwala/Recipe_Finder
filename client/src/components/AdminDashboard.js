import React, { useState, useEffect, useMemo } from 'react';
import API from '../config/api';
import { toast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

function AdminDashboard() {
  const [allRecipes, setAllRecipes] = useState([]);
  // Let's pretend we have a users endpoint or just hardcode/use an aggregate count if missing
  const [usersCount, setUsersCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit Modal State
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: '',
    instructions: '',
    difficulty: 'Easy',
    image: ''
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch ALL submissions (pending, approved, rejected) via admin endpoint
      const [submissionsRes, usersRes] = await Promise.all([
        API.get('/api/admin/submissions', getAuthConfig()),
        API.get('/api/admin/users', getAuthConfig()).catch(() => ({ data: [] }))
      ]);

      setAllRecipes(submissionsRes.data || []);
      setUsersCount(usersRes.data?.length || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load submissions.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (recipeId, newStatus) => {
    try {
      const endpoint = newStatus === 'approved' 
         ? `/api/admin/submissions/${recipeId}/approve` 
         : `/api/admin/submissions/${recipeId}/reject`;
      await API.put(endpoint, {}, getAuthConfig());
      toast.success(`Submission marked as ${newStatus}`);
      fetchData(); // Refresh all
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to change status');
    }
  };

  // ----- Edit Logic -----
  const openEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setEditFormData({
      title: recipe.title || '',
      description: recipe.description || '',
      category: recipe.category || '',
      prepTime: recipe.prepTime || 0,
      cookTime: recipe.cookTime || 0,
      servings: recipe.servings || 1,
      ingredients: recipe.ingredients ? recipe.ingredients.join('\n') : '',
      instructions: recipe.instructions ? recipe.instructions.join('\n') : '',
      difficulty: recipe.difficulty || 'Easy',
      image: recipe.image || recipe.imageUrl || ''
    });
  };

  const closeEditModal = () => {
    setEditingRecipe(null);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        title: editFormData.title,
        description: editFormData.description,
        category: editFormData.category,
        prepTime: Number(editFormData.prepTime),
        cookTime: Number(editFormData.cookTime),
        servings: Number(editFormData.servings),
        difficulty: editFormData.difficulty,
        ingredients: editFormData.ingredients.split('\n').filter(i => i.trim() !== ''),
        instructions: editFormData.instructions.split('\n').filter(i => i.trim() !== ''),
        image: editFormData.image   // ← matches Recipe model field name
      };

      await API.put(`/api/admin/recipes/${editingRecipe._id}`, dataToSubmit, getAuthConfig());
      toast.success('Recipe updated successfully.');
      closeEditModal();
      fetchData();
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      members: usersCount,
      total: allRecipes.length,
      pending: allRecipes.filter(r => r.status === 'pending').length,
      published: allRecipes.filter(r => r.status === 'approved').length,
      returned: allRecipes.filter(r => r.status === 'rejected').length
    };
  }, [allRecipes, usersCount]);

  // Filter recipes for display
  const displayRecipes = useMemo(() => {
    let filtered = allRecipes;
    if (activeTab !== 'all') {
       filtered = filtered.filter(r => r.status === activeTab);
    }
    if (searchQuery) {
       filtered = filtered.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [allRecipes, activeTab, searchQuery]);

  if (loading && allRecipes.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-surface pt-28 pb-20 px-6 md:px-12 relative overflow-x-hidden">
      <div className="absolute inset-0 grain-overlay z-[0] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Header Section */}
        <header>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface tracking-tight mb-4">Editorial Dashboard</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Review and manage all recipe submissions. Maintain the sensory excellence of Savour by curating the most exceptional culinary expressions.
          </p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-outline-variant/20 rounded-sm overflow-hidden editorial-shadow">
          <div className="bg-surface p-6 md:p-8 border-r border-outline-variant/10">
            <span className="block text-[10px] tracking-[0.2em] font-bold text-on-surface-variant mb-2 uppercase">TOTAL MEMBERS</span>
            <span className="text-3xl md:text-4xl font-headline text-primary">{stats.members.toLocaleString()}</span>
          </div>
          <div className="bg-surface p-6 md:p-8 border-r border-outline-variant/10">
            <span className="block text-[10px] tracking-[0.2em] font-bold text-on-surface-variant mb-2 uppercase">RECIPES</span>
            <span className="text-3xl md:text-4xl font-headline text-primary">{stats.total.toLocaleString()}</span>
          </div>
          <div className="bg-surface p-6 md:p-8 border-r border-outline-variant/10">
            <span className="block text-[10px] tracking-[0.2em] font-bold text-primary mb-2 uppercase">AWAITING REVIEW</span>
            <span className="text-3xl md:text-4xl font-headline text-primary">{stats.pending.toLocaleString()}</span>
          </div>
          <div className="bg-surface p-6 md:p-8 border-r border-outline-variant/10">
            <span className="block text-[10px] tracking-[0.2em] font-bold text-on-surface-variant mb-2 uppercase">PUBLISHED</span>
            <span className="text-3xl md:text-4xl font-headline text-primary">{stats.published.toLocaleString()}</span>
          </div>
          <div className="bg-surface p-6 md:p-8">
            <span className="block text-[10px] tracking-[0.2em] font-bold text-on-surface-variant mb-2 uppercase">RETURNED</span>
            <span className="text-3xl md:text-4xl font-headline text-primary">{stats.returned.toLocaleString()}</span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${activeTab === 'pending' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'}`}
            >
              AWAITING REVIEW
            </button>
            <button 
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${activeTab === 'approved' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'}`}
            >
              PUBLISHED
            </button>
            <button 
              onClick={() => setActiveTab('rejected')}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${activeTab === 'rejected' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'}`}
            >
              RETURNED
            </button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${activeTab === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'}`}
            >
              ALL SUBMISSIONS
            </button>
          </div>
          
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search submissions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-outline focus:border-primary focus:ring-0 transition-colors text-sm font-body outline-none"
            />
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-8">
          {displayRecipes.length === 0 ? (
             <div className="py-24 text-center border border-dashed border-outline-variant bg-surface-container-lowest editorial-shadow">
               <h3 className="font-headline text-2xl text-on-surface italic">No submissions match the current filter.</h3>
             </div>
          ) : (
            displayRecipes.map((recipe) => (
               <article key={recipe._id} className="bg-surface-container-lowest p-8 md:p-10 group hover:shadow-[0px_20px_40px_rgba(88,65,60,0.08)] transition-all duration-500 flex flex-col md:flex-row gap-10 border border-outline-variant/10 relative">
                 <div className="w-full md:w-64 h-48 overflow-hidden rounded-sm bg-surface-container shrink-0 relative">
                   <img 
                     src={getImageUrl(recipe.imageUrl || recipe.image)} 
                     alt={recipe.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                     onError={handleImageError}
                   />
                 </div>
                 
                 <div className="flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h2 className="text-3xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors cursor-pointer" onClick={() => openEditModal(recipe)}>
                         {recipe.title}
                       </h2>
                       <p className="text-sm text-on-surface-variant mt-1">
                         Submitted by <span className="font-semibold text-on-surface">{recipe.author?.username || 'Unknown'}</span> <span className="mx-1 opacity-40">|</span> Community Member
                       </p>
                     </div>
                     <span className={`px-3 py-1 border text-[10px] tracking-[0.1em] font-bold rounded-full uppercase
                        ${recipe.status === 'pending' ? 'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20' : ''}
                        ${recipe.status === 'approved' ? 'bg-secondary-container/20 text-secondary border-secondary/20' : ''}
                        ${recipe.status === 'rejected' ? 'bg-error-container/20 text-error border-error/20' : ''}`}>
                       {recipe.status === 'pending' ? 'AWAITING REVIEW' : recipe.status}
                     </span>
                   </div>
                   
                   <p className="text-on-surface-variant leading-relaxed mb-6 line-clamp-2">
                     {recipe.description}
                   </p>
                   
                   <div className="flex flex-wrap gap-6 mt-auto">
                     <div className="flex items-center gap-2 text-on-surface-variant">
                       <span className="material-symbols-outlined text-[18px]">schedule</span>
                       <span className="font-technical text-xs">{recipe.cookingTime || recipe.prepTime || 0} MIN</span>
                     </div>
                     <div className="flex items-center gap-2 text-on-surface-variant">
                       <span className="material-symbols-outlined text-[18px]">restaurant</span>
                       <span className="font-technical text-xs tracking-wider uppercase">DIFFICULTY: {recipe.difficulty || 'EASY'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-on-surface-variant">
                       <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                       <span className="font-technical text-xs tracking-wider uppercase">{(recipe.ingredients || []).length} INGREDIENTS</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* Action Buttons purely structured around admin task */}
                 <div className="flex md:flex-col justify-end md:justify-center gap-3 pt-6 md:pt-0 md:pl-8 md:border-l border-outline-variant/10 shrink-0">
                    {recipe.status === 'pending' && (
                       <>
                         <button 
                           onClick={() => openEditModal(recipe)}
                           className="px-6 py-2.5 bg-primary text-on-primary text-xs font-semibold tracking-widest rounded-sm hover:opacity-90 transition-opacity uppercase text-center"
                         >
                           BEGIN REVIEW
                         </button>
                         <button 
                           onClick={() => handleStatusChange(recipe._id, 'approved')}
                           className="px-6 py-2.5 border border-secondary text-secondary text-xs font-semibold tracking-widest rounded-sm hover:bg-secondary/10 transition-colors uppercase text-center"
                         >
                           PUBLISH
                         </button>
                         <button 
                           onClick={() => handleStatusChange(recipe._id, 'rejected')}
                           className="px-6 py-2.5 border border-outline text-on-surface text-xs font-semibold tracking-widest rounded-sm hover:bg-surface-container transition-colors uppercase text-center"
                         >
                           RETURN
                         </button>
                       </>
                    )}

                    {recipe.status === 'approved' && (
                       <>
                         <button 
                           onClick={() => openEditModal(recipe)}
                           className="px-6 py-2.5 border border-outline text-on-surface text-xs font-semibold tracking-widest rounded-sm hover:bg-surface-container transition-colors uppercase text-center"
                         >
                           AMEND
                         </button>
                         <button 
                           onClick={() => handleStatusChange(recipe._id, 'rejected')}
                           className="px-6 py-2.5 border border-error text-error text-xs font-semibold tracking-widest rounded-sm hover:bg-error-container/20 transition-colors uppercase text-center"
                         >
                           REVOKE
                         </button>
                       </>
                    )}

                    {recipe.status === 'rejected' && (
                       <>
                         <button 
                           onClick={() => handleStatusChange(recipe._id, 'approved')}
                           className="px-6 py-2.5 border border-secondary text-secondary text-xs font-semibold tracking-widest rounded-sm hover:bg-secondary/10 transition-colors uppercase text-center"
                         >
                           RECONSIDER
                         </button>
                       </>
                    )}
                 </div>
               </article>
            ))
          )}
        </div>

      </div>

      {/* Editor Modal Overlay */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm" onClick={closeEditModal}></div>
          <div className="bg-surface-container-lowest editorial-shadow w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 border border-outline/30">
            
            <header className="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md p-6 border-b border-outline/30 flex justify-between items-center z-20">
              <div>
                <span className="font-label text-primary tracking-[0.2em] text-[10px] font-bold block uppercase mb-1">Editor Mode</span>
                <h2 className="font-headline text-2xl text-on-surface leading-tight">Amending '{editingRecipe.title}'</h2>
              </div>
              <button 
                onClick={closeEditModal}
                className="w-10 h-10 border border-outline/30 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="p-6 md:p-8">
              <form onSubmit={handleEditSubmit} className="space-y-12">
                
                {/* Visual Identity Section */}
                <div className="border-b border-outline/30 pb-10">
                  <h3 className="font-technical uppercase tracking-widest text-xs font-bold text-on-surface mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[1rem]">title</span> I. Composition Identity
                  </h3>
                  <div className="space-y-8">
                    <div>
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-bold">Manuscript Title</label>
                      <input
                        type="text" name="title" value={editFormData.title} onChange={handleEditChange} required
                        className="w-full bg-transparent border-b border-outline pb-2 font-headline text-3xl text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant"
                      />
                    </div>
                    <div>
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-bold">Editorial Abstract (Description)</label>
                      <textarea
                        name="description" value={editFormData.description} onChange={handleEditChange} required rows="3"
                        className="w-full bg-transparent border-b border-outline pb-2 font-body text-base text-on-surface focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-outline-variant"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Parameters */}
                <div className="border-b border-outline/30 pb-10">
                  <h3 className="font-technical uppercase tracking-widest text-xs font-bold text-on-surface mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[1rem]">tune</span> II. Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-bold">Prep Time (Min)</label>
                      <div className="relative">
                        <input
                          type="number" name="prepTime" value={editFormData.prepTime} onChange={handleEditChange} required min="0"
                          className="w-full bg-transparent border-b border-outline pb-2 font-technical text-lg text-on-surface focus:outline-none focus:border-primary transition-colors pl-8"
                        />
                        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-[1.2rem] text-on-surface-variant">schedule</span>
                      </div>
                    </div>
                    <div>
                      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-bold">Technical Difficulty</label>
                      <div className="relative">
                        <select
                          name="difficulty" value={editFormData.difficulty} onChange={handleEditChange}
                          className="w-full bg-transparent border-b border-outline pb-2 font-technical text-lg text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer pl-8"
                        >
                          <option value="Easy" className="bg-surface">Novice (Easy)</option>
                          <option value="Medium" className="bg-surface">Intermediate (Medium)</option>
                          <option value="Hard" className="bg-surface">Advanced (Hard)</option>
                        </select>
                        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-[1.2rem] text-on-surface-variant">bar_chart</span>
                        <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[1.5rem] text-on-surface-variant pointer-events-none">arrow_drop_down</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Substantive Elements */}
                <div>
                   <h3 className="font-technical uppercase tracking-widest text-xs font-bold text-on-surface mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[1rem]">format_list_bulleted</span> III. Substantive Elements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                       <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-3 font-bold">Component Assets (Ingredients)</label>
                       <p className="font-technical text-[10px] text-on-surface-variant mb-4 italic">Separate elements with a newline. Precise measurements recommended.</p>
                       <textarea
                         name="ingredients" value={editFormData.ingredients} onChange={handleEditChange} required rows="10"
                         className="w-full bg-surface-container-low border border-outline/30 p-5 font-technical text-base text-on-surface focus:outline-none focus:border-primary transition-colors resize-y leading-relaxed"
                         placeholder="1 cup artisanal flour&#10;2 tbsp clarified butter"
                       />
                    </div>
                    <div>
                       <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-3 font-bold">Methodological Process (Instructions)</label>
                       <p className="font-technical text-[10px] text-on-surface-variant mb-4 italic">Sequential chronology. One step per newline.</p>
                       <textarea
                         name="instructions" value={editFormData.instructions} onChange={handleEditChange} required rows="10"
                         className="w-full bg-surface-container-low border border-outline/30 p-5 font-body text-base text-on-surface focus:outline-none focus:border-primary transition-colors resize-y leading-relaxed"
                         placeholder="1. Sift the dry ingredients carefully.&#10;2. Fold in the butter with precision."
                       />
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="border-b border-outline/30 pb-10">
                  <h3 className="font-technical uppercase tracking-widest text-xs font-bold text-on-surface mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[1rem]">image</span> IV. Cover Image
                  </h3>
                  <div>
                    <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-bold">Image URL</label>
                    <div className="flex items-center gap-3 border-b border-outline pb-2 group focus-within:border-primary transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-primary">add_photo_alternate</span>
                      <input
                        type="url" name="image" value={editFormData.image} onChange={handleEditChange}
                        className="w-full bg-transparent border-0 focus:ring-0 py-1 font-body text-sm text-on-surface placeholder:text-outline-variant focus:outline-none"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                    {editFormData.image && (
                      <img
                        src={editFormData.image}
                        alt="Preview"
                        className="mt-4 h-40 w-full object-cover rounded-sm border border-outline/20"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <footer className="pt-8 border-t border-outline/30 flex justify-end gap-4 mt-8">
                  <button 
                    type="button" onClick={closeEditModal}
                    className="font-label text-xs uppercase tracking-widest font-bold px-6 py-3 border border-outline text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    Discard Edits
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary text-on-primary font-label text-xs uppercase tracking-widest font-bold px-8 py-3 hover:-translate-y-1 transition-transform editorial-shadow"
                  >
                    Seal Amendments
                  </button>
                  {/* Approve Action shortcut inside Editor */}
                  {editingRecipe?.status === 'pending' && (
                    <button 
                      type="button"
                      onClick={() => { handleStatusChange(editingRecipe._id, 'approved'); closeEditModal(); }}
                      className="bg-secondary text-on-secondary font-label text-xs uppercase tracking-widest font-bold px-8 py-3 hover:-translate-y-1 transition-transform editorial-shadow ml-2"
                    >
                      Publish
                    </button>
                  )}
                </footer>

              </form>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default AdminDashboard;
