import React from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { CountryData } from '../types/covid';
import { formatNumber } from '../services/covidService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartsProps {
  countries: CountryData[];
  selectedCountries: string[];
  onCountrySelect: (countries: string[]) => void;
}

type ChartType = 'line' | 'bar' | 'doughnut';

const Charts: React.FC<ChartsProps> = ({ countries, selectedCountries, onCountrySelect }) => {
  const [chartType, setChartType] = React.useState<ChartType>('bar');

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: ChartType | null,
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const chartData = {
    labels: countries.map(country => country.country),
    datasets: [
      {
        label: 'Всего случаев',
        data: countries.map(country => country.cases),
        backgroundColor: 'rgba(25, 118, 210, 0.6)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 2,
      },
      {
        label: 'Активные случаи',
        data: countries.map(country => country.active),
        backgroundColor: 'rgba(237, 108, 2, 0.6)',
        borderColor: 'rgba(237, 108, 2, 1)',
        borderWidth: 2,
      },
      {
        label: 'Выздоровевшие',
        data: countries.map(country => country.recovered),
        backgroundColor: 'rgba(46, 125, 50, 0.6)',
        borderColor: 'rgba(46, 125, 50, 1)',
        borderWidth: 2,
      },
      {
        label: 'Смерти',
        data: countries.map(country => country.deaths),
        backgroundColor: 'rgba(211, 47, 47, 0.6)',
        borderColor: 'rgba(211, 47, 47, 1)',
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: ['Активные', 'Выздоровевшие', 'Смерти'],
    datasets: [
      {
        data: [
          countries.reduce((sum, country) => sum + country.active, 0),
          countries.reduce((sum, country) => sum + country.recovered, 0),
          countries.reduce((sum, country) => sum + country.deaths, 0),
        ],
        backgroundColor: [
          'rgba(237, 108, 2, 0.8)',
          'rgba(46, 125, 50, 0.8)',
          'rgba(211, 47, 47, 0.8)',
        ],
        borderColor: [
          'rgba(237, 108, 2, 1)',
          'rgba(46, 125, 50, 1)',
          'rgba(211, 47, 47, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Статистика COVID-19 по странам',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatNumber(value);
          }
        }
      }
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} height={400} />;
      case 'bar':
        return <Bar data={chartData} options={options} height={400} />;
      case 'doughnut':
        return <Doughnut data={doughnutData} options={{ ...options, plugins: { ...options.plugins, title: { display: false } } }} height={400} />;
      default:
        return <Bar data={chartData} options={options} height={400} />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Тренды COVID-19
        </Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="bar">Столбцы</ToggleButton>
          <ToggleButton value="line">Линии</ToggleButton>
          <ToggleButton value="doughnut">Кольцо</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ height: 400 }}>
        {renderChart()}
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Показаны данные для топ {countries.length} стран по общему количеству случаев
        </Typography>
      </Box>
    </Box>
  );
};

export default Charts; 