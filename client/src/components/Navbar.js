import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recipeCount, setRecipeCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchRecipeCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes');
        setRecipeCount(response.data.length);
      } catch (error) {
        console.error('Error fetching recipe count:', error);
      }
    };

    fetchRecipeCount();
  }, []);

  return (
    <nav style={{ padding: "15px 30px", background: "#2c3e50", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Link to="/" style={{ fontSize: "24px", fontWeight: "bold", color: "white", textDecoration: "none", marginRight: "40px" }}>
          Recipe Recommender
        </Link>
      </div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/recipes" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
          Recipes
          {recipeCount > 0 && (
            <span style={{ 
              background: "#3498db", 
              color: "white", 
              borderRadius: "10px", 
              padding: "2px 8px", 
              fontSize: "12px", 
              fontWeight: "bold" 
            }}>
              {recipeCount}
            </span>
          )}
        </Link>
        
        {isAuthenticated() ? (
          <>
            <Link to="/add" style={{ color: "white", textDecoration: "none" }}>Add Recipe</Link>
            {isAdmin() ? (
              <>
                <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>Admin Dashboard</Link>
                <Link to="/admin/users" style={{ color: "white", textDecoration: "none" }}>User Management</Link>
              </>
            ) : (
              <Link to="/my-recipes" style={{ color: "white", textDecoration: "none" }}>My Recipes</Link>
            )}
            <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</Link>
            <span style={{ color: "#ecf0f1" }}>Welcome, {user?.firstName || 'User'}</span>
            <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
