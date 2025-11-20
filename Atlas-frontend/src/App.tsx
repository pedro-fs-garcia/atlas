import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContinentsPage } from './pages/ContinentsPage';
import { CountriesPage } from './pages/CountriesPage';
import { CitiesPage } from './pages/CitiesPage';
import { ObservationsPage } from './pages/ObservationsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="continents" element={<ContinentsPage />} />
            <Route path="countries" element={<CountriesPage />} />
            <Route path="cities" element={<CitiesPage />} />
            <Route path="observations" element={<ObservationsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
