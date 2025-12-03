import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { PlayArrow as SimulateIcon } from '@mui/icons-material';
import { api } from '../../api/axios';
import { MIN_AMOUNT, MAX_AMOUNT, ERROR_MESSAGES } from '../../utils/constants';
import { formatCurrency } from '../../utils/format';

function AmountSimulator({ onSimulationComplete, recommendedAmount }) {
  const [montant, setMontant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimulate = async () => {
    setError('');

    const amount = parseFloat(montant);

    if (isNaN(amount) || amount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    if (amount < MIN_AMOUNT) {
      setError(`Le montant minimum est de ${formatCurrency(MIN_AMOUNT)}`);
      return;
    }

    if (amount > MAX_AMOUNT) {
      setError(`Le montant maximum est de ${formatCurrency(MAX_AMOUNT)}`);
      return;
    }

    setLoading(true);

    try {
      const response = await api.runSimulation(amount);
      onSimulationComplete(response.data, amount);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        setError(ERROR_MESSAGES.SERVER_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseRecommendation = () => {
    if (recommendedAmount) {
      setMontant(recommendedAmount.toString());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSimulate();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Simuler une recharge
      </Typography>

      <Box mt={2}>
        <TextField
          fullWidth
          label="Montant de la recharge"
          variant="outlined"
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          InputProps={{
            endAdornment: <InputAdornment position="end">FCFA</InputAdornment>,
          }}
          helperText={`Montant entre ${formatCurrency(MIN_AMOUNT)} et ${formatCurrency(MAX_AMOUNT)}`}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {recommendedAmount && (
          <Box mt={2}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleUseRecommendation}
              disabled={loading}
            >
              Utiliser le montant recommandé ({formatCurrency(recommendedAmount)})
            </Button>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSimulate}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SimulateIcon />}
          sx={{ mt: 2 }}
        >
          {loading ? 'Simulation en cours...' : 'Simuler'}
        </Button>
      </Box>
    </Paper>
  );
}

export default AmountSimulator;
