// API Configuration
// Uses environment variable in production, localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'https://csc-131-zeus-volunteers.onrender.com';

export default API_URL;
