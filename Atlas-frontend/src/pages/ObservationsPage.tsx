import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../services/api';
import type { CulturalObservation, Country, City, CreateObservationDTO } from '../types';
import { useAuth } from '../context/AuthContext';

export const ObservationsPage = () => {
  const [observations, setObservations] = useState<CulturalObservation[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCountryId, setFilterCountryId] = useState<number>(0);
  const [formData, setFormData] = useState<CreateObservationDTO>({
    country_id: 0,
    city_id: undefined,
    observation: '',
  });
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadData();
  }, [filterCountryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [observationsData, countriesData, citiesData] = await Promise.all([
        api.getObservations(filterCountryId ? { country_id: filterCountryId } : {}),
        api.getCountries(),
        api.getCities(),
      ]);
      setObservations(observationsData);
      setCountries(countriesData);
      setCities(citiesData);
      setError('');
    } catch (err: any) {
      setError('Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Update available cities when country changes in form
  useEffect(() => {
    if (formData.country_id) {
      const filtered = cities.filter(city => city.country_id === formData.country_id);
      setAvailableCities(filtered);
    } else {
      setAvailableCities([]);
    }
  }, [formData.country_id, cities]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateObservation(editingId, formData);
      } else {
        await api.createObservation(formData);
      }
      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao salvar observação');
    }
  };

  const handleEdit = (observation: CulturalObservation) => {
    setFormData({
      country_id: observation.country_id,
      city_id: observation.city_id,
      observation: observation.observation,
    });
    setEditingId(observation.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta observação?')) return;
    try {
      await api.deleteObservation(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao excluir observação');
    }
  };

  const resetForm = () => {
    setFormData({
      country_id: 0,
      city_id: undefined,
      observation: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const canEdit = (observation: CulturalObservation) => {
    return user && observation.user_id === user.id;
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Observações Culturais</h1>
        {isAuthenticated && !showForm && (
          <button onClick={() => setShowForm(true)}>Adicionar Observação</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-section">
        <label htmlFor="filter">Filtrar por País:</label>
        <select
          id="filter"
          value={filterCountryId}
          onChange={(e) => setFilterCountryId(Number(e.target.value))}
        >
          <option value={0}>Todos os Países</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar Observação' : 'Nova Observação'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="country">País *</label>
              <select
                id="country"
                value={formData.country_id}
                onChange={(e) => setFormData({ ...formData, country_id: Number(e.target.value), city_id: undefined })}
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

            <div className="form-group">
              <label htmlFor="city">Cidade (opcional)</label>
              <select
                id="city"
                value={formData.city_id || 0}
                onChange={(e) => setFormData({ ...formData, city_id: Number(e.target.value) || undefined })}
              >
                <option value={0}>Selecione uma cidade (opcional)</option>
                {availableCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="observation">Observação *</label>
              <textarea
                id="observation"
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                rows={5}
                required
              />
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

      <div className="observations-list">
        {observations.map((obs) => (
          <div key={obs.id} className="observation-card">
            <div className="observation-header">
              <div>
                <h3>{obs.country?.name}</h3>
                {obs.city && <p className="city">{obs.city.name}</p>}
              </div>
              <div className="observation-meta">
                <span className="author">por {obs.user?.username}</span>
                <span className="date">{new Date(obs.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <p className="observation-text">{obs.observation}</p>
            {canEdit(obs) && (
              <div className="card-actions">
                <button onClick={() => handleEdit(obs)} className="btn-small">
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(obs.id)}
                  className="btn-small btn-danger"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {observations.length === 0 && !showForm && (
        <p className="empty-message">
          Nenhuma observação encontrada. {isAuthenticated ? 'Adicione uma para começar!' : 'Entre para adicionar observações.'}
        </p>
      )}
    </div>
  );
};
