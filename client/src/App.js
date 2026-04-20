import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Signup from './components/Signup';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/AddRecipe';
import EditRecipe from './components/EditRecipe';
import MyRecipes from './components/MyRecipes';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background text-on-surface">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/recipes" element={<RecipeList />} />

              {/* Protected: User */}
              <Route path="/add" element={
                <ProtectedRoute><AddRecipe /></ProtectedRoute>
              } />
              <Route path="/edit-recipe/:id" element={
                <ProtectedRoute><EditRecipe /></ProtectedRoute>
              } />
              <Route path="/my-recipes" element={
                <ProtectedRoute><MyRecipes /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              {/* Protected: Admin only */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;