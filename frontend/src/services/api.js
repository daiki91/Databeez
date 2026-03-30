import axios from 'axios';

// Déterminer l'URL API selon l'environnement
export const getApiUrl = () => {
  // Priorité 1: Variable d'environnement (pour les builds)
  if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('backend')) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Priorité 2: Logique client (pour le développement avec Docker)
  // Si on accède depuis le navigateur sur localhost, utiliser localhost
  // Si on accède depuis Docker interne, utiliser le nom de service
  const hostname = window.location.hostname;
  
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
    return "http://localhost:3000/api";
  }
  
  // Si accès depuis une autre URL, utiliser le nom de service Docker
  return "http://localhost:3000/api";
};

export const API_URL = getApiUrl();

// Créer une instance axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
