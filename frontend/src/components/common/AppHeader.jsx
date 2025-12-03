import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../dashboard/ThemeToggle';

function AppHeader({ darkMode, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <img
            src="/logo.png"
            alt="Woyofal Logo"
            style={{ height: 40, marginRight: 12 }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Woyofal
          </Typography>
        </Box>

        {!isMobile && (
          <Box display="flex" gap={1} mr={2}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                fontWeight: isActive('/dashboard') ? 600 : 400,
                textDecoration: isActive('/dashboard') ? 'underline' : 'none',
              }}
            >
              Tableau de bord
            </Button>
            <Button
              color="inherit"
              startIcon={<PersonIcon />}
              onClick={() => navigate('/profile')}
              sx={{
                fontWeight: isActive('/profile') ? 600 : 400,
                textDecoration: isActive('/profile') ? 'underline' : 'none',
              }}
            >
              Profil
            </Button>
          </Box>
        )}

        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => navigate('/dashboard')}>
              <DashboardIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/profile')}>
              <PersonIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </>
        ) : (
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Déconnexion
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
