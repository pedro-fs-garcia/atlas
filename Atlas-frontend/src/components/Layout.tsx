import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">🌍 Atlas</Link>
        </div>
        <div className="nav-links">
          <Link to="/continents">Continentes</Link>
          <Link to="/countries">Países</Link>
          <Link to="/cities">Cidades</Link>
          <Link to="/observations">Observações</Link>
        </div>
        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="user-info">Olá, {user?.username}!</span>
              <button onClick={handleLogout} className="btn-secondary">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary">Entrar</button>
              </Link>
              <Link to="/register">
                <button>Cadastrar</button>
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
