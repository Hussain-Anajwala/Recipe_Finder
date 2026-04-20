import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { firstName, lastName, username, email, password } = form;
      await axios.post('/api/auth/register', { firstName, lastName, username, email, password });
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl text-on-surface mb-2">Join Savour</h1>
          <p className="text-on-surface-variant text-sm">Create your account to share and discover recipes</p>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-8 editorial-shadow">
          {error && (
            <div className="mb-4 p-3 bg-error-container border border-error/20 rounded text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-error" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-secondary-container/50 border border-secondary/20 rounded text-on-secondary-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>check_circle</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-on-surface mb-1.5">First Name</label>
                <input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                  placeholder="Jane" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-on-surface mb-1.5">Last Name</label>
                <input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                  placeholder="Doe" />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-on-surface mb-1.5">Username</label>
              <input id="username" name="username" type="text" required value={form.username} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="janedoe_cooks" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">Email</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="you@example.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-1.5">Password</label>
              <input id="password" name="password" type="password" required value={form.password} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="At least 6 characters" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface mb-1.5">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary text-on-primary rounded font-medium text-sm hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />Creating account…</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
