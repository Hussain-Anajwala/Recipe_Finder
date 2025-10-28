import React, { useState } from 'react';
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

  return (
    <main>
      <h2>Create Your Account</h2>
      <form id="regForm" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>

      <div className="footer-links">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </main>
  );
}

export default Signup;