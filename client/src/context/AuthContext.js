import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const decoded = jwtDecode(token);
        // Check expiry
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          // Fetch fresh user profile
          axios.get('/api/auth/profile')
            .then(res => setUser(res.data))
            .catch(() => logout())
            .finally(() => setLoading(false));
        }
      } catch {
        logout();
        setLoading(false);
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const login = (tokenValue, userData) => {
    localStorage.setItem('token', tokenValue);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
