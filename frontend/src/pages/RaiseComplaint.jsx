import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client, { extractError } from '../api/client';

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: 'other',
    priority: 'medium',
  });
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await client.post('/complaints', form);
      setConfirmation(res.data.complaintId);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setBusy(false);
    }
  };

  if (confirmation) {
    return (
      <div>
        <div className="page-header">
          <h1>Complaint submitted</h1>
        </div>
        <div className="card" style={{ maxWidth: 520 }}>
          <p className="success-banner">
            Your complaint has been logged. Reference it any time using the code below.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', color: 'var(--navy-950)' }}>
            {confirmation}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Go to my complaints
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setConfirmation(null);
                setForm({ subject: '', description: '', category: 'other', priority: 'medium' });
              }}
            >
              Raise another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Raise a complaint</h1>
          <p>Tell us what happened — the more detail, the faster we can help.</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 560 }}>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              required
              value={form.subject}
              onChange={update('subject')}
              placeholder="Short summary of the issue"
            />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={update('category')}>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="delivery">Delivery</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={form.priority} onChange={update('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              required
              value={form.description}
              onChange={update('description')}
              placeholder="What happened, when, and what you'd like to see resolved"
            />
          </div>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Submitting…' : 'Submit complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
