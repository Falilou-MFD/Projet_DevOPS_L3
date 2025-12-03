import { createTheme } from '@mui/material/styles';
import { extractedPalette } from './paletteFromImage';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: extractedPalette.primary,
      contrastText: '#fff',
    },
    secondary: {
      main: extractedPalette.secondary,
      contrastText: '#fff',
    },
    background: {
      default: extractedPalette.neutral.light,
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: extractedPalette.primary,
      contrastText: '#fff',
    },
    secondary: {
      main: extractedPalette.secondary,
      contrastText: '#fff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
});
