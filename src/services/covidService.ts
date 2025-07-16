import axios from 'axios';
import { CovidData, CountryData, GlobalData } from '../types/covid';

/**
 * Базовый URL для API COVID-19 данных
 * Используем disease.sh - бесплатный и надежный источник данных
 */
const API_BASE_URL = 'https://disease.sh/v3/covid-19';

/**
 * Получение всех данных COVID-19 (глобальные + по странам)
 * Используем Promise.all для параллельных запросов
 * 
 * @returns Promise<CovidData> - объект с глобальными данными и списком стран
 */
export const fetchCovidData = async (): Promise<CovidData> => {
  try {
    // Выполняем два запроса параллельно для оптимизации
    const [globalResponse, countriesResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/all`),           // Глобальная статистика
      axios.get(`${API_BASE_URL}/countries?sort=cases`) // Данные по странам, отсортированные по количеству случаев
    ]);

    const globalData: GlobalData = globalResponse.data;
    const countriesData: CountryData[] = countriesResponse.data;

    return {
      global: globalData,
      countries: countriesData
    };
  } catch (error) {
    console.error('Error fetching COVID data:', error);
    throw new Error('Failed to fetch COVID-19 data');
  }
};

/**
 * Получение данных для конкретной страны
 * 
 * @param country - название страны (например, "USA", "Russia")
 * @returns Promise<CountryData> - данные конкретной страны
 */
export const fetchCountryData = async (country: string): Promise<CountryData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/countries/${country}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${country}:`, error);
    throw new Error(`Failed to fetch data for ${country}`);
  }
};

/**
 * Получение исторических данных для страны
 * Полезно для создания графиков трендов
 * 
 * @param country - название страны
 * @param days - количество дней (по умолчанию 30)
 * @returns Promise с историческими данными
 */
export const fetchHistoricalData = async (country: string, days: number = 30) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/historical/${country}?lastdays=${days}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${country}:`, error);
    throw new Error(`Failed to fetch historical data for ${country}`);
  }
};

/**
 * Форматирование больших чисел для удобного отображения
 * Конвертирует числа в формат с K (тысячи) и M (миллионы)
 * 
 * @param num - число для форматирования
 * @returns string - отформатированное число
 * 
 * @example
 * formatNumber(1234) // "1.2K"
 * formatNumber(1234567) // "1.2M"
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Форматирование временной метки в читаемый формат
 * 
 * @param timestamp - временная метка в миллисекундах
 * @returns string - отформатированная дата и время
 * 
 * @example
 * formatDate(1640995200000) // "January 1, 2022, 12:00 PM"
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 