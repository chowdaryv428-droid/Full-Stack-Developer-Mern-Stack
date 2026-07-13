import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const res = await register(form);
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
          <p className="auth-tagline">Register once. Raise a complaint any time you need to.</p>
          <p className="auth-caption">
            Your history, responses, and resolutions stay in one place — no repeating
            yourself.
          </p>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Create your account</h2>
          <p style={{ marginBottom: 22 }}>Customer accounts only — agents and admins are added by your organization.</p>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" required value={form.name} onChange={update('name')} placeholder="Jordan Rivera" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={update('password')}
                placeholder="At least 6 characters"
              />
            </div>
            <button className="btn btn-primary btn-full" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
