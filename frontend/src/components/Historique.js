import React, { useState, useEffect } from 'react';
import { privateAxios } from '../api/axios';

function Historique() {
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistorique();
    }, []);

    const fetchHistorique = async () => {
        try {
            const response = await privateAxios.get('/historique/');
            setHistorique(response.data);
        } catch (err) {
            setError("Impossible de charger l'historique des achats.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // Fonction utilitaire pour le formatage
    const formatFCFA = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    if (loading) {
        return <div className="card"><h2>Historique des Achats</h2><p>Chargement de l'historique...</p></div>;
    }

    if (error) {
        return <div className="card"><h2 className="error-message">Erreur</h2><p>{error}</p></div>;
    }

     const totalMontant = historique.reduce(
    (sum, achat) => sum + Number(achat.montant_fcfa || 0),
        0
    );

    const totalKwh = historique.reduce(
        (sum, achat) => sum + Number(achat.kwh_obtenus || 0),
        0
    );


    return (
        <div className="card historique-card" style={{maxWidth: '800px'}}>
            <h2>Historique des {historique.length} Achats</h2>

            <div className="historique-summary" style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
    
            <div className="card summary-card" style={{flex: 1, textAlign: 'center'}}>
                <h3>Montant total</h3>
                <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                    {formatFCFA(totalMontant)}
                </p>
            </div>

            <div className="card summary-card" style={{flex: 1, textAlign: 'center'}}>
                <h3>Total kWh achetés</h3>
                <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                    {totalKwh.toFixed(2)} kWh
                </p>
            </div>



            </div>
            
            {historique.length === 0 ? (
                <p>Aucun achat historique trouvé pour votre compte.</p>
            ) : (
                <div className="historique-list">
                    {historique.map((achat, index) => (
                        <div key={index} className="historique-item">
                            <p><strong>Compteur :</strong> {achat.numero_compteur}</p>
                            <p><strong>Date d'Achat :</strong> {new Date(achat.date_achat).toLocaleString('fr-FR')}</p>
                            <p><strong>Montant :</strong> {formatFCFA(achat.montant_fcfa)}</p>
                            <p><strong>Énergie Obtenue :</strong> {parseFloat(achat.kwh_obtenus).toFixed(2)} kWh</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Historique;