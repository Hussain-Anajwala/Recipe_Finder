import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`transition-colors duration-150 ${
        isActive(to)
          ? 'text-primary font-medium'
          : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 glass-surface border-b border-outline-variant">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <span className="font-headline text-2xl text-primary tracking-tight leading-none">
              Savour
            </span>
            <span className="hidden sm:inline font-technical text-xs text-on-surface-variant mt-1">
              recipe finder
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLink('/recipes', 'Explore')}
            {user && navLink('/add', 'Submit Recipe')}
            {user && navLink('/my-recipes', 'My Recipes')}
            {user?.role === 'admin' && navLink('/admin', 'Admin')}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-base">account_circle</span>
                  <span className="font-medium">{user.firstName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm border border-outline-variant text-on-surface-variant hover:text-error hover:border-error rounded transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-sm bg-primary text-on-primary rounded hover:opacity-90 transition-opacity font-medium"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-on-surface-variant hover:text-on-surface"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-outline-variant py-4 flex flex-col gap-4 text-sm">
            {navLink('/recipes', 'Explore Recipes')}
            {user && navLink('/add', 'Submit Recipe')}
            {user && navLink('/my-recipes', 'My Recipes')}
            {user && navLink('/profile', 'Profile')}
            {user?.role === 'admin' && navLink('/admin', 'Admin Dashboard')}
            <div className="pt-2 border-t border-outline-variant">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-left text-error text-sm"
                >
                  Sign out
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-on-surface-variant hover:text-on-surface">Sign in</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-primary font-medium">Join Savour</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
