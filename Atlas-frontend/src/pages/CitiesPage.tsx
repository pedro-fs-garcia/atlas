import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../services/api';
import type { City, Country, CreateCityDTO, WeatherData } from '../types';
import { useAuth } from '../context/AuthContext';

export const CitiesPage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [weather, setWeather] = useState<{ [cityId: number]: WeatherData | null }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateCityDTO>({
    name: '',
    population: 0,
    latitude: 0,
    longitude: 0,
    country_id: 0,
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [citiesData, countriesData] = await Promise.all([
        api.getCities(),
        api.getCountries(),
      ]);
      setCities(citiesData);
      setCountries(countriesData);
      setError('');
    } catch (err: any) {
      setError('Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async (city: City) => {
    try {
      const weatherData = await api.getWeatherByCoordinates(city.latitude, city.longitude);
      setWeather((prev) => ({ ...prev, [city.id]: weatherData }));
    } catch (err) {
      console.error(`Failed to load weather for ${city.name}:`, err);
      setWeather((prev) => ({ ...prev, [city.id]: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCity(editingId, formData);
      } else {
        await api.createCity(formData);
      }
      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao salvar cidade');
    }
  };

  const handleEdit = (city: City) => {
    setFormData({
      name: city.name,
      population: city.population,
      latitude: city.latitude,
      longitude: city.longitude,
      country_id: city.country_id,
    });
    setEditingId(city.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta cidade?')) return;
    try {
      await api.deleteCity(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao excluir cidade');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      population: 0,
      latitude: 0,
      longitude: 0,
      country_id: 0,
    });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Cidades</h1>
        {isAuthenticated && !showForm && (
          <button onClick={() => setShowForm(true)}>Adicionar Cidade</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar Cidade' : 'Nova Cidade'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="population">População *</label>
              <input
                id="population"
                type="number"
                value={formData.population}
                onChange={(e) => setFormData({ ...formData, population: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="latitude">Latitude *</label>
              <input
                id="latitude"
                type="number"
                step="0.0000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude *</label>
              <input
                id="longitude"
                type="number"
                step="0.0000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">País *</label>
              <select
                id="country"
                value={formData.country_id}
                onChange={(e) => setFormData({ ...formData, country_id: Number(e.target.value) })}
                required
              >
                <option value={0}>Selecione um país</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit">Salvar</button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {cities.map((city) => (
          <div key={city.id} className="card">
            <h3>{city.name}</h3>
            <div className="city-details">
              <p><strong>População:</strong> {city.population.toLocaleString()}</p>
              <p><strong>Coordenadas:</strong> {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}</p>
              <p><strong>País:</strong> {city.country?.name || 'N/D'}</p>

              {weather[city.id] === undefined && (
                <button
                  onClick={() => loadWeather(city)}
                  className="btn-small"
                  style={{ marginTop: '10px' }}
                >
                  Carregar Clima
                </button>
              )}

              {weather[city.id] && (
                <div className="weather-info" style={{ marginTop: '10px', padding: '10px', background: '#f0f8ff', borderRadius: '5px' }}>
                  <p><strong>Clima:</strong></p>
                  <p>Temperatura: {weather[city.id]!.current.temperature_2m}°C</p>
                  <p>Sensação térmica: {weather[city.id]!.current.apparent_temperature}°C</p>
                  <p>Condição: {weather[city.id]!.current.weather_description}</p>
                  <p>Umidade: {weather[city.id]!.current.relative_humidity_2m}%</p>
                  <p>Vento: {weather[city.id]!.current.wind_speed_10m} km/h</p>
                </div>
              )}

              {weather[city.id] === null && (
                <p style={{ color: '#888', fontSize: '0.9em' }}>Dados climáticos não disponíveis</p>
              )}
            </div>
            {isAuthenticated && (
              <div className="card-actions">
                <button onClick={() => handleEdit(city)} className="btn-small">
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(city.id)}
                  className="btn-small btn-danger"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {cities.length === 0 && !showForm && (
        <p className="empty-message">Nenhuma cidade encontrada. Adicione uma para começar!</p>
      )}
    </div>
  );
};
