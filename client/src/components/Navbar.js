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
      <style>{`
        .navbar {
          padding: 15px 30px;
          background: #2c3e50;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .navbar-brand {
          font-size: 24px;
          font-weight: bold;
          color: white;
          text-decoration: none;
          margin-right: 40px;
        }

        .navbar-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .navbar-link {
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 15px;
        }

        .navbar-link:hover {
          opacity: 0.8;
        }

        .user-welcome {
          color: #ecf0f1;
          margin: 0 10px;
        }

        .logout-btn {
          padding: 8px 16px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: #c0392b;
        }

        .recipe-badge {
          background: #3498db;
          color: white;
          border-radius: 10px;
          padding: 2px 8px;
          font-size: 12px;
          font-weight: bold;
        }

        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: 2px solid white;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #2c3e50;
          flex-direction: column;
          padding: 20px;
          gap: 15px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          z-index: 1000;
        }

        .mobile-menu.active {
          display: flex;
        }

        .mobile-menu-link {
          color: white;
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-menu-link:last-child {
          border-bottom: none;
        }

        /* Responsive Design */
        @media screen and (max-width: 768px) {
          .navbar {
            padding: 12px 15px;
          }

          .navbar-brand {
            font-size: 20px;
            margin-right: 0;
          }

          .navbar-links {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .user-welcome {
            margin: 0;
          }

          .logout-btn {
            padding: 6px 12px;
            font-size: 13px;
          }
        }

        @media screen and (max-width: 480px) {
          .navbar {
            padding: 10px 12px;
          }

          .navbar-brand {
            font-size: 18px;
          }

          .mobile-menu {
            padding: 15px;
          }
        }
      `}</style>

      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          Recipe Recommender
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/recipes" className="navbar-link">
            Recipes
            {recipeCount > 0 && (
              <span className="recipe-badge">{recipeCount}</span>
            )}
          </Link>
          
          {isAuthenticated() ? (
            <>
              <Link to="/add" className="navbar-link">Add Recipe</Link>
              {isAdmin() ? (
                <>
                  <Link to="/admin" className="navbar-link">Admin Dashboard</Link>
                  <Link to="/admin/users" className="navbar-link">User Management</Link>
                </>
              ) : (
                <Link to="/my-recipes" className="navbar-link">My Recipes</Link>
              )}
              <Link to="/profile" className="navbar-link">Profile</Link>
              <span className="user-welcome">Welcome, {user?.firstName || 'User'}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/recipes" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
            Recipes {recipeCount > 0 && <span className="recipe-badge">{recipeCount}</span>}
          </Link>
          
          {isAuthenticated() ? (
            <>
              <Link to="/add" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Add Recipe</Link>
              {isAdmin() ? (
                <>
                  <Link to="/admin" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                  <Link to="/admin/users" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>User Management</Link>
                </>
              ) : (
                <Link to="/my-recipes" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>My Recipes</Link>
              )}
              <Link to="/profile" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              <div className="mobile-menu-link user-welcome">
                Welcome, {user?.firstName || 'User'}
              </div>
              <button onClick={handleLogout} className="logout-btn" style={{ marginTop: '10px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
