// API Configuration
// This file manages the base API URL for all axios requests

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with baseURL configured
const API = axios.create({
  baseURL: API_URL,
});

export default API;

// Also export BASE_URL for any components that might need it
export const BASE_URL = API_URL;

