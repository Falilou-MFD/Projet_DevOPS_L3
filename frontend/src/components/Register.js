import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicAxios } from '../api/axios';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'P' // Valeur par défaut : Particulier
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Utiliser publicAxios pour l'inscription
            await publicAxios.post('/auth/register/', formData);
            
            setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            // Optionnel: Rediriger automatiquement après quelques secondes
            setTimeout(() => navigate('/login'), 3000); 
        } catch (err) {
            // Gestion des erreurs de validation de Django
            const errorData = err.response?.data;
            let errMsg = "Erreur lors de l'inscription.";

            if (errorData) {
                // Concaténer les messages d'erreur de Django (ex: username déjà pris)
                errMsg = Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join(' | ');
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Inscription Client Woyofal</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="P">Particulier</option>
                    <option value="C">Commercial</option>
                    <option value="I">Industriel</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Inscription en cours...' : "S'inscrire"}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <p style={{textAlign: 'center', marginTop: '15px'}}>
                Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
}

export default Register;