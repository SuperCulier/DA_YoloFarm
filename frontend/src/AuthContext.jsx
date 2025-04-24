import React, { createContext, useState, useContext, useEffect } from 'react';
// import { isAuthenticated, logoutUser } from './apis/LoginAPI';
import { isAuthenticated, logoutUser } from './apis/LoginAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Check authentication status on component mount
    const auth = isAuthenticated();
    setIsLoggedIn(auth);
    
    if (auth) {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    }
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

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
