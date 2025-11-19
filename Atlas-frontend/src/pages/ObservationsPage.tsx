import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../services/api';
import type { CulturalObservation, Country, CreateObservationDTO } from '../types';
import { useAuth } from '../context/AuthContext';

export const ObservationsPage = () => {
  const [observations, setObservations] = useState<CulturalObservation[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCountryId, setFilterCountryId] = useState<number>(0);
  const [formData, setFormData] = useState<CreateObservationDTO>({
    country_id: 0,
    city: '',
    observation: '',
  });
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadData();
  }, [filterCountryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [observationsData, countriesData] = await Promise.all([
        api.getObservations(filterCountryId ? { country_id: filterCountryId } : {}),
        api.getCountries(),
      ]);
      setObservations(observationsData);
      setCountries(countriesData);
      setError('');
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

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
      setError(err.response?.data?.message || 'Failed to save observation');
    }
  };

  const handleEdit = (observation: CulturalObservation) => {
    setFormData({
      country_id: observation.country_id,
      city: observation.city || '',
      observation: observation.observation,
    });
    setEditingId(observation.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this observation?')) return;
    try {
      await api.deleteObservation(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete observation');
    }
  };

  const resetForm = () => {
    setFormData({
      country_id: 0,
      city: '',
      observation: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const canEdit = (observation: CulturalObservation) => {
    return user && observation.user_id === user.id;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Cultural Observations</h1>
        {isAuthenticated && !showForm && (
          <button onClick={() => setShowForm(true)}>Add Observation</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-section">
        <label htmlFor="filter">Filter by Country:</label>
        <select
          id="filter"
          value={filterCountryId}
          onChange={(e) => setFilterCountryId(Number(e.target.value))}
        >
          <option value={0}>All Countries</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Observation' : 'New Observation'}</h2>
          <form onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="observation">Observation *</label>
              <textarea
                id="observation"
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                rows={5}
                required
              />
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

      <div className="observations-list">
        {observations.map((obs) => (
          <div key={obs.id} className="observation-card">
            <div className="observation-header">
              <div>
                <h3>{obs.country?.name}</h3>
                {obs.city && <p className="city">{obs.city}</p>}
              </div>
              <div className="observation-meta">
                <span className="author">by {obs.user?.username}</span>
                <span className="date">{new Date(obs.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="observation-text">{obs.observation}</p>
            {canEdit(obs) && (
              <div className="card-actions">
                <button onClick={() => handleEdit(obs)} className="btn-small">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(obs.id)}
                  className="btn-small btn-danger"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {observations.length === 0 && !showForm && (
        <p className="empty-message">
          No observations found. {isAuthenticated ? 'Add one to get started!' : 'Login to add observations.'}
        </p>
      )}
    </div>
  );
};
