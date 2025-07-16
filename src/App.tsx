import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { CovidData } from './types/covid';
import { fetchCovidData } from './services/covidService';

/**
 * Основная тема приложения
 * Используем Material-UI для создания единого стиля
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea', // Основной цвет - синий градиент
    },
    secondary: {
      main: '#764ba2', // Дополнительный цвет - фиолетовый
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Современный шрифт
  },
});

/**
 * Главный компонент приложения
 * Управляет состоянием данных и отображением компонентов
 */
function App() {
  // Состояние для хранения данных COVID-19
  const [covidData, setCovidData] = useState<CovidData | null>(null);
  // Состояние загрузки для UX
  const [loading, setLoading] = useState(true);
  // Состояние ошибок для обработки проблем с API
  const [error, setError] = useState<string | null>(null);

  /**
   * Загрузка данных при монтировании компонента
   * Используем useEffect для side effects
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Получаем данные из API
        const data = await fetchCovidData();
        setCovidData(data);
        setError(null);
      } catch (err) {
        // Обработка ошибок с понятным сообщением для пользователя
        setError('Не удалось загрузить данные COVID-19. Попробуйте позже.');
        console.error('Error fetching COVID data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Основной контейнер с градиентным фоном */}
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      }}>
        {/* Заголовок приложения */}
        <Header />
        
        {/* Основной контент */}
        <Box sx={{ py: 4 }}>
          {/* Состояние загрузки */}
          {loading && (
            <Box className="loading">
              Загрузка данных COVID-19...
            </Box>
          )}
          
          {/* Отображение ошибок */}
          {error && (
            <Box className="error">
              {error}
            </Box>
          )}
          
          {/* Основная панель с данными */}
          {covidData && !loading && (
            <Dashboard data={covidData} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 