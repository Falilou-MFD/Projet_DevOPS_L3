import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const MOCK_MODE = process.env.REACT_APP_MOCK_API === 'true';

// Instance Axios configurée
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Données mockées pour les tests
const mockData = {
  login: {
    token: 'mock-token-123456',
    typeUtilisateur: 'particulier',
    id_compteur: '123456789',
    user: {
      name: 'Utilisateur Test',
      email: 'test@woyofal.sn',
    },
  },
  simulation: {
    kwh_total: 45.5,
    redevance: 500,
    taxe_communale: 200,
    tva: 900,
    tranches: [
      { nom: 'Tranche 1 (0-50 kWh)', montant: 2000, kwh: 20 },
      { nom: 'Tranche 2 (51-150 kWh)', montant: 3000, kwh: 25.5 },
    ],
    total: 5600,
  },
  history: {
    achats: [
      { date: '2024-11-20', montant: 5000, kwh: 40 },
      { date: '2024-10-15', montant: 7500, kwh: 60 },
      { date: '2024-09-10', montant: 6000, kwh: 48 },
    ],
    consommation_mensuelle: {
      mois: ['Sep', 'Oct', 'Nov'],
      kwh: [48, 60, 40],
    },
  },
  recommendation: {
    montant_conseille: 8500,
  },
  userProfile: {
    user: {
      name: 'Utilisateur Test',
      typeUtilisateur: 'particulier',
      compteur: '123456789',
      email: 'test@woyofal.sn',
    },
  },
};

// Fonction pour simuler un délai réseau
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// API avec mode mock intégré
export const api = {
  // Authentification
  login: async (compteur) => {
    if (MOCK_MODE) {
      await delay(500);
      return { data: mockData.login };
    }
    return axiosInstance.post('/auth/login', { compteur });
  },

  // Récupérer le profil utilisateur
  getMe: async () => {
    if (MOCK_MODE) {
      await delay(300);
      return { data: mockData.userProfile };
    }
    return axiosInstance.get('/auth/me');
  },

  // Simulation
  runSimulation: async (montant) => {
    if (MOCK_MODE) {
      await delay(800);
      return { data: mockData.simulation };
    }
    return axiosInstance.post('/simulation/run', { montant });
  },

  // Sauvegarder une recharge
  saveRecharge: async (data) => {
    if (MOCK_MODE) {
      await delay(500);
      return { data: { success: true, message: 'Recharge enregistrée (mock)' } };
    }
    return axiosInstance.post('/simulation/save', data);
  },

  // Historique
  getHistory: async (compteur) => {
    if (MOCK_MODE) {
      await delay(600);
      return { data: mockData.history };
    }
    return axiosInstance.get(`/simulation/history/${compteur}`);
  },

  // Recommandation ML
  getRecommendation: async (compteur) => {
    if (MOCK_MODE) {
      await delay(400);
      return { data: mockData.recommendation };
    }
    return axiosInstance.get(`/ml/recommendation/${compteur}`);
  },
};

export default axiosInstance;
