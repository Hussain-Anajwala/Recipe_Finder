import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../config/api";

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recipeCount, setRecipeCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchRecipeCount = async () => {
      try {
        const response = await API.get('/api/recipes');
        setRecipeCount(response.data.length);
      } catch (error) {
        console.error('Error fetching recipe count:', error);
      }
    };

    fetchRecipeCount();
  }, []);

  return (
    <>
      {/* TopNavBar (Shared Component) */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-[#fcf9f4]/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-stone-200/20 shadow-sm">
        <Link to="/" className="text-3xl font-serif text-orange-800 dark:text-orange-600 tracking-tighter">Savour</Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/recipes" className="text-orange-800 dark:text-orange-500 font-semibold text-sm border-b-[1px] border-orange-800 hover:text-orange-700 dark:hover:text-orange-400 transition-colors">
            Discover
            {recipeCount > 0 && <span className="ml-2 bg-orange-800 text-white text-[10px] px-1.5 py-0.5 rounded-full">{recipeCount}</span>}
          </Link>
          
          {isAuthenticated() ? (
            <>
              <Link to="/add" className="text-stone-600 dark:text-stone-400 font-medium hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Add a Recipe</Link>
              {isAdmin() ? (
                <>
                  <Link to="/admin" className="text-stone-600 dark:text-stone-400 font-medium hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Admin Dashboard</Link>
                  <Link to="/admin/users" className="text-stone-600 dark:text-stone-400 font-medium hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Manage Users</Link>
                </>
              ) : (
                <Link to="/my-recipes" className="text-stone-600 dark:text-stone-400 font-medium hover:text-orange-700 dark:hover:text-orange-400 transition-colors">My Kitchen</Link>
              )}
              <Link to="/profile" className="text-stone-600 dark:text-stone-400 font-medium hover:text-orange-700 dark:hover:text-orange-400 transition-colors">Profile</Link>
            </>
          ) : null}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-orange-800 hidden md:block" style={{fontVariationSettings: "'wght' 200"}}>restaurant_menu</span>
          
          {isAuthenticated() ? (
            <div className="hidden md:flex items-center gap-4">
               <span className="text-stone-600 font-body text-sm italic">Welcome, {user?.firstName || 'Chef'}</span>
               <button onClick={handleLogout} className="text-stone-600 font-medium text-sm px-4 py-2 hover:text-orange-700 transition-colors">Sign Out</button>
            </div>
          ) : (
            <div className="hidden md:flex gap-4">
              <Link to="/login" className="text-stone-600 font-medium text-sm px-4 py-2 hover:text-orange-700 transition-colors">Sign In</Link>
              <Link to="/signup" className="bg-primary text-on-primary px-5 py-2 text-sm font-semibold rounded-sm active:opacity-80 active:scale-95 transition-all">Join Savour</Link>
            </div>
          )}
          
          <button className="md:hidden text-orange-800 material-symbols-outlined text-3xl" onClick={() => setIsMobileMenuOpen(true)}>menu</button>
        </div>
      </nav>

      {/* SideNavBar (Mobile) */}
      <div className={`fixed inset-0 z-[60] flex flex-col w-full md:hidden bg-[#fcf9f4] dark:bg-stone-950 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} id="mobile-nav">
        <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
          <div className="text-2xl font-serif text-orange-800 dark:text-orange-500">Savour</div>
          <button className="text-outline" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col gap-2 p-6">
          <Link to="/recipes" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-400 rounded-sm px-4 py-3 scale-[0.98] transition-transform">
             <span className="material-symbols-outlined" data-icon="explore">explore</span>
             <span className="font-label uppercase tracking-widest text-sm">Discover {recipeCount > 0 && `(${recipeCount})`}</span>
          </Link>
          
          {isAuthenticated() ? (
            <>
              <Link to="/add" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-stone-600 dark:text-stone-400 px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-900 transition">
                <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
                <span className="font-label uppercase tracking-widest text-sm">Add a Recipe</span>
              </Link>
              {isAdmin() ? (
                <>
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-stone-600 dark:text-stone-400 px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-900 transition">
                    <span className="material-symbols-outlined" data-icon="shield">shield</span>
                    <span className="font-label uppercase tracking-widest text-sm">Admin Dashboard</span>
                  </Link>
                  <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-stone-600 dark:text-stone-400 px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-900 transition">
                    <span className="material-symbols-outlined" data-icon="group">group</span>
                    <span className="font-label uppercase tracking-widest text-sm">Manage Users</span>
                  </Link>
                </>
              ) : (
                <Link to="/my-recipes" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-stone-600 dark:text-stone-400 px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-900 transition">
                  <span className="material-symbols-outlined" data-icon="restaurant">restaurant</span>
                  <span className="font-label uppercase tracking-widest text-sm">My Kitchen</span>
                </Link>
              )}
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-stone-600 dark:text-stone-400 px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-900 transition">
                <span className="material-symbols-outlined" data-icon="person">person</span>
                <span className="font-label uppercase tracking-widest text-sm">Profile</span>
              </Link>
            </>
          ) : (
            <>
               <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-stone-600 dark:text-stone-400 px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-900 transition">
                <span className="material-symbols-outlined" data-icon="login">login</span>
                <span className="font-label uppercase tracking-widest text-sm">Sign In</span>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-stone-600 dark:text-stone-400 px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-900 transition">
                <span className="material-symbols-outlined" data-icon="person_add">person_add</span>
                <span className="font-label uppercase tracking-widest text-sm">Join Savour</span>
              </Link>
            </>
          )}
        </div>
        
        {isAuthenticated() && (
          <div className="p-6 border-t border-outline-variant/10 flex flex-col gap-4">
            <button onClick={handleLogout} className="w-full text-center py-4 text-outline font-label uppercase tracking-widest text-xs hover:bg-stone-100 transition">Sign Out</button>
          </div>
        )}
      </div>
    </>
  );
}
