import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../config/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';

/**
 * AdminLogin — accessible only via /admin-login (not linked from any public UI).
 * This page is intentionally hidden from regular users.
 */
function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.user.role !== 'admin') {
        toast.error('Access denied. This portal is for administrators only.');
        return;
      }

      login(response.data.token, response.data.user);
      toast.success(`Welcome, ${response.data.user.firstName}.`);
      navigate('/admin');

    } catch (error) {
      console.error('Admin login error:', error.response ? error.response.data : error.message);
      toast.error(`Authentication failed: ${error.response ? error.response.data.message : 'Invalid credentials'}`);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  // Chef's Note tooltip dismiss on click-outside
  const [showChefNote, setShowChefNote] = useState(true);
  const chefNoteRef = useRef(null);

  useEffect(() => {
    if (!showChefNote) return;
    const handleClickOutside = (e) => {
      if (chefNoteRef.current && !chefNoteRef.current.contains(e.target)) {
        setShowChefNote(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [showChefNote]);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex items-stretch">
      {/* Left Column: Branding & Imagery — darker admin aesthetic */}
      <section className="hidden lg:flex w-1/2 bg-on-surface relative overflow-hidden flex-col justify-between p-16 text-surface">
        <div className="absolute inset-0 grain-overlay pointer-events-none"></div>
        
        <div className="relative z-10 pt-10">
          <h1 className="font-display text-6xl font-semibold tracking-tighter cursor-pointer text-surface" onClick={() => navigate('/')}>Savour</h1>
          <div className="h-1 w-12 bg-surface/40 mt-4"></div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-sm mb-8">
            <span className="material-symbols-outlined text-sm text-primary/80">shield</span>
            <span className="font-technical text-xs text-primary/80 tracking-widest uppercase">Restricted Access</span>
          </div>
          <h2 className="font-display text-5xl leading-tight italic text-surface/90">Administrator Portal.</h2>
          <p className="mt-8 font-body text-base opacity-70 leading-relaxed font-light text-surface">
            This area is for Savour administrators only. Unauthorized access attempts are logged.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-xs font-label tracking-[0.2em] uppercase text-surface/40">
          <span>Savour Admin</span>
          <span className="w-8 h-[1px] bg-surface/20"></span>
          <span>Secured Portal</span>
        </div>
      </section>

      {/* Right Column: Authentication Flow */}
      <main className="w-full lg:w-1/2 bg-surface flex items-center justify-center p-8 md:p-24 pt-20 lg:pt-8 relative">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-12">
            <h1 className="font-display text-4xl text-primary font-semibold tracking-tighter cursor-pointer" onClick={() => navigate('/')}>Savour</h1>
          </div>
          
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-sm text-primary">shield</span>
              <span className="font-technical text-xs text-primary tracking-widest uppercase">Admin Portal</span>
            </div>
            <h2 className="font-display text-4xl text-on-surface mb-3 font-bold tracking-tight">Administrator Sign In.</h2>
            <p className="text-on-surface-variant font-body text-base">Authorized personnel only.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group">
              <label htmlFor="email" className="block text-xs font-label font-bold tracking-[0.15em] text-on-surface-variant uppercase mb-3 group-focus-within:text-primary transition-colors">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@savour.com" 
                className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-base text-on-surface placeholder:text-outline/40 transition-all" 
              />
            </div>
            
            <div className="group">
              <div className="flex justify-between items-end mb-3">
                <label htmlFor="password" className="block text-xs font-label font-bold tracking-[0.15em] text-on-surface-variant uppercase group-focus-within:text-primary transition-colors">Password</label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-3 font-body text-base text-on-surface placeholder:text-outline/40 transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-on-surface text-surface font-label font-semibold tracking-widest uppercase py-5 px-8 rounded-sm hover:opacity-90 transition-all active:scale-[0.98] text-sm">
                  Sign In as Administrator
              </button>
            </div>
          </form>

          <footer className="mt-16 pt-8 border-t border-outline-variant/20">
            <div className="text-center">
              <Link to="/login" className="text-xs font-label tracking-widest text-outline uppercase hover:text-primary transition-colors">
                ← Back to Public Sign In
              </Link>
            </div>
          </footer>
        </div>
      </main>

      {/* Chef's Note — dismisses on click-outside */}
      {showChefNote && (
        <div
          ref={chefNoteRef}
          className="fixed top-8 right-8 z-50 cursor-pointer hidden lg:block"
          onClick={() => setShowChefNote(false)}
          title="Click to dismiss"
        >
          <div className="p-4 bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/10 rounded-sm shadow-xl relative">
            <button
              onClick={() => setShowChefNote(false)}
              className="absolute top-1.5 right-1.5 text-outline/50 hover:text-outline transition-colors"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <span className="font-technical text-xs text-primary block leading-none mb-1.5 pr-4">SECURITY NOTE</span>
            <span className="font-technical text-[11px] text-on-surface-variant block leading-tight max-w-[140px]">This URL is not publicly indexed. Keep it confidential.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;
