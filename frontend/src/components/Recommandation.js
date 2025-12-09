import React, { useState, useEffect } from 'react';
import { privateAxios } from '../api/axios';

function Recommandation() {
    const [reco, setReco] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRecommandation();
    }, []);

    const fetchRecommandation = async () => {
        try {
            // C'est un GET sur l'endpoint /ml/recommandation/
            const response = await privateAxios.get('/ml/recommandation/');
            setReco(response.data);
        } catch (err) {
            setError("Impossible de générer une recommandation. Assurez-vous d'avoir un tarif assigné et des données historiques.");
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
            minimumFractionDigits: 0, // Pas de décimales pour un montant suggéré
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    if (loading) {
        return <div className="card"><h2>Recommandation ML</h2><p>Analyse de vos données en cours...</p></div>;
    }

    if (error) {
        return <div className="card"><h2 className="error-message">Erreur de Recommandation</h2><p>{error}</p></div>;
    }
    
    // S'assurer que les valeurs sont des nombres
    const montantSuggere = parseFloat(reco.montant_suggere);
    const dureeRecommandee = parseFloat(reco.duree_recommandee);

    return (
        <div className="card recommandation-card">
            <h2>Recommandation d'Achat (Machine Learning)</h2>
            <div className="reco-box">
                <p>Basé sur votre profil de consommation et votre type de compteur, nous vous suggérons un montant optimal pour votre prochain achat :</p>
                
                <div className="reco-montant">
                    {formatFCFA(montantSuggere)}
                </div>
                
                <p>est le montant idéal pour vous.</p>
                
                {dureeRecommandee > 0 && (
                    <p className="reco-duree">
                        Cet achat devrait durer environ **{Math.round(dureeRecommandee)} jours** d'autonomie.
                    </p>
                )}
                
                {/* <p style={{marginTop: '20px', fontStyle: 'italic', color: var('--secondary')}}>{reco.message}</p> */}
                <p className="reco-message-info">{reco.message}</p>
            </div>
        </div>
    );
}

export default Recommandation;