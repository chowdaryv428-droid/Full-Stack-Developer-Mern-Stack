import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const res = await login(form.email, form.password);
    setBusy(false);
    if (res.ok) navigate('/');
    else setError(res.message);
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="wordmark">
          Harbor<span className="dot">.</span>
        </div>
        <div>
          <p className="auth-tagline">
            Every issue finds safe harbor — logged, assigned, and carried through to
            resolution.
          </p>
          <p className="auth-caption">
            The customer care registry your team, agents, and customers share, so nothing
            drifts.
          </p>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p style={{ marginBottom: 22 }}>Sign in to your Harbor account.</p>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button className="btn btn-primary btn-full" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/register">Create a customer account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
