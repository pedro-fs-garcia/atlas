import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../services/api';
import type { Country, RestCountryData, CreateCountryDTO, Continent } from '../types';
import { useAuth } from '../context/AuthContext';

export const CountriesPage = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryFlags, setCountryFlags] = useState<{ [countryName: string]: RestCountryData | null }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [continents, setContinents] = useState<Continent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateCountryDTO>({ name: '', population: 0, language: '', currency: '', continent_id: 0 });

  useEffect(() => {
    loadData();
    loadContinents();
  }, []);

  const { isAuthenticated } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const countriesData = await api.getCountries();
      setCountries(countriesData);
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

  const loadContinents = async () => {
    try {
      const data = await api.getContinents();
      setContinents(data);
    } catch (err) {
      console.error('Failed to load continents', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', population: 0, language: '', currency: '', continent_id: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Você precisa estar logado para realizar essa ação');
      return;
    }
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
    // Populate form. Attempt to map continent name back to id when needed.
    let continent_id = (country as any).continent_id ?? 0;
    if (!continent_id && typeof (country as any).continent === 'string') {
      const match = continents.find((c) => c.name === (country as any).continent);
      continent_id = match?.id ?? 0;
    } else if (!continent_id && (country as any).continent?.id) {
      continent_id = (country as any).continent.id;
    }

    setFormData({
      name: country.name,
      population: Number(country.population) || 0,
      language: Array.isArray((country as any).languages) && (country as any).languages.length > 0 ? (country as any).languages[0] : (country as any).language || '',
      currency: Array.isArray((country as any).currencies) && (country as any).currencies.length > 0 ? (country as any).currencies[0].name || (country as any).currency || '' : (country as any).currency || '',
      continent_id,
    });
    setEditingId(country.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este país?')) return;
    if (!isAuthenticated) {
      setError('Você precisa estar logado para realizar essa ação');
      return;
    }
    try {
      await api.deleteCountry(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao excluir país');
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Países</h1>
        <div>
          {isAuthenticated ? (
            <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', population: 0, language: '', currency: '', continent_id: 0 }); }}>Adicionar País</button>
          ) : (
            <small>Entre para gerenciar países.</small>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar País' : 'Novo País'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome *</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>População *</label>
              <input type="number" value={formData.population} onChange={(e) => setFormData({ ...formData, population: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label>Idioma (ex: English) *</label>
              <input value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Moeda (ex: Euro) *</label>
              <input value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Continente *</label>
              <select value={formData.continent_id} onChange={(e) => setFormData({ ...formData, continent_id: Number(e.target.value) })} required>
                <option value={0}>Selecione um continente</option>
                {continents.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">Salvar</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {countries.map((country) => (
          <div key={country.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              {/* Prefer backend-provided flagUrl when available */}
              {(country as any).flagUrl ? (
                <img
                  src={(country as any).flagUrl}
                  alt={`${country.name} flag`}
                  style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '3px', marginLeft: 'auto' }}
                  title={country.name}
                />
              ) : (
                <>
                  {countryFlags[country.name] === undefined && (
                    <button
                      onClick={() => loadCountryFlag(country.name)}
                      className="btn-small"
                      style={{ marginLeft: 'auto' }}
                    >
                      Carregar Bandeira
                    </button>
                  )}
                  {countryFlags[country.name] && countryFlags[country.name]!.flags && (
                    <img
                      src={countryFlags[country.name]!.flags.png}
                      alt={`${country.name} flag`}
                      style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '3px', marginLeft: 'auto' }}
                      title={countryFlags[country.name]!.flags.alt || country.name}
                    />
                  )}
                </>
              )}
            </div>
            <h3>{country.name}</h3>
                <div className="country-details">
                  <p><strong>População:</strong> {Number(country.population).toLocaleString()}</p>
                  <p><strong>Idiomas:</strong> {Array.isArray((country as any).languages) && (country as any).languages.length > 0 ? (country as any).languages.join(', ') : 'N/D'}</p>
                  <p><strong>Moedas:</strong> {Array.isArray((country as any).currencies) && (country as any).currencies.length > 0 ? (country as any).currencies.map((c: any) => c.name + (c.symbol ? ` (${c.symbol})` : '')).join(', ') : 'N/D'}</p>
                  <p><strong>Continente:</strong> {typeof (country as any).continent === 'string' ? (country as any).continent : ((country as any).continent?.name || 'N/D')}</p>
                  <p><strong>Capital:</strong> {(country as any).capital || 'N/D'}</p>
                </div>
            {isAuthenticated && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn-small" onClick={() => handleEdit(country)}>Editar</button>
                <button className="btn-small btn-danger" onClick={() => handleDelete(country.id)}>Excluir</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {countries.length === 0 && (
        <p className="empty-message">Nenhum país encontrado.</p>
      )}
    </div>
  );
};
