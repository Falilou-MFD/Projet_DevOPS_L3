import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/axios';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../utils/constants';

function LoginForm() {
  const [compteur, setCompteur] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!compteur.trim()) {
      setError('Veuillez entrer votre numéro de compteur');
      return;
    }

    setLoading(true);

    try {
      const response = await api.login(compteur);
      const { token, typeUtilisateur, id_compteur, user } = response.data;

      login(token, {
        name: user.name,
        email: user.email,
        typeUtilisateur,
        compteur: id_compteur,
      });

      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Numéro de compteur invalide');
      } else if (err.code === 'ERR_NETWORK') {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        setError(ERROR_MESSAGES.SERVER_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 400,
        width: '100%',
        borderRadius: 2,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <img
          src="/logo.png"
          alt="Woyofal Logo"
          style={{ height: 80, marginBottom: 16 }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
          Connexion Woyofal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Entrez votre numéro de compteur
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Numéro de compteur"
          variant="outlined"
          value={compteur}
          onChange={(e) => setCompteur(e.target.value)}
          disabled={loading}
          autoFocus
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <Box mt={2}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Mode démo : utilisez n'importe quel numéro pour tester
        </Typography>
      </Box>
    </Paper>
  );
}

export default LoginForm;
