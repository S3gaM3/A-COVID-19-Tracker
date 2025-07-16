import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Coronavirus, Timeline } from '@mui/icons-material';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Coronavirus sx={{ fontSize: 32, color: '#fff' }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#fff' }}>
            Трекер COVID-19
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline sx={{ color: '#fff' }} />
          <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8 }}>
            Данные в реальном времени
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 