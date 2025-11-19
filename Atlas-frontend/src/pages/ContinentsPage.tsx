import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../services/api';
import type { Continent, CreateContinentDTO } from '../types';
import { useAuth } from '../context/AuthContext';

export const ContinentsPage = () => {
  const [continents, setContinents] = useState<Continent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateContinentDTO>({ name: '', description: '' });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadContinents();
  }, []);

  const loadContinents = async () => {
    try {
      setLoading(true);
      const data = await api.getContinents();
      setContinents(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load continents');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateContinent(editingId, formData);
      } else {
        await api.createContinent(formData);
      }
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      loadContinents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save continent');
    }
  };

  const handleEdit = (continent: Continent) => {
    setFormData({ name: continent.name, description: continent.description || '' });
    setEditingId(continent.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this continent?')) return;
    try {
      await api.deleteContinent(id);
      loadContinents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete continent');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Continents</h1>
        {isAuthenticated && !showForm && (
          <button onClick={() => setShowForm(true)}>Add Continent</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Continent' : 'New Continent'}</h2>
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {continents.map((continent) => (
          <div key={continent.id} className="card">
            <h3>{continent.name}</h3>
            {continent.description && <p>{continent.description}</p>}
            {isAuthenticated && (
              <div className="card-actions">
                <button onClick={() => handleEdit(continent)} className="btn-small">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(continent.id)}
                  className="btn-small btn-danger"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {continents.length === 0 && !showForm && (
        <p className="empty-message">No continents found. Add one to get started!</p>
      )}
    </div>
  );
};
