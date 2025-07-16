# 🚀 Примеры кода Трекера COVID-19

## 📋 Содержание
1. [Основные концепции React](#основные-концепции-react)
2. [Работа с состоянием](#работа-с-состоянием)
3. [API и асинхронность](#api-и-асинхронность)
4. [Компоненты и пропсы](#компоненты-и-пропсы)
5. [Стилизация с Material-UI](#стилизация-с-material-ui)
6. [Типизация с TypeScript](#типизация-с-typescript)

---

## 🔧 Основные концепции React

### 1. Функциональные компоненты с хуками

```tsx
// Старый способ (классовые компоненты)
class App extends React.Component {
  state = { data: null };
  
  componentDidMount() {
    this.fetchData();
  }
  
  render() {
    return <div>{this.state.data}</div>;
  }
}

// Новый способ (функциональные компоненты + хуки)
function App() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return <div>{data}</div>;
}
```

### 2. Хук useState - управление состоянием

```tsx
// Простое состояние
const [count, setCount] = useState(0);

// Сложное состояние
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0
});

// Обновление состояния
setCount(count + 1); // Простое
setUser({...user, name: 'John'}); // Сложное (иммутабельность!)
```

### 3. Хук useEffect - побочные эффекты

```tsx
// Выполняется при каждом рендере
useEffect(() => {
  console.log('Компонент обновился');
});

// Выполняется только при монтировании
useEffect(() => {
  fetchData();
}, []); // Пустой массив зависимостей

// Выполняется при изменении зависимостей
useEffect(() => {
  fetchUserData(userId);
}, [userId]); // userId в массиве зависимостей
```

---

## 📊 Работа с состоянием

### Пример из нашего приложения:

```tsx
function App() {
  // Состояние для данных COVID-19
  const [covidData, setCovidData] = useState<CovidData | null>(null);
  
  // Состояние загрузки
  const [loading, setLoading] = useState(true);
  
  // Состояние ошибок
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true); // Показываем загрузку
        const data = await fetchCovidData();
        setCovidData(data); // Сохраняем данные
        setError(null); // Очищаем ошибки
      } catch (err) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false); // Скрываем загрузку
      }
    };

    loadData();
  }, []);

  return (
    <div>
      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка: {error}</div>}
      {covidData && <Dashboard data={covidData} />}
    </div>
  );
}
```

---

## 🌐 API и асинхронность

### 1. Использование async/await

```tsx
// Плохо - промисы
fetch('/api/data')
  .then(response => response.json())
  .then(data => setData(data))
  .catch(error => setError(error));

// Хорошо - async/await
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    setData(data);
  } catch (error) {
    setError(error);
  }
};
```

### 2. Параллельные запросы

```tsx
// Последовательные запросы (медленно)
const data1 = await fetch('/api/users');
const data2 = await fetch('/api/posts');

// Параллельные запросы (быстро)
const [data1, data2] = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts')
]);
```

### 3. Наш пример с COVID API

```tsx
export const fetchCovidData = async (): Promise<CovidData> => {
  try {
    // Параллельные запросы для оптимизации
    const [globalResponse, countriesResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/all`),
      axios.get(`${API_BASE_URL}/countries?sort=cases`)
    ]);

    return {
      global: globalResponse.data,
      countries: countriesResponse.data
    };
  } catch (error) {
    throw new Error('Не удалось получить данные COVID-19');
  }
};
```

---

## 🧩 Компоненты и пропсы

### 1. Создание переиспользуемого компонента

```tsx
// StatCard.tsx
interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  color, 
  icon, 
  subtitle 
}) => (
  <Card sx={{ border: `2px solid ${color}` }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ color, mr: 1 }}>{icon}</Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography variant="h4" sx={{ color }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2">{subtitle}</Typography>
      )}
    </CardContent>
  </Card>
);

