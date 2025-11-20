import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <h1>Bem-vindo ao Atlas</h1>
      {isAuthenticated ? (
        <div className="welcome-message">
          <p>Olá, {user?.username}! Explore o mundo e compartilhe suas observações culturais.</p>
          <div className="home-actions">
            <Link to="/continents">
              <button>Explorar Continentes</button>
            </Link>
            <Link to="/countries">
              <button>Explorar Países</button>
            </Link>
            <Link to="/observations">
              <button>Observações Culturais</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="welcome-message">
          <p>Descubra continentes, países e observações culturais de todo o mundo.</p>
          <p>Entre ou cadastre-se para contribuir com suas próprias observações!</p>
          <div className="home-actions">
            <Link to="/login">
              <button>Entrar</button>
            </Link>
            <Link to="/register">
              <button className="btn-secondary">Cadastrar</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
