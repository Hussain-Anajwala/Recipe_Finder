import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import Signup from "./components/Signup";
import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe";
import EditRecipe from "./components/EditRecipe";
import MyRecipes from "./components/MyRecipes";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import UserManagement from "./components/UserManagement";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import './style.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recipes" element={<RecipeList />} />
          
          {/* Protected User Routes */}
          <Route path="/add" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
          <Route path="/edit-recipe/:id" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
          <Route path="/my-recipes" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin={true}><UserManagement /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;