// Использование
<StatCard
  title="Всего случаев"
  value="1.2M"
  color="#1976d2"
  icon={<TrendingUp />}
  subtitle="+1.2K сегодня"
/>
```

### 2. Передача функций как пропсов

```tsx
// Родительский компонент
const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

<CountryTable 
  countries={countries}
  selectedCountries={selectedCountries}
  onCountrySelect={setSelectedCountries} // Функция как проп
/>

// Дочерний компонент
interface CountryTableProps {
  countries: CountryData[];
  selectedCountries: string[];
  onCountrySelect: (countries: string[]) => void; // Тип функции
}

const CountryTable: React.FC<CountryTableProps> = ({
  countries,
  selectedCountries,
  onCountrySelect
}) => {
  const handleToggle = (country: string) => {
    const newSelected = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    
    onCountrySelect(newSelected); // Вызываем функцию из пропсов
  };
};
```

---

## 🎨 Стилизация с Material-UI

### 1. Использование sx prop

```tsx
// Встроенные стили
<Box sx={{ 
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  p: 3,
  backgroundColor: 'primary.main',
  borderRadius: 2,
  boxShadow: 3
}}>
  Content
</Box>

// Адаптивные стили
<Grid item xs={12} sm={6} md={4} lg={3}>
  {/* xs=12 (мобильные), sm=6 (планшеты), md=4 (десктоп), lg=3 (большие экраны) */}
</Grid>
```

### 2. Создание темы

```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Использование
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### 3. Эффекты и анимации

```tsx
<Card sx={{ 
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
  }
}}>
  {/* Содержимое карточки */}
</Card>
```

---

## 🔒 Типизация с TypeScript

### 1. Интерфейсы для данных

```tsx
interface CountryData {
  country: string;
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  countryInfo: {
    flag: string;
    lat: number;
    long: number;
  };
}

// Использование
const [countries, setCountries] = useState<CountryData[]>([]);
```

### 2. Типизация пропсов

```tsx
interface DashboardProps {
  data: CovidData;
  onRefresh?: () => void; // Опциональный проп
}

const Dashboard: React.FC<DashboardProps> = ({ data, onRefresh }) => {
  // Компонент
};
```

### 3. Типизация функций

```tsx
// Функция с типизированными параметрами и возвращаемым значением
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  return num.toString();
};

// Асинхронная функция
const fetchData = async (): Promise<CovidData> => {
  const response = await axios.get('/api/covid');
  return response.data;
};
```

---

## 🎯 Лучшие практики

### 1. Именование
```tsx
// Плохо
const [d, setD] = useState(null);
const [flag, setFlag] = useState(false);

// Хорошо
const [covidData, setCovidData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
```

### 2. Структура компонентов
```tsx
// Плохо - все в одном файле
function App() {
  // 500 строк кода...
}

// Хорошо - разделение на компоненты
// App.tsx
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Dashboard />
    </ThemeProvider>
  );
}

// Dashboard.tsx
function Dashboard() {
  return (
    <Container>
      <GlobalStats />
      <Charts />
      <CountryTable />
    </Container>
  );
}
```

### 3. Обработка ошибок
```tsx
// Плохо
const fetchData = async () => {
  const data = await api.getData();
  setData(data);
};

// Хорошо
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await api.getData();
    setData(data);
    setError(null);
  } catch (err) {
    setError('Ошибка загрузки данных');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

---

## 🚀 Готово к демонстрации!

Теперь у вас есть полноценное React приложение с:
- ✅ Современными хуками
- ✅ TypeScript типизацией
- ✅ Красивым UI с Material-UI
- ✅ Работой с API
- ✅ Обработкой ошибок
- ✅ Адаптивным дизайном

**Следующие шаги для развития:**
1. Добавить тесты (Jest + React Testing Library)
2. Настроить CI/CD
3. Добавить PWA функциональность
4. Реализовать кэширование данных
5. Добавить анимации и переходы

Удачи в изучении React! 🎉 