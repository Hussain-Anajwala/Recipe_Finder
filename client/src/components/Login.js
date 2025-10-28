import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../config/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // Default to user
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

      // Verify the role matches what user selected
      if (response.data.user.role !== formData.role) {
        toast.error(`Invalid credentials. This account is registered as ${response.data.user.role}, not ${formData.role}.`);
        return;
      }

      // Use the login function from AuthContext
      login(response.data.token, response.data.user);

      console.log('Login successful:', response.data);
      toast.success(`Welcome ${response.data.user.firstName}!`);

      // Redirect based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/my-recipes');
      }

    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      toast.error(`Login failed: ${error.response ? error.response.data.message : 'Invalid credentials'}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }} className="responsive-container">
      <style>{`
        @media screen and (max-width: 768px) {
          .responsive-container {
            padding: 20px 15px !important;
          }

          .radio-group {
            flex-direction: column !important;
            gap: 10px !important;
          }

          input[type="email"],
          input[type="password"] {
            font-size: 16px !important;
          }
        }
      `}</style>
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Login As:</label>
          <div className="radio-group" style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              <span>👤 User</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              <span>👨‍💼 Admin</span>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' }}
          />
        </div>

        {formData.role === 'admin' && (
          <div style={{ padding: '12px', background: '#fff3cd', borderLeft: '4px solid #ffc107', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
            <strong>Admin Login:</strong> Use admin credentials only
          </div>
        )}

        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: formData.role === 'admin' ? '#e74c3c' : '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          Login as {formData.role === 'admin' ? 'Admin' : 'User'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Don't have an account? <Link to="/signup" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link></p>
      </div>
    </div>
  );
}

export default Login;