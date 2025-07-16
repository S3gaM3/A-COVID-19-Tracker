import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Box,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { CountryData } from '../types/covid';
import { formatNumber } from '../services/covidService';

interface CountryTableProps {
  countries: CountryData[];
  selectedCountries: string[];
  onCountrySelect: (countries: string[]) => void;
  showAll?: boolean;
}

const CountryTable: React.FC<CountryTableProps> = ({
  countries,
  selectedCountries,
  onCountrySelect,
  showAll = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries.filter(country =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountryToggle = (countryName: string) => {
    const newSelected = selectedCountries.includes(countryName)
      ? selectedCountries.filter(name => name !== countryName)
      : [...selectedCountries, countryName];
    onCountrySelect(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCountries.length === filteredCountries.length) {
      onCountrySelect([]);
    } else {
      onCountrySelect(filteredCountries.map(country => country.country));
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Поиск стран..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: showAll ? 600 : 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedCountries.length > 0 && selectedCountries.length < filteredCountries.length}
                  checked={selectedCountries.length === filteredCountries.length && filteredCountries.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Страна</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Случаи</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Активные</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Выздоровевшие</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Смерти</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCountries.map((country) => (
              <TableRow
                key={country.country}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCountries.includes(country.country)}
                    onChange={() => handleCountryToggle(country.country)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img
                      src={country.countryInfo.flag}
                      alt={country.country}
                      style={{ width: 20, height: 15, objectFit: 'cover' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {country.country}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {formatNumber(country.cases)}
                  </Typography>
                  {country.todayCases > 0 && (
                    <Typography variant="caption" sx={{ color: '#1976d2' }}>
                      +{formatNumber(country.todayCases)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#ed6c02' }}>
                    {formatNumber(country.active)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    {formatNumber(country.recovered)}
                  </Typography>
                  {country.todayRecovered > 0 && (
                    <Typography variant="caption" sx={{ color: '#2e7d32' }}>
                      +{formatNumber(country.todayRecovered)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                    {formatNumber(country.deaths)}
                  </Typography>
                  {country.todayDeaths > 0 && (
                    <Typography variant="caption" sx={{ color: '#d32f2f' }}>
                      +{formatNumber(country.todayDeaths)}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {filteredCountries.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Страны по запросу "{searchTerm}" не найдены
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CountryTable; 