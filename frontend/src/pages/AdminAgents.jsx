import { useEffect, useState } from 'react';
import client, { extractError } from '../api/client';

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await client.get('/users?role=agent');
    setAgents(res.data.users);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const createAgent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);
    try {
      await client.post('/users', { ...form, role: 'agent' });
      setForm({ name: '', email: '', password: '', phone: '' });
      setSuccess('Agent account created');
      load();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Agents</h1>
          <p>Support staff who resolve assigned complaints.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480, marginBottom: 20 }}>
        <h3>Add an agent</h3>
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}
        <form onSubmit={createAgent}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" required value={form.name} onChange={update('name')} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={form.email} onChange={update('email')} />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" value={form.phone} onChange={update('phone')} />
          </div>
          <div className="field">
            <label htmlFor="password">Temporary password</label>
            <input id="password" type="password" required minLength={6} value={form.password} onChange={update('password')} />
          </div>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Creating…' : 'Create agent account'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>All agents</h3>
        <table className="table-simple">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.phone || '—'}</td>
                <td>{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan={4} className="complaint-meta">No agents yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
