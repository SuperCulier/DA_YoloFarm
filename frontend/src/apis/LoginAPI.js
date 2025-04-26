import axios from 'axios';
// import { LOGIN_API } from '../apis/apis';
import { LOGIN_API } from './apis';

export const loginUser = async (username, password) => {
  try {
    console.log("Sending request to:", LOGIN_API);
    const response = await axios.post(LOGIN_API, { username, password });
    console.log("Login API called with:", username);
    // Store authentication status in localStorage
    if (response.data) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const logoutUser = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};
