import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, Alert } from '@mui/material';
import AppHeader from '../components/common/AppHeader';
import AmountSimulator from '../components/dashboard/AmountSimulator';
import SimulationResult from '../components/dashboard/SimulationResult';
import PurchaseHistory from '../components/dashboard/PurchaseHistory';
import HistoryChart from '../components/dashboard/HistoryChart';
import MLRecommendation from '../components/dashboard/MLRecommendation';
import Loader from '../components/common/Loader';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

function DashboardPage({ darkMode, toggleTheme }) {
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationMontant, setSimulationMontant] = useState(null);
  const [history, setHistory] = useState(null);
  const [recommendedAmount, setRecommendedAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.getHistory(user.compteur);
      setHistory(response.data);
    } catch (err) {
      setError("Impossible de charger l'historique");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulationComplete = (result, montant) => {
    setSimulationResult(result);
    setSimulationMontant(montant);
  };

  const handleUseRecommendation = (amount) => {
    setRecommendedAmount(amount);
  };

  const handleSaveSuccess = () => {
    // Recharger l'historique après l'enregistrement
    loadHistoryData();
  };

  if (loading) {
    return <Loader message="Chargement du tableau de bord..." />;
  }

  return (
    <>
      <AppHeader darkMode={darkMode} toggleTheme={toggleTheme} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Tableau de bord
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenue {user?.name} ! Simulez vos recharges et consultez votre consommation.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Colonne gauche : Simulateur et Résultat */}
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" gap={3}>
              <AmountSimulator
                onSimulationComplete={handleSimulationComplete}
                recommendedAmount={recommendedAmount}
              />

              {simulationResult && (
                <SimulationResult
                  result={simulationResult}
                  montant={simulationMontant}
                  onSaveSuccess={handleSaveSuccess}
                />
              )}
            </Box>
          </Grid>

          {/* Colonne droite : Recommandation ML */}
          <Grid item xs={12} md={6}>
            <MLRecommendation onUseRecommendation={handleUseRecommendation} />
          </Grid>

          {/* Ligne complète : Graphique de consommation */}
          <Grid item xs={12}>
            <HistoryChart history={history} />
          </Grid>

          {/* Ligne complète : Historique des achats */}
          <Grid item xs={12}>
            <PurchaseHistory history={history} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default DashboardPage;
