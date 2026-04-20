import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', category: 'Dinner', prepTime: '',
    cookTime: '', servings: '', difficulty: 'Medium', image: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [instructionInput, setInstructionInput] = useState('');

  useEffect(() => {
    axios.get(`/api/recipes/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Dinner',
          prepTime: data.prepTime || '',
          cookTime: data.cookTime || '',
          servings: data.servings || '',
          difficulty: data.difficulty || 'Medium',
          image: data.image || '',
        });
        setIngredients(data.ingredients || []);
        setInstructions(data.instructions || []);
      })
      .catch(() => setError('Recipe not found or you do not have permission to edit it.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const addIngredient = () => {
    const val = ingredientInput.trim();
    if (val) { setIngredients(prev => [...prev, val]); setIngredientInput(''); }
  };

  const addInstruction = () => {
    const val = instructionInput.trim();
    if (val) { setInstructions(prev => [...prev, val]); setInstructionInput(''); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (ingredients.length === 0) { setError('At least one ingredient required.'); return; }
    if (instructions.length === 0) { setError('At least one instruction required.'); return; }

    setSaving(true);
    try {
      await axios.put(`/api/recipes/${id}`, {
        ...form,
        prepTime: Number(form.prepTime),
        cookTime: Number(form.cookTime),
        servings: Number(form.servings),
        ingredients, instructions,
      });
      setSuccess('Recipe updated successfully!');
      setTimeout(() => navigate('/my-recipes'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="font-headline text-4xl text-on-surface mb-1">Edit Recipe</h1>
          <p className="text-on-surface-variant text-sm">Make changes to your submitted recipe.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-5 p-3 bg-error-container border border-error/20 rounded text-on-error-container text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-error" style={{ fontSize: '18px' }}>error</span>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 p-3 bg-secondary-container/50 border border-secondary/20 rounded text-on-secondary-container text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>check_circle</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
            <h2 className="font-headline text-xl text-on-surface mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-on-surface mb-1.5">Title *</label>
                <input id="title" name="title" type="text" required value={form.title} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-on-surface mb-1.5">Description *</label>
                <textarea id="description" name="description" rows={3} required value={form.description} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-on-surface mb-1.5">Category</label>
                  <select id="category" name="category" value={form.category} onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary transition-colors">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-on-surface mb-1.5">Difficulty</label>
                  <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary transition-colors">
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['prepTime', 'cookTime', 'servings'].map(field => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-on-surface mb-1.5 capitalize">
                      {field === 'prepTime' ? 'Prep (min)' : field === 'cookTime' ? 'Cook (min)' : 'Servings'}
                    </label>
                    <input id={field} name={field} type="number" min="0" required value={form[field]} onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-on-surface mb-1.5">Image URL</label>
                <input id="image" name="image" type="url" value={form.image} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              </div>
            </div>
          </section>

          {/* Ingredients */}
          <section className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
            <h2 className="font-headline text-xl text-on-surface mb-4">Ingredients</h2>
            <div className="flex gap-2 mb-3">
              <input type="text" value={ingredientInput} onChange={e => setIngredientInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                placeholder="Add ingredient…"
                className="flex-1 px-3 py-2.5 bg-surface border border-outline-variant rounded text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
              <button type="button" onClick={addIngredient}
                className="px-4 py-2.5 bg-primary text-on-primary rounded text-sm hover:bg-primary-container transition-colors">Add</button>
            </div>
            <ul className="space-y-1.5">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-center justify-between py-1.5 px-3 bg-surface border border-outline-variant rounded text-sm">
                  <span className="text-on-surface">{ing}</span>
                  <button type="button" onClick={() => setIngredients(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-on-surface-variant hover:text-error transition-colors" aria-label={`Remove ${ing}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
            <h2 className="font-headline text-xl text-on-surface mb-4">Instructions</h2>
            <div className="flex gap-2 mb-3">
              <textarea value={instructionInput} onChange={e => setInstructionInput(e.target.value)}
                placeholder="Add step…" rows={2}
                className="flex-1 px-3 py-2.5 bg-surface border border-outline-variant rounded text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none" />
              <button type="button" onClick={addInstruction}
                className="px-4 py-2.5 bg-primary text-on-primary rounded text-sm hover:bg-primary-container transition-colors self-start">Add</button>
            </div>
            <ol className="space-y-2">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-3 py-2 px-3 bg-surface border border-outline-variant rounded text-sm">
                  <span className="font-technical text-xs text-primary font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                  <span className="flex-1 text-on-surface-variant">{step}</span>
                  <button type="button" onClick={() => setInstructions(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-on-surface-variant hover:text-error transition-colors" aria-label={`Remove step ${i + 1}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate('/my-recipes')}
              className="px-6 py-2.5 border border-outline-variant text-on-surface-variant rounded text-sm hover:text-on-surface transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-primary text-on-primary rounded text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center gap-2">
              {saving ? (
                <><div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />Saving…</>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
