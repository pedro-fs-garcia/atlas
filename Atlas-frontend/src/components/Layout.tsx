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
          <Link to="/continents">Continents</Link>
          <Link to="/countries">Countries</Link>
          <Link to="/observations">Observations</Link>
        </div>
        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="user-info">Hello, {user?.username}!</span>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary">Login</button>
              </Link>
              <Link to="/register">
                <button>Register</button>
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
