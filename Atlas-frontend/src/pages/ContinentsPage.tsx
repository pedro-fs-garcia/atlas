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
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '' });
      loadContinents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao salvar continente');
    }
  };

  const handleEdit = (c: Continent) => {
    setFormData({ name: c.name, description: c.description ?? '' });
    setEditingId(c.id);
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

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Continentes</h1>
        <div>
          {isAuthenticated ? (
            <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', description: '' }); }}>Adicionar Continente</button>
          ) : (
            <small>Entre para gerenciar continentes.</small>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar Continente' : 'Novo Continente'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome *</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="form-actions">
              <button type="submit">Salvar</button>
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {continents.map((continent) => (
          <div key={continent.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>{continent.name}</h3>
                {continent.description && <p>{continent.description}</p>}
              </div>
              {isAuthenticated && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-small" onClick={() => handleEdit(continent)}>Editar</button>
                  <button className="btn-small btn-danger" onClick={() => handleDelete(continent.id)}>Excluir</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {continents.length === 0 && (
        <p className="empty-message">Nenhum continente encontrado.</p>
      )}
    </div>
  );
};
