import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <Tooltip title={darkMode ? 'Mode clair' : 'Mode sombre'}>
      <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
