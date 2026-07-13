import { useState } from 'react';
import client, { extractError } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);
    try {
      const res = await client.put(`/users/${user.id}`, form);
      setUser(res.data.user);
      setSuccess('Profile updated');
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
          <h1>Your profile</h1>
          <p>Keep your contact details current so agents can reach you.</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 480 }}>
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input value={user.email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="field">
            <label>Role</label>
            <input value={user.role} disabled style={{ opacity: 0.6, textTransform: 'capitalize' }} />
          </div>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" required value={form.name} onChange={update('name')} />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" value={form.phone} onChange={update('phone')} />
          </div>
          <div className="field">
            <label htmlFor="address">Address</label>
            <textarea id="address" value={form.address} onChange={update('address')} />
          </div>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
