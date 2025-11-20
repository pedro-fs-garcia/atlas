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
      console.log('Continents loaded:', data);
      setContinents(data);
      setError('');
    } catch (err: any) {
      console.error('Error loading continents:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Falha ao carregar continentes');
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
      setError(err.response?.data?.message || 'Falha ao salvar continente');
    }
  };

  const handleEdit = (continent: Continent) => {
    setFormData({ name: continent.name, description: continent.description || '' });
    setEditingId(continent.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este continente?')) return;
    try {
      await api.deleteContinent(id);
      loadContinents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao excluir continente');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Continentes</h1>
        {isAuthenticated && !showForm && (
          <button onClick={() => setShowForm(true)}>Adicionar Continente</button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar Continente' : 'Novo Continente'}</h2>
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
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit">Salvar</button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancelar
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
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(continent.id)}
                  className="btn-small btn-danger"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {continents.length === 0 && !showForm && (
        <p className="empty-message">Nenhum continente encontrado. Adicione um para começar!</p>
      )}
    </div>
  );
};
