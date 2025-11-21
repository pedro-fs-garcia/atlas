import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">Atlas Mundial</div>
          <h1 className="hero-title">
            Explore o mundo com
            <span className="hero-highlight"> dados precisos</span>
          </h1>
          <p className="hero-description">
            Plataforma de informações geográficas e culturais.
            Acesse dados de continentes, países e cidades, além de observações dos nossos usuários.
          </p>

          <div className="hero-actions">
            <Link to="/continents" className="btn-primary-large">
              Explorar Continentes
            </Link>
            <Link to="/countries" className="btn-secondary-large">
              Ver Países
            </Link>
          </div>

          {isAuthenticated && (
            <div className="user-welcome">
              <span className="welcome-text">Bem-vindo de volta, </span>
              <span className="welcome-name">{user?.username}</span>
            </div>
          )}
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-content">
              <div className="stat-number">7</div>
              <div className="stat-label">Continentes</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏴</div>
            <div className="stat-content">
              <div className="stat-number">195+</div>
              <div className="stat-label">Países</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏙️</div>
            <div className="stat-content">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Cidades</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Pronto para explorar?</h2>
          <p className="cta-text">
            {isAuthenticated
              ? 'Comece navegando pelos continentes ou compartilhe suas próprias observações.'
              : 'Crie uma conta gratuita e contribua com observações culturais.'
            }
          </p>
          <div className="cta-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/cities" className="btn-cta">
                  Explorar Cidades
                </Link>
                <Link to="/observations" className="btn-cta-secondary">
                  Minhas Observações
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-cta">
                  Criar Conta
                </Link>
                <Link to="/login" className="btn-cta-secondary">
                  Fazer Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
