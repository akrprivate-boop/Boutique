import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import config from '../../config/config';
import { Lock, User } from 'lucide-react';
import '../../styles/login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    // Small delay for UX feel
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-logo">{config.boutiqueName}</h1>
          <p className="login-tagline">{config.tagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" id="login-form">
          <div className="form-group">
            <label htmlFor="login-username">
              <User size={14} style={{ marginRight: 4, opacity: 0.6 }} />
              Username
            </label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              <Lock size={14} style={{ marginRight: 4, opacity: 0.6 }} />
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={isLoading}
            id="login-submit-btn"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
