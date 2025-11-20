import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../services/api';
import type { Country, Continent, CreateCountryDTO, RestCountryData } from '../types';
import { useAuth } from '../context/AuthContext';

export const CountriesPage = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [countryFlags, setCountryFlags] = useState<{ [countryName: string]: RestCountryData | null }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateCountryDTO>({
    name: '',
    population: 0,
    language: '',
    currency: '',
    continent_id: 0,
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [countriesData, continentsData] = await Promise.all([
        api.getCountries(),
        api.getContinents(),
      ]);
      setCountries(countriesData);
      setContinents(continentsData);
      setError('');
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadCountryFlag = async (countryName: string) => {
    try {
      const flagData = await api.getCountryInfo(countryName);
      setCountryFlags((prev) => ({ ...prev, [countryName]: flagData }));
    } catch (err) {
      console.error(`Failed to load flag for ${countryName}:`, err);
      setCountryFlags((prev) => ({ ...prev, [countryName]: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCountry(editingId, formData);
      } else {
        await api.createCountry(formData);
      }
      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save country');
    }
  };

  const handleEdit = (country: Country) => {
    setFormData({
      name: country.name,
      population: country.population,
      language: country.language,
      currency: country.currency,
      continent_id: country.continent_id,
    });
    setEditingId(country.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this country?')) return;
    try {
      await api.deleteCountry(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete country');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      population: 0,
      language: '',
      currency: '',
      continent_id: 0,
    });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Countries</h1>
        {isAuthenticated && !showForm && (
          <button onClick={() => setShowForm(true)}>Add Country</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Country' : 'New Country'}</h2>
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
              <label htmlFor="language">Language *</label>
              <input
                id="language"
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency *</label>
              <input
                id="currency"
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="continent">Continent *</label>
              <select
                id="continent"
                value={formData.continent_id}
                onChange={(e) => setFormData({ ...formData, continent_id: Number(e.target.value) })}
                required
              >
                <option value={0}>Select a continent</option>
                {continents.map((continent) => (
                  <option key={continent.id} value={continent.id}>
                    {continent.name}
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
        {countries.map((country) => (
          <div key={country.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              {countryFlags[country.name] === undefined && (
                <button
                  onClick={() => loadCountryFlag(country.name)}
                  className="btn-small"
                  style={{ marginLeft: 'auto' }}
                >
                  Load Flag
                </button>
              )}
              {countryFlags[country.name] && (
                <img
                  src={countryFlags[country.name]!.flags.png}
                  alt={`${country.name} flag`}
                  style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '3px', marginLeft: 'auto' }}
                  title={countryFlags[country.name]!.flags.alt || country.name}
                />
              )}
            </div>
            <h3>{country.name}</h3>
            <div className="country-details">
              <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
              <p><strong>Language:</strong> {country.language}</p>
              <p><strong>Currency:</strong> {country.currency}</p>
              <p><strong>Continent:</strong> {country.continent?.name || 'N/A'}</p>
            </div>
            {isAuthenticated && (
              <div className="card-actions">
                <button onClick={() => handleEdit(country)} className="btn-small">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(country.id)}
                  className="btn-small btn-danger"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {countries.length === 0 && !showForm && (
        <p className="empty-message">No countries found. Add one to get started!</p>
      )}
    </div>
  );
};
