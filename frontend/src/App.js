import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Simulation from './components/Simulation';
import Historique from './components/Historique';
import Recommandation from './components/Recommandation';
import './App.css'; 

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    // Si l'utilisateur n'est pas authentifié, le rediriger vers la page de login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // Si authentifié, afficher le contenu dans le Layout
    return <Layout>{children}</Layout>;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Routes d'authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes protégées (entourées par le Layout) */}
            <Route path="/simulation" element={
                <ProtectedRoute>
                    <Simulation />
                </ProtectedRoute>
            } />
            <Route path="/historique" element={
                <ProtectedRoute>
                    <Historique />
                </ProtectedRoute>
            } />
            <Route path="/recommandation" element={
                <ProtectedRoute>
                    <Recommandation />
                </ProtectedRoute>
            } />

            {/* Redirection par défaut après connexion vers la simulation, ou vers login si déconnecté */}
            <Route path="/" element={<Navigate to="/simulation" />} />
            
            {/* Route 404 simple */}
            <Route path="*" element={<Layout><h1>404 | Page non trouvée</h1></Layout>} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;