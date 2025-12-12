import React, { useState } from 'react';
import { privateAxios } from '../api/axios';

function Simulation() {
    const [montant, setMontant] = useState('');
    const [resultat, setResultat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResultat(null);

        // Validation simple côté client
        const montantValue = parseFloat(montant);
        if (isNaN(montantValue) || montantValue < 100) {
            setError("Le montant minimum est de 100 F CFA.");
            setLoading(false);
            return;
        }

        try {
            // Appel à l'endpoint de simulation
            const response = await privateAxios.post('/simulation/', {
                montant_fcfa: montantValue
            });
            
            setResultat(response.data);
            
        } catch (err) {
            // Afficher l'erreur retournée par la vue Django
            const errMsg = err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || "Erreur inconnue lors de la simulation.";
            setError(errMsg);
            console.error(err.response || err);
        } finally {
             setLoading(false);
        }
    };
    
    // Fonction utilitaire pour formater les devises
    const formatFCFA = (amount) => {
        if (amount === null || amount === undefined) return 'N/A';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF', // Code ISO pour le Franc CFA Ouest Africain
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    
    const formatKWH = (amount) => {
        if (amount === null || amount === undefined) return 'N/A';
        return parseFloat(amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kWh';
    }

    return (
        <div className="card simulation-card">
            <h2>Simuler votre Achat d'Électricité</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    placeholder="Montant en FCFA à recharger (min 100)"
                    min="100"
                    step="0.01"
                    required
                />
                <button type="submit" disabled={loading} style={{
                backgroundColor: '#E63946', /* Rouge Woyofal (couleur primaire) */
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                marginTop: '15px' 
            }}>
                {loading ? 'Simulation en cours...' : 'Simuler l\'Achat'}
            </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            
            {resultat && (
                <div className="resultat">
                    <h3>✅ Achat Simulé avec Succès</h3>
            
                    {/* <p style={{fontSize: '1.5em', fontWeight: 'bold', margin: '15px 0'}}>
                        ⚡ Énergie Obtenue : {parseFloat(resultat.kwh_obtenus).toFixed(2)} kWh
                        {/* {formatKWH(resultat.kwh_obtenus || 0)}  */}
                    {/* </p> */}

                    {/* <p style={{fontSize: '1.5em', fontWeight: 'bold', margin: '15px 0'}}>
                    ⚡Énergie Obtenue : {formatKWH(resultat.kwh_obtenus || 0)}
                     </p> */}


                    
                    <h4>Détail de la Répartition des {formatFCFA(resultat.repartition.montant_saisi_valide)} :</h4>
                    <ul>
                        <li>Redevance Fixe : {formatFCFA(resultat.repartition.redevance)}</li>
                        <li>Taxe Communale : {formatFCFA(resultat.repartition.taxe_communale)}</li>
                        <li>TVA ({resultat.taux_tva * 100}%) : {formatFCFA(resultat.repartition.tva)}</li>
                        <li>Achat Énergie HT : {formatFCFA(resultat.repartition.achat_energie_ht_total)}</li>
                    </ul>
                    <hr style={{margin: '10px 0'}}/>
                    <p>
                       Total Coût des kWh : {formatFCFA(resultat.repartition.achat_energie_ht_total)}
                    </p>
                    <p style={{marginTop: '5px', color: '#0056b3'}}>
                        *{resultat.kwh_obtenus > 0 ? `Prix moyen HT : ${formatFCFA(resultat.repartition.achat_energie_ht_total / resultat.kwh_obtenus)} / kWh` : "Prix moyen non applicable"}*
                    </p>

                    {/* --- NOUVELLE SECTION: Détails par Tranche --- */}
                    <h4 style={{marginTop: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px'}}>
                        Décomposition par Tranche Tarifaire
                    </h4>
                    <ul className="tranche-list" style={{paddingLeft: '20px'}}>
                        {resultat.tranches_details.map((tranche, index) => (
                            <li key={index} style={{marginBottom: '10px', listStyleType: 'disc'}}>
                                <strong>{tranche.tranche_nom}</strong>
                                <br/>
                                <span>- Volume : {formatKWH(tranche.kwh_dans_tranche)}</span>
                                <br/>
                                <span>- Prix Unitaire HT : {formatFCFA(tranche.prix_unitaire_kwh)} / kWh</span>
                                <br/>
                                <span style={{fontWeight: 'bold'}}>
                                    - Coût Total HT : {formatFCFA(tranche.cout_ht_tranche)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    {/* --- FIN DE LA NOUVELLE SECTION --- */}
                </div>
            )}
        </div>
    );
}

export default Simulation;