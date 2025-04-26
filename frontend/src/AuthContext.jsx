import React, { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated, logoutUser } from './apis/LoginAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check authentication status on component mount
    const auth = isAuthenticated();
    setIsLoggedIn(auth);
    
    if (auth) {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    }
    
    // Set loading to false once authentication state is determined
    setLoading(false);
  }, []);

  const login = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const logout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUsername(null);
  };

  const user = { username };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
