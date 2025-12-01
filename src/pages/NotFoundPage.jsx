import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #8E24AA 0%, #E63946 50%, #FF6F00 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center" color="white">
          <Typography variant="h1" fontWeight={700} fontSize={{ xs: 80, md: 120 }}>
            404
          </Typography>
          <Typography variant="h4" gutterBottom>
            Page non trouvée
          </Typography>
          <Typography variant="body1" paragraph>
            Désolé, la page que vous recherchez n'existe pas.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              mt: 2,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default NotFoundPage;
