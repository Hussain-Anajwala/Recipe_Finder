import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../config/api';
import { toast } from '../utils/toast';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/auth/register', formData);
      
      console.log('Signup successful:', response.data);
      toast.success('Registration successful! Please log in.');
      
      navigate('/login');

    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Server error. Please try again.';
      toast.error(`Registration failed: ${errorMessage}`);
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
      {/* Left Column: Branding & Imagery */}
      <section className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-16 text-on-primary">
        <div className="absolute inset-0 grain-overlay pointer-events-none"></div>
        <div className="absolute inset-0 opacity-40 mix-blend-multiply">
          <img alt="artisan kitchen background" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1495195134817-a169d3215264?w=800&q=80&fit=crop"/>
        </div>
        
        <div className="relative z-10 pt-10">
          <h1 className="font-display text-6xl font-semibold tracking-tighter cursor-pointer" onClick={() => navigate('/')}>Savour</h1>
          <div className="h-1 w-12 bg-on-primary mt-4"></div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-5xl leading-tight italic">Curate your own kitchen anthology.</h2>
          <p className="mt-8 font-body text-lg opacity-90 leading-relaxed font-light">
              Join our curated community of culinary enthusiasts. Save your favorite finds and contribute your own gastronomic masterpieces.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-xs font-label tracking-[0.2em] uppercase">
          <span>Community Cultivated</span>
          <span className="w-8 h-[1px] bg-on-primary/40"></span>
          <span>Est. 2024</span>
        </div>
      </section>

      {/* Right Column: Authentication Flow */}
      <main className="w-full lg:w-1/2 bg-surface flex items-center justify-center p-8 md:p-16 lg:p-24 pt-20 lg:pt-8 relative overflow-y-auto">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden mb-12">
            <h1 className="font-display text-4xl text-primary font-semibold tracking-tighter" onClick={() => navigate('/')}>Savour</h1>
          </div>
          
          <header className="mb-10">
            <h2 className="font-display text-4xl text-on-surface mb-3 font-bold tracking-tight">Join the Community.</h2>
            <p className="text-on-surface-variant font-body text-base">Create an account to start your collection.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="group">
                <label htmlFor="firstName" className="block text-xs font-label font-bold tracking-[0.15em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Julia" 
                  className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2.5 font-body text-base text-on-surface placeholder:text-outline/40 transition-all" 
                />
              </div>
               <div className="group">
                <label htmlFor="lastName" className="block text-xs font-label font-bold tracking-[0.15em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Child" 
                  className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2.5 font-body text-base text-on-surface placeholder:text-outline/40 transition-all" 
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="username" className="block text-xs font-label font-bold tracking-[0.15em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors">Pen Name (Username)</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="masterchef24" 
                className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2.5 font-body text-base text-on-surface placeholder:text-outline/40 transition-all" 
              />
            </div>

            <div className="group">
              <label htmlFor="email" className="block text-xs font-label font-bold tracking-[0.15em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="julia@savour.com" 
                className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2.5 font-body text-base text-on-surface placeholder:text-outline/40 transition-all" 
              />
            </div>
            
            <div className="group">
              <label htmlFor="password" className="block text-xs font-label font-bold tracking-[0.15em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2.5 font-body text-base text-on-surface placeholder:text-outline/40 transition-all" 
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

            <div className="pt-6">
              <button type="submit" className="w-full bg-primary text-on-primary font-label font-semibold tracking-widest uppercase py-4 px-8 rounded-sm hover:bg-primary-container transition-all active:scale-[0.98]">
                  Start Your Anthology
              </button>
            </div>
          </form>

          <footer className="mt-12 pt-8 border-t border-outline-variant/20">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-on-surface-variant text-base font-body">
                  Already a member? 
                  <Link to="/login" className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 ml-1">Sign In</Link>
              </p>
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
            <span className="font-technical text-xs text-primary block leading-none mb-1.5 pr-4">CHEF'S NOTE</span>
            <span className="font-technical text-[11px] text-on-surface-variant block leading-tight max-w-[140px]">Ensure your oven is pre-heated before starting.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;