import axios from 'axios';

// Configuration de l'API
const API_URL = 'https://lvvhbkfyqvflxnvcxfhp.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dmhia2Z5cXZmbHhudmN4ZmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjI3NjgsImV4cCI6MjA1OTY5ODc2OH0.grR-YWtlCUW14YCIQQp2f6ibLSPc0LKcU2Rim2ZbZtc';

// Instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'apikey': ANON_KEY,
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Services d'authentification
export const authService = {
  // Inscription d'un utilisateur
  signup: async (email, password, username, description = '', avatar_url = '') => {
    try {
      // Créer l'utilisateur dans Supabase Auth
      const authResponse = await api.post('/auth/v1/signup', {
        email,
        password
      });
      
      // Si la création réussit, ajouter le username et description dans la table users
      if (authResponse.data && authResponse.data.id) {
        await api.post('/rest/v1/users', {
          id: authResponse.data.id,
          email,
          username,
          description,
          avatar_url
        }, {
          headers: {
            'Authorization': `Bearer ${authResponse.data.access_token}`,
            'Prefer': 'return=minimal'
          }
        });
        
        return authResponse.data;
      }
      
      return authResponse.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Connexion d'un utilisateur
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/v1/token?grant_type=password', {
        email,
        password
      });
      
      // Stocker le token dans le localStorage
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Récupérer l'utilisateur connecté
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Services pour les tweets
export const tweetService = {
  // Récupérer tous les tweets
  getAllTweets: async () => {
    try {
      const response = await api.get('/rest/v1/tweets?select=id,content,created_at,users(id,username,avatar_url)&order=created_at.desc');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Créer un tweet
  createTweet: async (content) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.post('/rest/v1/tweets', {
        user_id: user.id,
        content
      }, {
        headers: {
          'Prefer': 'return=representation'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Supprimer un tweet
  deleteTweet: async (tweetId) => {
    try {
      const response = await api.delete(`/rest/v1/tweets?id=eq.${tweetId}`, {
        headers: {
          'Prefer': 'return=minimal'
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

// Services pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: async () => {
    try {
      const response = await api.get('/rest/v1/users?select=id,username,description,avatar_url,created_at&order=username.asc');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Récupérer un profil utilisateur par username
  getUserProfile: async (username) => {
    try {
      const response = await api.get(`/rest/v1/users?username=eq.${username}&select=id,username,description,avatar_url,created_at`);
      return response.data[0] || null;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Mettre à jour un profil utilisateur
  updateUserProfile: async (description, avatar_url) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.patch(`/rest/v1/users?id=eq.${user.id}`, {
        description,
        avatar_url
      }, {
        headers: {
          'Prefer': 'return=representation'
        }
      });
      
      return response.data[0] || null;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Récupérer les tweets d'un utilisateur
  getUserTweets: async (userId) => {
    try {
      const response = await api.get(`/rest/v1/tweets?user_id=eq.${userId}&select=id,content,created_at&order=created_at.desc`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default api;