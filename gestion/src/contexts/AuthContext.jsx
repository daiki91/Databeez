import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { useMutation } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  // Mock pour enregistrement (à intégrer avec l'API)
  const registerMutation = useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => {
      // Après inscription réussie, on peut rediriger vers login
    },
  });

  // Mock pour connexion
  const loginMutation = useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: (data) => {
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }
    },
  });

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    register: registerMutation,
    login: loginMutation,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
