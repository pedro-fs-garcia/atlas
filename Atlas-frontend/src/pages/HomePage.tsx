import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to Atlas</h1>
      {isAuthenticated ? (
        <div className="welcome-message">
          <p>Hello, {user?.username}! Explore the world and share your cultural observations.</p>
          <div className="home-actions">
            <Link to="/continents">
              <button>Browse Continents</button>
            </Link>
            <Link to="/countries">
              <button>Browse Countries</button>
            </Link>
            <Link to="/observations">
              <button>Cultural Observations</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="welcome-message">
          <p>Discover continents, countries, and cultural observations from around the world.</p>
          <p>Login or register to contribute your own observations!</p>
          <div className="home-actions">
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button className="btn-secondary">Register</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
