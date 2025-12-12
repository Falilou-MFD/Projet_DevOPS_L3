import React, { useState, useMemo, useContext, createContext } from 'react';
import { lightTheme, darkTheme } from '../themes/theme'; // Assurez-vous du chemin correct

// Crée le contexte
const ThemeModeContext = createContext(null);

// Hook pour accéder au mode et à la fonction de basculement
export const useThemeMode = () => useContext(ThemeModeContext);

// Fournisseur du Thème
export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState('light'); // État initial

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Mémorise l'objet thème basé sur l'état 'mode'
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const value = useMemo(() => ({
    mode,
    toggleColorMode,
    theme,
  }), [mode, theme]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}