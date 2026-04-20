import React, { useState, useEffect } from 'react';
import API from '../config/api';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// ── Admin Edit Modal ────────────────────────────────────────────
const EditRecipeModal = ({ recipe, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: recipe.title || '',
    description: recipe.description || '',
    category: recipe.category || 'Dinner',
    difficulty: recipe.difficulty || 'Easy',
    prepTime: recipe.prepTime || 0,
    cookTime: recipe.cookTime || 0,
    servings: recipe.servings || 4,
    image: recipe.image || '',
    status: recipe.status || 'pending',
    ingredients: (recipe.ingredients || []).join('\n'),
    instructions: (recipe.instructions || []).join('\n'),
  });
  const [saving, setSaving] = useState(false);

  const handle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        prepTime: Number(form.prepTime),
        cookTime: Number(form.cookTime),
        servings: Number(form.servings),
        ingredients: form.ingredients.split('\n').map(s => s.trim()).filter(Boolean),
        instructions: form.instructions.split('\n').map(s => s.trim()).filter(Boolean),
      };
      await API.put(`/api/admin/recipes/${recipe._id}`, payload);
      onSave();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-6 my-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-headline text-2xl text-on-surface">Edit Recipe (Admin)</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Title</label>
            <input value={form.title} onChange={handle('title')} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={handle('description')} rows={3} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Category</label>
              <select value={form.category} onChange={handle('category')} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Difficulty</label>
              <select value={form.difficulty} onChange={handle('difficulty')} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Prep (min)</label>
              <input type="number" value={form.prepTime} onChange={handle('prepTime')} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Cook (min)</label>
              <input type="number" value={form.cookTime} onChange={handle('cookTime')} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Servings</label>
              <input type="number" value={form.servings} onChange={handle('servings')} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Image URL</label>
            <input value={form.image} onChange={handle('image')} placeholder="https://..." className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Status</label>
            <select value={form.status} onChange={handle('status')} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Ingredients (one per line)</label>
            <textarea value={form.ingredients} onChange={handle('ingredients')} rows={5} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary font-mono resize-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wide">Instructions (one step per line)</label>
            <textarea value={form.instructions} onChange={handle('instructions')} rows={5} className="w-full border border-outline-variant rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface">Cancel</button>
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Admin Dashboard ────────────────────────────────────────
const AdminDashboard = () => {
  const [tab, setTab] = useState('pending');
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectionNotes, setRejectionNotes] = useState({});
  const [indexStatus, setIndexStatus] = useState('');
  const [rebuildingIndex, setRebuildingIndex] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeSearch, setRecipeSearch] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      // ✅ Correct endpoints
      const [pendingRes, allRes, usersRes] = await Promise.all([
        API.get('/api/admin/submissions?status=pending'),
        API.get('/api/admin/submissions'),
        API.get('/api/admin/users'),
      ]);
      setPendingRecipes(pendingRes.data);
      setAllRecipes(allRes.data);
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error('Admin fetch error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleApprove = async (id) => {
    setActionLoading(id + '-approve');
    try {
      await API.put(`/api/admin/submissions/${id}/approve`);
      setPendingRecipes(prev => prev.filter(r => r._id !== id));
    } catch {
      alert('Approval failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '-reject');
    try {
      await API.put(`/api/admin/submissions/${id}/reject`, { adminNotes: rejectionNotes[id] || '' });
      setPendingRecipes(prev => prev.filter(r => r._id !== id));
    } catch {
      alert('Rejection failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Permanently delete this recipe?')) return;
    try {
      await API.delete(`/api/admin/recipes/${id}`);
      setAllRecipes(prev => prev.filter(r => r._id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  // ✅ Fixed: PUT /api/admin/users/:id/role (add this endpoint to server if missing)
  const handleToggleAdmin = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
    try {
      await API.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Role update failed.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all their recipes?')) return;
    try {
      await API.delete(`/api/admin/users/${userId}`);
      setAllUsers(prev => prev.filter(u => u._id !== userId));
    } catch {
      alert('Delete failed.');
    }
  };

  const handleRebuildIndex = async () => {
    setRebuildingIndex(true);
    setIndexStatus('');
    try {
      const { data } = await API.post('/api/ai/rebuild-index');
      setIndexStatus(`✅ ${data.message}`);
    } catch {
      setIndexStatus('⚠️ Rebuild failed. Is the AI service running on port 8000?');
    } finally {
      setRebuildingIndex(false);
    }
  };

  const filteredRecipes = allRecipes.filter(r =>
    !recipeSearch || r.title?.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  const TABS = [
    { key: 'pending', label: 'Pending Review', badge: pendingRecipes.length },
    { key: 'recipes', label: 'All Recipes' },
    { key: 'users', label: 'Users', badge: allUsers.length },
    { key: 'ai', label: 'AI Tools' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="font-headline text-4xl text-on-surface mb-1">Admin Dashboard</h1>
          <p className="text-on-surface-variant text-sm">Manage recipe submissions, users, and AI systems.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <div className="flex border-b border-outline-variant/30 mb-6 gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.label}
              {t.badge > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-primary text-white rounded-full leading-none">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Pending Recipes ──────────────────────────────────── */}
        {tab === 'pending' && (
          <div>
            {loading ? (
              <div className="space-y-4">{[1, 2].map(i => <div key={i} className="animate-pulse bg-surface-container-low border border-outline-variant/20 rounded-lg h-24" />)}</div>
            ) : pendingRecipes.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-outline text-5xl">done_all</span>
                <h2 className="font-headline text-2xl text-on-surface mt-4 mb-2">All caught up!</h2>
                <p className="text-on-surface-variant text-sm">No recipes awaiting review.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {pendingRecipes.map(recipe => (
                  <article key={recipe._id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-5 shadow-sm">
                    <div className="flex gap-4 items-start">
                      <div className="w-20 h-20 bg-surface-container rounded overflow-hidden flex-shrink-0">
                        {recipe.image
                          ? <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline">restaurant</span></div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-headline text-xl text-on-surface mb-0.5">{recipe.title}</h3>
                        <p className="text-xs text-on-surface-variant mb-1">
                          by {recipe.submittedBy?.firstName} {recipe.submittedBy?.lastName} · {recipe.category} · {recipe.difficulty}
                        </p>
                        <p className="text-on-surface-variant text-sm line-clamp-2">{recipe.description}</p>
                        {recipe.dietaryTags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {recipe.dietaryTags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-secondary-container/40 text-on-secondary-container rounded-full">AI: {tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingRecipe(recipe)}
                        className="text-xs px-3 py-1.5 border border-outline-variant/50 text-on-surface-variant hover:text-primary rounded transition-colors flex-shrink-0"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs text-on-surface-variant mb-1">Rejection note (optional)</label>
                      <input
                        type="text"
                        value={rejectionNotes[recipe._id] || ''}
                        onChange={e => setRejectionNotes(prev => ({ ...prev, [recipe._id]: e.target.value }))}
                        placeholder="e.g. Missing clear instructions..."
                        className="w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleApprove(recipe._id)}
                        disabled={actionLoading === recipe._id + '-approve'}
                        className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-white rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {actionLoading === recipe._id + '-approve' ? 'Approving…' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(recipe._id)}
                        disabled={actionLoading === recipe._id + '-reject'}
                        className="flex items-center gap-1.5 px-4 py-2 border border-error text-error rounded text-sm font-medium hover:bg-error/5 transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        {actionLoading === recipe._id + '-reject' ? 'Rejecting…' : 'Reject'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── All Recipes ──────────────────────────────────────── */}
        {tab === 'recipes' && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search recipes…"
                value={recipeSearch}
                onChange={e => setRecipeSearch(e.target.value)}
                className="w-full max-w-sm px-4 py-2 border border-outline-variant/40 rounded text-sm focus:outline-none focus:border-primary"
              />
            </div>
            {loading ? (
              <div className="animate-pulse space-y-2">{[1,2,3].map(i=><div key={i} className="h-12 bg-surface-container-low rounded"/>)}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/30 text-left">
                      <th className="pb-2 text-xs text-on-surface-variant font-medium uppercase tracking-wide">Title</th>
                      <th className="pb-2 text-xs text-on-surface-variant font-medium uppercase tracking-wide">Category</th>
                      <th className="pb-2 text-xs text-on-surface-variant font-medium uppercase tracking-wide">Status</th>
                      <th className="pb-2 text-xs text-on-surface-variant font-medium uppercase tracking-wide">Submitted By</th>
                      <th className="pb-2 text-xs text-on-surface-variant font-medium uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecipes.map(recipe => (
                      <tr key={recipe._id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50">
                        <td className="py-3 font-medium text-on-surface">{recipe.title}</td>
                        <td className="py-3 text-on-surface-variant">{recipe.category}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            recipe.status === 'approved' ? 'bg-secondary/10 text-secondary' :
                            recipe.status === 'rejected' ? 'bg-error/10 text-error' :
                            'bg-tertiary/10 text-tertiary'
                          }`}>{recipe.status}</span>
                        </td>
                        <td className="py-3 text-on-surface-variant">
                          {recipe.submittedBy?.firstName} {recipe.submittedBy?.lastName}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingRecipe(recipe)}
                              className="text-xs px-3 py-1 border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRecipe(recipe._id)}
                              className="text-xs px-3 py-1 border border-error/40 text-error/70 hover:text-error hover:border-error rounded transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Users Tab ─────────────────────────────────────────── */}
        {tab === 'users' && (
          <div>
            {loading ? (
              <div className="animate-pulse space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-surface-container-low rounded"/>)}</div>
            ) : allUsers.length === 0 ? (
              <p className="text-on-surface-variant text-sm py-8 text-center">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/30 text-left">
                      <th className="pb-3 text-xs text-on-surface-variant font-medium uppercase tracking-wide">User</th>
                      <th className="pb-3 text-xs text-on-surface-variant font-medium uppercase tracking-wide">Email</th>
                      <th className="pb-3 text-xs text-on-surface-variant font-medium uppercase tracking-wide">Role</th>
                      <th className="pb-3 text-xs text-on-surface-variant font-medium uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(u => (
                      <tr key={u._id} className="border-b border-outline-variant/20">
                        <td className="py-3">
                          <p className="font-medium text-on-surface">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-on-surface-variant">@{u.username}</p>
                        </td>
                        <td className="py-3 text-on-surface-variant">{u.email}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleAdmin(u._id, u.role)}
                              className="text-xs px-3 py-1.5 border border-outline-variant/50 text-on-surface-variant hover:text-on-surface rounded transition-colors"
                            >
                              {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="text-xs px-3 py-1.5 border border-error/40 text-error/70 hover:text-error rounded transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── AI Tools Tab ─────────────────────────────────────── */}
        {tab === 'ai' && (
          <div className="space-y-5 pb-10">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>hub</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl text-on-surface mb-1">Rebuild Recommendation Index</h3>
                  <p className="text-on-surface-variant text-sm">
                    Rebuilds the ChromaDB semantic vector index from all approved recipes. Run after approving a batch.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRebuildIndex}
                disabled={rebuildingIndex}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {rebuildingIndex
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Building…</>
                  : <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>Rebuild Index</>
                }
              </button>
              {indexStatus && <p className="text-sm mt-3 text-on-surface-variant">{indexStatus}</p>}
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-6">
              <h3 className="font-headline text-xl text-on-surface mb-4">AI System Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { icon: 'photo_camera', label: 'Image Detection', model: 'YOLOv8n + CLIP ViT-B/32', note: 'COCO-trained; limited food vocab' },
                  { icon: 'auto_awesome', label: 'Recommendations', model: 'all-MiniLM-L6-v2 + ChromaDB', note: 'Content-based only; no personal data' },
                  { icon: 'sell', label: 'Dietary Tagging', model: 'facebook/bart-large-mnli', note: 'Only tags with ≥75% confidence' },
                  { icon: 'mic', label: 'Voice Search', model: 'openai/whisper-small', note: 'Processed locally, never stored' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3 p-3 bg-surface border border-outline-variant/20 rounded">
                    <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: '18px' }}>{item.icon}</span>
                    <div>
                      <p className="font-medium text-on-surface text-sm">{item.label}</p>
                      <p className="text-xs text-on-surface-variant font-mono">{item.model}</p>
                      <p className="text-xs text-outline mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Edit Modal */}
      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onSave={() => { setEditingRecipe(null); fetchAll(); }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
