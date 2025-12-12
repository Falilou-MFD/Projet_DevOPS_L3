import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            // Redirection vers la page de simulation après succès
            navigate('/simulation', { replace: true });
        } catch (err) {
            // Afficher l'erreur de connexion
            const errMsg = err.response?.data?.detail || "Erreur de connexion. Vérifiez vos identifiants.";
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <p style={{textAlign: 'center', marginTop: '15px'}}>
                Pas encore de compte ? <Link to="/register">S'inscrire ici</Link>
            </p>
        </div>
    );
}

export default Login;