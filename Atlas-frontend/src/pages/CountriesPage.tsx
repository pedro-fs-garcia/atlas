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
      setError('Falha ao carregar dados');
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
      setError(err.response?.data?.message || 'Falha ao salvar país');
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
    if (!confirm('Tem certeza que deseja excluir este país?')) return;
    try {
      await api.deleteCountry(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao excluir país');
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

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Países</h1>
        {isAuthenticated && !showForm && (
          <button onClick={() => setShowForm(true)}>Adicionar País</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar País' : 'Novo País'}</h2>
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
              <label htmlFor="language">Idioma *</label>
              <input
                id="language"
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Moeda *</label>
              <input
                id="currency"
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="continent">Continente *</label>
              <select
                id="continent"
                value={formData.continent_id}
                onChange={(e) => setFormData({ ...formData, continent_id: Number(e.target.value) })}
                required
              >
                <option value={0}>Selecione um continente</option>
                {continents.map((continent) => (
                  <option key={continent.id} value={continent.id}>
                    {continent.name}
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
        {countries.map((country) => (
          <div key={country.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              {countryFlags[country.name] === undefined && (
                <button
                  onClick={() => loadCountryFlag(country.name)}
                  className="btn-small"
                  style={{ marginLeft: 'auto' }}
                >
                  Carregar Bandeira
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
              <p><strong>População:</strong> {country.population.toLocaleString()}</p>
              <p><strong>Idioma:</strong> {country.language}</p>
              <p><strong>Moeda:</strong> {country.currency}</p>
              <p><strong>Continente:</strong> {country.continent?.name || 'N/D'}</p>
            </div>
            {isAuthenticated && (
              <div className="card-actions">
                <button onClick={() => handleEdit(country)} className="btn-small">
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(country.id)}
                  className="btn-small btn-danger"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {countries.length === 0 && !showForm && (
        <p className="empty-message">Nenhum país encontrado. Adicione um para começar!</p>
      )}
    </div>
  );
};
