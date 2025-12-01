// ============================================
// src/pages/ProfilePage.jsx - VERSION CORRIGÉE
// ============================================
import React from 'react';
import { Container, Box, Paper, Typography, Grid, Divider, Chip, Avatar } from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AccountCircle as AccountIcon,
  ElectricBolt as ElectricIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/common/AppHeader';
import { USER_TYPE_LABELS } from '../utils/constants';

function ProfilePage({ darkMode, toggleTheme }) {
  const { user } = useAuth();

  // Fonction helper pour obtenir le label du type d'utilisateur
  const getUserTypeLabel = (typeUtilisateur) => {
    return USER_TYPE_LABELS[typeUtilisateur] || 'Particulier';
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <Box display="flex" alignItems="center" gap={2} py={2}>
      <Icon color="primary" />
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {value || 'Non renseigné'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppHeader darkMode={darkMode} toggleTheme={toggleTheme} />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Mon Profil
              </Typography>
              <Chip
                label={getUserTypeLabel(user?.typeUtilisateur)}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoRow icon={PersonIcon} label="Nom" value={user?.name} />
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoRow icon={EmailIcon} label="Email" value={user?.email} />
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoRow icon={ElectricIcon} label="Numéro de compteur" value={user?.compteur} />
            </Grid>

            <Grid item xs={12} md={6}>
              <InfoRow
                icon={AccountIcon}
                label="Type de compte"
                value={getUserTypeLabel(user?.typeUtilisateur)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              À propos de Woyofal
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Woyofal est le service d'électricité prépayée de la Senelec qui vous permet de gérer
              votre consommation électrique de manière flexible et transparente.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cette application vous aide à simuler vos recharges et à optimiser votre consommation
              grâce à des recommandations personnalisées basées sur l'intelligence artificielle.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default ProfilePage;
