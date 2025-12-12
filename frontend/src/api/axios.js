import axios from 'axios';

// 1. Définir l'URL de base de votre API Django
// *** ASSUREZ-VOUS que ceci correspond à l'adresse de votre backend ***
export const BASE_URL = 'http://127.0.0.1:8000/';

// Instance pour les requêtes publiques (Login, Register)
export const publicAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Instance pour les requêtes privées (Simulation, Historique, ML)
export const privateAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// --- Intercepteur de Réponse pour le Refresh Token ---
privateAxios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // Si l'erreur est 401 (Unauthorized) ET que ce n'est PAS la requête de refresh elle-même
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marquer la requête comme déjà tentée
            
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                // Si pas de refresh token, on déconnecte et on arrête
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; 
                return Promise.reject(error); 
            }

            try {
                // Tenter de rafraîchir le token
                const response = await publicAxios.post('/auth/token/refresh/', { 
                    refresh: refreshToken 
                });

                const newAccessToken = response.data.access;
                
                // Mettre à jour les tokens dans le localStorage
                localStorage.setItem('access_token', newAccessToken);

                // Mettre à jour l'entête de la requête originale avec le nouveau token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Rejouer la requête initiale qui a échoué
                return privateAxios(originalRequest);

            } catch (refreshError) {
                // Si le refresh token est invalide, déconnexion forcée
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// --- Intercepteur de Requête pour ajouter le Token Access ---
privateAxios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);