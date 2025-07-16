import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Paper } from '@mui/material';
import { CovidData } from '../types/covid';
import GlobalStats from './GlobalStats';
import CountryTable from './CountryTable';
import Charts from './Charts';

/**
 * Пропсы для компонента Dashboard
 */
interface DashboardProps {
  data: CovidData; // Данные COVID-19
}

/**
 * Главная панель управления приложения
 * Отображает все основные компоненты в удобной сетке
 * 
 * @param data - объект с глобальными данными и списком стран
 */
const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Состояние для отслеживания выбранных стран
  // Используется для фильтрации графиков
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  return (
    <Container maxWidth="xl">
      {/* Заголовок панели */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" sx={{ 
          color: '#fff', 
          fontWeight: 600, 
          textAlign: 'center',
          mb: 2,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)' // Тень для лучшей читаемости
        }}>
          Глобальная статистика COVID-19
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#fff', 
          textAlign: 'center',
          opacity: 0.9,
          mb: 4
        }}>
          Последнее обновление: {new Date(data.global.updated).toLocaleString('ru-RU')}
        </Typography>
      </Box>

      {/* Основная сетка компонентов */}
      <Grid container spacing={3}>
        {/* Секция глобальной статистики - занимает всю ширину */}
        <Grid item xs={12}>
          <GlobalStats globalData={data.global} />
        </Grid>

        {/* Секция графиков - 8/12 на больших экранах */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)' // Эффект размытия для современного вида
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Тренды COVID-19
            </Typography>
            <Charts 
              countries={data.countries.slice(0, 10)} // Показываем топ-10 стран
              selectedCountries={selectedCountries}
              onCountrySelect={setSelectedCountries}
            />
          </Paper>
        </Grid>

        {/* Секция топ стран - 4/12 на больших экранах */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Топ пострадавших стран
            </Typography>
            <CountryTable 
              countries={data.countries.slice(0, 10)} // Топ-10 стран
              selectedCountries={selectedCountries}
              onCountrySelect={setSelectedCountries}
            />
          </Paper>
        </Grid>

        {/* Полный список стран - занимает всю ширину */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Все страны
            </Typography>
            <CountryTable 
              countries={data.countries} // Все страны
              selectedCountries={selectedCountries}
              onCountrySelect={setSelectedCountries}
              showAll
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 