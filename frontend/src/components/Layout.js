import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout({ children }) {
    const { isAuthenticated, logout } = useAuth();

    return (
        <>
            <header className="header">
                <div className="logo">
                <img 
            src="./logo.png" // Utilisez le chemin d'accès à la racine du dossier public
            alt="Logo Woyofal XAM-XAM"
            style={{ 
                height: '30px', // Ajustez la taille selon vos besoins 
                marginRight: '9px',
            }}
        />
                Woyofal XAM-XAM
                </div>
                {isAuthenticated && (
                    <nav className="nav-links">
                        <NavLink to="/simulation">Simulation</NavLink>
                        <NavLink to="/historique">Historique</NavLink>
                        <NavLink to="/recommandation">Recommandation</NavLink>
                        <button onClick={logout}>Déconnexion</button>
                    </nav>
                )}
            </header>
            <main className="App">
                {children}
            </main>
        </>
    );
}

export default Layout;