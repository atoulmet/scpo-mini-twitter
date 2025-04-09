import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);
  
  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Fonction d'inscription
  const signup = async (email, password, username, description, avatar_url) => {
    try {
      const data = await authService.signup(email, password, username, description, avatar_url);
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };
  
  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};