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
      setError('Failed to load data');
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
      setError(err.response?.data?.message || 'Failed to save city');
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
    if (!confirm('Are you sure you want to delete this city?')) return;
    try {
      await api.deleteCity(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete city');
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Cities</h1>
        {isAuthenticated && !showForm && (
          <button onClick={() => setShowForm(true)}>Add City</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit City' : 'New City'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="population">Population *</label>
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
              <label htmlFor="country">Country *</label>
              <select
                id="country"
                value={formData.country_id}
                onChange={(e) => setFormData({ ...formData, country_id: Number(e.target.value) })}
                required
              >
                <option value={0}>Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
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
              <p><strong>Population:</strong> {city.population.toLocaleString()}</p>
              <p><strong>Coordinates:</strong> {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}</p>
              <p><strong>Country:</strong> {city.country?.name || 'N/A'}</p>

              {weather[city.id] === undefined && (
                <button
                  onClick={() => loadWeather(city)}
                  className="btn-small"
                  style={{ marginTop: '10px' }}
                >
                  Load Weather
                </button>
              )}

              {weather[city.id] && (
                <div className="weather-info" style={{ marginTop: '10px', padding: '10px', background: '#f0f8ff', borderRadius: '5px' }}>
                  <p><strong>Weather:</strong></p>
                  <p>Temperature: {weather[city.id]!.current.temperature_2m}°C</p>
                  <p>Feels like: {weather[city.id]!.current.apparent_temperature}°C</p>
                  <p>Condition: {weather[city.id]!.current.weather_description}</p>
                  <p>Humidity: {weather[city.id]!.current.relative_humidity_2m}%</p>
                  <p>Wind: {weather[city.id]!.current.wind_speed_10m} km/h</p>
                </div>
              )}

              {weather[city.id] === null && (
                <p style={{ color: '#888', fontSize: '0.9em' }}>Weather data not available</p>
              )}
            </div>
            {isAuthenticated && (
              <div className="card-actions">
                <button onClick={() => handleEdit(city)} className="btn-small">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(city.id)}
                  className="btn-small btn-danger"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {cities.length === 0 && !showForm && (
        <p className="empty-message">No cities found. Add one to get started!</p>
      )}
    </div>
  );
};
