import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { 
  TrendingUp, 
  LocalHospital, 
  Healing, 
  Warning,
  People,
  Timeline
} from '@mui/icons-material';
import { GlobalData } from '../types/covid';
import { formatNumber } from '../services/covidService';

interface GlobalStatsProps {
  globalData: GlobalData;
}

const StatCard: React.FC<{
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
  subtitle?: string;
}> = ({ title, value, color, icon, subtitle }) => (
  <Card sx={{ 
    background: 'rgba(255, 255, 255, 0.95)', 
    backdropFilter: 'blur(10px)',
    border: `2px solid ${color}`,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 25px ${color}40`
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          color, 
          mr: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ 
        fontWeight: 700, 
        color,
        mb: 1
      }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const GlobalStats: React.FC<GlobalStatsProps> = ({ globalData }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatCard
          title="Всего случаев"
          value={formatNumber(globalData.cases)}
          color="#1976d2"
          icon={<TrendingUp />}
          subtitle={`+${formatNumber(globalData.todayCases)} сегодня`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatCard
          title="Активные случаи"
          value={formatNumber(globalData.active)}
          color="#ed6c02"
          icon={<LocalHospital />}
          subtitle={`${((globalData.active / globalData.cases) * 100).toFixed(1)}% от общего числа`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatCard
          title="Выздоровевшие"
          value={formatNumber(globalData.recovered)}
          color="#2e7d32"
          icon={<Healing />}
          subtitle={`+${formatNumber(globalData.todayRecovered)} сегодня`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatCard
          title="Смерти"
          value={formatNumber(globalData.deaths)}
          color="#d32f2f"
          icon={<Warning />}
          subtitle={`+${formatNumber(globalData.todayDeaths)} сегодня`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatCard
          title="Критические"
          value={formatNumber(globalData.critical)}
          color="#9c27b0"
          icon={<LocalHospital />}
          subtitle={`${((globalData.critical / globalData.cases) * 100).toFixed(1)}% от общего числа`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <StatCard
          title="Тесты"
          value={formatNumber(globalData.tests)}
          color="#7b1fa2"
          icon={<Timeline />}
          subtitle={`${globalData.testsPerOneMillion.toFixed(0)} на миллион`}
        />
      </Grid>
    </Grid>
  );
};

export default GlobalStats; 