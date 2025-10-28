// API Configuration
// This file manages the base API URL for all axios requests

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const BASE_URL = API_URL;

// Helper function to create full API endpoint URL
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${BASE_URL}/${cleanEndpoint}`;
};

export default BASE_URL;

