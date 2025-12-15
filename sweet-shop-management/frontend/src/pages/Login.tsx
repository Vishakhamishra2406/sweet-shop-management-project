import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on admin login route
  const isAdminLogin = isAdmin || location.pathname === '/admin/login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-container ${isAdminLogin ? 'admin-login' : ''}`}>
      <div className={`auth-card ${isAdminLogin ? 'admin-card' : ''}`}>
        <h1>Sweet Shop</h1>
        <h2>{isAdminLogin ? 'Admin Login' : 'Login'}</h2>
        {isAdminLogin && (
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Admin access required
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className={`button ${isAdminLogin ? 'button-admin' : 'button-primary'}`} disabled={isLoading}>
            {isLoading ? 'Logging in...' : isAdminLogin ? 'Admin Login' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          {!isAdminLogin && (
            <>
              <p className="auth-link">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
              <p className="auth-link admin-link">
                <Link to="/admin/login">🔐 Admin Login</Link>
              </p>
            </>
          )}
          {isAdminLogin && (
            <p className="auth-link">
              Regular user? <Link to="/login">User Login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

