import React from 'react';
import { Box, Container } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';

function LoginPage() {
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
        <LoginForm />
      </Container>
    </Box>
  );
}

export default LoginPage;
