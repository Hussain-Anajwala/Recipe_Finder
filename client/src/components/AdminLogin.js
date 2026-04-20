import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      if (data.user.role !== 'admin') {
        setError('This account does not have admin privileges.');
        return;
      }
      login(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
          </div>
          <h1 className="font-headline text-4xl text-on-surface mb-2">Admin Access</h1>
          <p className="text-on-surface-variant text-sm">Sign in with your administrator credentials</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-outline-variant rounded-lg p-8 editorial-shadow">
          {error && (
            <div className="mb-4 p-3 bg-error-container border border-error/20 rounded text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-error" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-on-surface mb-1.5">
                Admin Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="admin@savour.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-on-surface mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-on-primary rounded font-medium text-sm hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock_open</span>
                  Admin Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Not an admin?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              User login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
