import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from '../utils/toast';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: '',
    ingredients: [],
    instructions: [],
    image: '',
    status: ''
  });
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    if (!isAdmin()) {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }
    fetchStats();
    fetchSubmissions(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats', getAuthConfig());
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSubmissions = async (status) => {
    setLoading(true);
    try {
      const url = status === 'all' 
        ? 'http://localhost:5000/api/admin/submissions'
        : `http://localhost:5000/api/admin/submissions?status=${status}`;
      
      const response = await axios.get(url, getAuthConfig());
      setSubmissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (recipeId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/submissions/${recipeId}/approve`,
        { adminNotes },
        getAuthConfig()
      );
      toast.success('Recipe approved successfully!');
      setAdminNotes('');
      setSelectedRecipe(null);
      fetchStats();
      fetchSubmissions(filter);
    } catch (error) {
      console.error('Error approving recipe:', error);
      toast.error('Failed to approve recipe');
    }
  };

  const handleReject = async (recipeId) => {
    if (!adminNotes.trim()) {
      toast.warning('Please provide a reason for rejection in the admin notes.');
      return;
    }
    
    try {
      await axios.put(
        `http://localhost:5000/api/admin/submissions/${recipeId}/reject`,
        { adminNotes },
        getAuthConfig()
      );
      toast.success('Recipe rejected.');
      setAdminNotes('');
      setSelectedRecipe(null);
      fetchStats();
      fetchSubmissions(filter);
    } catch (error) {
      console.error('Error rejecting recipe:', error);
      toast.error('Failed to reject recipe');
    }
  };

  const handleDeleteRecipe = async (recipeId, recipeTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${recipeTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/recipes/${recipeId}`, getAuthConfig());
      toast.success('Recipe deleted successfully!');
      fetchStats();
      fetchSubmissions(filter);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setEditForm({
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image: recipe.image || '',
      status: recipe.status
    });
  };

  const handleUpdateRecipe = async () => {
    try {
      console.log('Updating recipe:', editingRecipe._id);
      console.log('Edit form data:', editForm);
      
      const response = await axios.put(
        `http://localhost:5000/api/admin/recipes/${editingRecipe._id}`,
        editForm,
        getAuthConfig()
      );
      
      console.log('Update response:', response.data);
      toast.success('Recipe updated successfully!');
      setEditingRecipe(null);
      setEditForm({
        title: '',
        description: '',
        category: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        difficulty: '',
        ingredients: [],
        instructions: [],
        image: '',
        status: ''
      });
      fetchStats();
      fetchSubmissions(filter);
    } catch (error) {
      console.error('Error updating recipe:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(`Failed to update recipe: ${error.response?.data?.message || error.message}`);
    }
  };

  const addIngredient = () => {
    setEditForm({
      ...editForm,
      ingredients: [...editForm.ingredients, '']
    });
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...editForm.ingredients];
    newIngredients[index] = value;
    setEditForm({ ...editForm, ingredients: newIngredients });
  };

  const removeIngredient = (index) => {
    const newIngredients = editForm.ingredients.filter((_, i) => i !== index);
    setEditForm({ ...editForm, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setEditForm({
      ...editForm,
      instructions: [...editForm.instructions, '']
    });
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...editForm.instructions];
    newInstructions[index] = value;
    setEditForm({ ...editForm, instructions: newInstructions });
  };

  const removeInstruction = (index) => {
    const newInstructions = editForm.instructions.filter((_, i) => i !== index);
    setEditForm({ ...editForm, instructions: newInstructions });
  };

  const StatCard = ({ title, value, color }) => (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`,
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  );

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', background: '#f5f6fa', minHeight: '100vh' }} className="responsive-container">
      <style>{`
        @media screen and (max-width: 768px) {
          .responsive-container {
            padding: 20px 15px !important;
          }

          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .filter-tabs {
            flex-wrap: wrap !important;
          }

          .filter-tabs button {
            flex: 1;
            min-width: 120px;
          }

          .edit-form-grid {
            grid-template-columns: 1fr !important;
          }

          .edit-form-grid-4 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <StatCard title="Total Users" value={stats.totalUsers} color="#3498db" />
          <StatCard title="Total Recipes" value={stats.totalRecipes} color="#9b59b6" />
          <StatCard title="Pending" value={stats.pendingRecipes} color="#f39c12" />
          <StatCard title="Approved" value={stats.approvedRecipes} color="#27ae60" />
          <StatCard title="Rejected" value={stats.rejectedRecipes} color="#e74c3c" />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        {['pending', 'approved', 'rejected', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '10px 20px',
              background: filter === status ? '#3498db' : 'white',
              color: filter === status ? 'white' : '#2c3e50',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: filter === status ? 'bold' : 'normal',
              textTransform: 'capitalize'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '8px' }}>
          <h3>No {filter} submissions found</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {submissions.map((recipe) => (
            <div 
              key={recipe._id}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '25px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0' }}>{recipe.title}</h3>
                  <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                    Submitted by: <strong>{recipe.submittedBy?.firstName} {recipe.submittedBy?.lastName}</strong> ({recipe.submittedBy?.email})
                  </div>
                  <div style={{ fontSize: '12px', color: '#95a5a6', marginTop: '4px' }}>
                    {new Date(recipe.createdAt).toLocaleString()}
                  </div>
                </div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: recipe.status === 'approved' ? '#27ae60' : recipe.status === 'rejected' ? '#e74c3c' : '#f39c12',
                  height: 'fit-content',
                  textTransform: 'uppercase'
                }}>
                  {recipe.status}
                </span>
              </div>

              <p style={{ color: '#2c3e50', marginBottom: '15px' }}>{recipe.description}</p>

              <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#7f8c8d', marginBottom: '15px' }}>
                <span>📁 {recipe.category}</span>
                <span>⏱️ Prep: {recipe.prepTime}m</span>
                <span>🔥 Cook: {recipe.cookTime}m</span>
                <span>🍽️ Servings: {recipe.servings}</span>
                <span>📊 {recipe.difficulty}</span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Ingredients:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                    <li key={idx} style={{ fontSize: '14px' }}>{ing}</li>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <li style={{ fontSize: '14px', color: '#7f8c8d' }}>
                      ...and {recipe.ingredients.length - 3} more
                    </li>
                  )}
                </ul>
              </div>

              {recipe.adminNotes && (
                <div style={{
                  padding: '12px',
                  background: '#fff3cd',
                  borderLeft: '4px solid #ffc107',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}>
                  <strong>Admin Notes:</strong> {recipe.adminNotes}
                </div>
              )}

              {(recipe.status === 'approved' || recipe.status === 'rejected') && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #ecf0f1', paddingTop: '20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleEditRecipe(recipe)}
                    style={{
                      padding: '10px 20px',
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✏️ Edit Recipe
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe._id, recipe.title)}
                    style={{
                      padding: '10px 20px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Delete Recipe
                  </button>
                </div>
              )}

              {recipe.status === 'pending' && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #ecf0f1', paddingTop: '20px' }}>
                  {selectedRecipe === recipe._id ? (
                    <div>
                      <textarea
                        placeholder="Add admin notes (optional for approval, required for rejection)"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          marginBottom: '10px',
                          minHeight: '80px',
                          fontFamily: 'inherit'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleApprove(recipe._id)}
                          style={{
                            padding: '10px 20px',
                            background: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(recipe._id)}
                          style={{
                            padding: '10px 20px',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          ✗ Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRecipe(null);
                            setAdminNotes('');
                          }}
                          style={{
                            padding: '10px 20px',
                            background: '#95a5a6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedRecipe(recipe._id)}
                      style={{
                        padding: '10px 20px',
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Review Recipe
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '40px',
            position: 'relative',
            width: '100%'
          }}>
            <button
              onClick={() => setEditingRecipe(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ×
            </button>

            <h2 style={{ marginTop: 0, marginBottom: '30px' }}>Edit Recipe</h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Basic Info */}
              <div className="edit-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                    <option value="Salad">Salad</option>
                    <option value="Soup">Soup</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px'
                  }}
                />
              </div>

              {/* Time and Servings */}
              <div className="edit-form-grid-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Prep Time (min)</label>
                  <input
                    type="number"
                    value={editForm.prepTime}
                    onChange={(e) => setEditForm({ ...editForm, prepTime: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Cook Time (min)</label>
                  <input
                    type="number"
                    value={editForm.cookTime}
                    onChange={(e) => setEditForm({ ...editForm, cookTime: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Servings</label>
                  <input
                    type="number"
                    value={editForm.servings}
                    onChange={(e) => setEditForm({ ...editForm, servings: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Difficulty</label>
                  <select
                    value={editForm.difficulty}
                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Image URL</label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Ingredients */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontWeight: 'bold' }}>Ingredients</label>
                  <button
                    type="button"
                    onClick={addIngredient}
                    style={{
                      padding: '5px 10px',
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    + Add Ingredient
                  </button>
                </div>
                {editForm.ingredients.map((ingredient, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      style={{
                        padding: '8px 12px',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontWeight: 'bold' }}>Instructions</label>
                  <button
                    type="button"
                    onClick={addInstruction}
                    style={{
                      padding: '5px 10px',
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    + Add Step
                  </button>
                </div>
                {editForm.instructions.map((instruction, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ minWidth: '30px', paddingTop: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                      {index + 1}.
                    </span>
                    <textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        minHeight: '60px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      style={{
                        padding: '8px 12px',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button
                  onClick={handleUpdateRecipe}
                  style={{
                    padding: '12px 24px',
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  💾 Update Recipe
                </button>
                <button
                  onClick={() => setEditingRecipe(null)}
                  style={{
                    padding: '12px 24px',
                    background: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
