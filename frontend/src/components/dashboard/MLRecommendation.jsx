import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button, Alert, CircularProgress, Chip } from '@mui/material';
import { AutoAwesome as AIIcon, TrendingUp as TrendIcon } from '@mui/icons-material';
import { api } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';

function MLRecommendation({ onUseRecommendation }) {
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRecommendation();
  }, []);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.getRecommendation(user.compteur);
      setRecommendation(response.data);
    } catch (err) {
      setError('Impossible de charger la recommandation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Alert severity="warning">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${(theme) => theme.palette.secondary.main}22 0%, ${(theme) => theme.palette.primary.main}22 100%)`,
        border: (theme) => `2px solid ${theme.palette.primary.main}`,
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AIIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Recommandation IA
        </Typography>
        <Chip label="Nouveau" size="small" color="primary" />
      </Box>

      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Montant recommandé basé sur votre historique
        </Typography>
        <Typography variant="h3" fontWeight={700} color="primary.main">
          {formatCurrency(recommendation.montant_conseille)}
        </Typography>
      </Box>

      <Alert severity="info" icon={<TrendIcon />} sx={{ mb: 2 }}>
        Ce montant est optimisé selon vos habitudes de consommation pour maximiser votre efficacité
        énergétique.
      </Alert>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => onUseRecommendation(recommendation.montant_conseille)}
        startIcon={<AIIcon />}
      >
        Utiliser cette recommandation
      </Button>
    </Paper>
  );
}

export default MLRecommendation;
