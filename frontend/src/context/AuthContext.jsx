import React, { createContext, useContext, useState } from 'react';
import { publicAxios } from '../api/axios'; 
import jwt_decode from 'jwt-decode'; // Nécessite npm install jwt-decode (ou utilisez une fonction simple d'extraction)

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Fonction simple pour décoder le rôle si on ne veut pas installer jwt-decode
/*
const decodeRole = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        // Assurez-vous que 'role' est inclus dans le payload du token JWT par votre backend
        return decoded.role || 'P'; 
    } catch (e) {
        return 'P';
    }
}
*/

export const AuthProvider = ({ children }) => {
    const initialToken = localStorage.getItem('access_token');
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
    
    // Initialisation du rôle (si vous avez besoin du rôle dans le frontend)
    const [userRole, setUserRole] = useState(null); 
    
    // Fonction simple de décodage pour obtenir le rôle de l'utilisateur
    const decodeRoleFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role; 
        } catch (e) {
            return 'P'; // Par défaut
        }
    }


    const login = async (username, password) => {
        try {
            const response = await publicAxios.post('/auth/login/', {
                username,
                password
            });
            
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            setIsAuthenticated(true);
            setUserRole(decodeRoleFromToken(response.data.access)); // Définir le rôle après connexion
            
            return true; 
        } catch (error) {
            console.error("Erreur de connexion:", error.response?.data);
            setIsAuthenticated(false);
            throw error; 
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUserRole(null);
        // Redirection vers la page de connexion
        window.location.href = '/login'; 
    };

    const value = {
        isAuthenticated,
        userRole,
        login,
        logout,
        // On n'inclut pas register ici, car il ne crée pas d'état de session
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};