import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ padding: "15px 30px", background: "#2c3e50", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Link to="/" style={{ fontSize: "24px", fontWeight: "bold", color: "white", textDecoration: "none", marginRight: "40px" }}>
          Recipe Recommender
        </Link>
      </div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/recipes" style={{ color: "white", textDecoration: "none" }}>Recipes</Link>
        
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
