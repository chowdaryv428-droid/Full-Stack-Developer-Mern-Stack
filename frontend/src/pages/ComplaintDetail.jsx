import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import client, { extractError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityTag } from '../components/Badge';
import StatusGauge from '../components/StatusGauge';

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const messagesEndRef = useRef(null);

  const load = async () => {
    try {
      const res = await client.get(`/complaints/${id}`);
      setComplaint(res.data.complaint);
      setNotes(res.data.complaint.resolutionNotes || '');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user.role === 'admin') {
      client.get('/users?role=agent').then((res) => setAgents(res.data.users));
    }
  }, [user.role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [complaint?.messages?.length]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSending(true);
    try {
      await client.post(`/complaints/${id}/messages`, { text: messageText });
      setMessageText('');
      load();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSending(false);
    }
  };

  const assignAgent = async () => {
    if (!selectedAgent) return;
    try {
      await client.put(`/complaints/${id}/assign`, { agentId: selectedAgent });
      load();
    } catch (err) {
      setError(extractError(err));
    }
  };

  const updateStatus = async (status) => {
    try {
      await client.put(`/complaints/${id}/status`, { status, resolutionNotes: notes });
      load();
    } catch (err) {
      setError(extractError(err));
    }
  };

  const submitFeedback = async () => {
    if (!rating) return;
    try {
      await client.post(`/complaints/${id}/feedback`, { rating, comments });
      load();
    } catch (err) {
      setError(extractError(err));
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error && !complaint) return <div className="error-banner">{error}</div>;
  if (!complaint) return null;

  const canMessage = complaint.status !== 'closed';

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="complaint-code">{complaint.complaintCode}</div>
          <h1 style={{ marginTop: 4 }}>{complaint.subject}</h1>
          <p>
            <PriorityTag priority={complaint.priority} /> ·{' '}
            {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)} · Raised{' '}
            {new Date(complaint.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <StatusGauge status={complaint.status} />
      </div>

      <div className="card">
        <h3>Description</h3>
        <p style={{ color: 'var(--ink)' }}>{complaint.description}</p>
        {complaint.customer?.name && (
          <p className="complaint-meta">
            Filed by {complaint.customer.name} ({complaint.customer.email})
          </p>
        )}
      </div>

      {user.role === 'admin' && (
        <div className="card">
          <h3>Assignment</h3>
          {complaint.assignedAgent ? (
            <p>
              Currently assigned to <strong>{complaint.assignedAgent.name}</strong> (
              {complaint.assignedAgent.email})
            </p>
          ) : (
            <p>Not yet assigned to an agent.</p>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} style={{ maxWidth: 260 }}>
              <option value="">Select an agent…</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm" onClick={assignAgent}>
              {complaint.assignedAgent ? 'Reassign' : 'Assign'}
            </button>
          </div>
        </div>
      )}

      {(user.role === 'agent' || user.role === 'admin') && complaint.status !== 'closed' && (
        <div className="card">
          <h3>Resolution</h3>
          <div className="field">
            <label htmlFor="notes">Resolution notes</label>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What was done to resolve this issue" />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-outline btn-sm" onClick={() => updateStatus('in_progress')}>
              Mark in progress
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => updateStatus('resolved')}>
              Mark resolved
            </button>
          </div>
        </div>
      )}

      {user.role === 'customer' && complaint.status === 'resolved' && (
        <div className="card">
          <h3>How did we do?</h3>
          <p>Your issue has been marked resolved. Let us know how the support felt.</p>
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`star-btn ${n <= rating ? 'active' : ''}`}
                onClick={() => setRating(n)}
                aria-label={`${n} star`}
              >
                ★
              </button>
            ))}
          </div>
          <div className="field">
            <label htmlFor="comments">Comments (optional)</label>
            <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Anything you'd like to add" />
          </div>
          <button className="btn btn-primary" onClick={submitFeedback} disabled={!rating}>
            Submit feedback &amp; close
          </button>
        </div>
      )}

      {complaint.status === 'closed' && complaint.feedback?.rating && (
        <div className="card">
          <h3>Feedback received</h3>
          <p>Rating: {'★'.repeat(complaint.feedback.rating)}{'☆'.repeat(5 - complaint.feedback.rating)}</p>
          {complaint.feedback.comments && <p>{complaint.feedback.comments}</p>}
        </div>
      )}

      <div className="card">
        <h3>Conversation</h3>
        <div className="message-list">
          {complaint.messages.length === 0 && (
            <p className="complaint-meta">No messages yet.</p>
          )}
          {complaint.messages.map((m) => (
            <div
              key={m._id}
              className={`message-bubble ${String(m.sender?._id || m.sender) === String(user.id) ? 'mine' : ''}`}
            >
              <div className="msg-meta">
                {m.sender?.name || m.senderRole} · {new Date(m.createdAt).toLocaleTimeString()}
              </div>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {canMessage ? (
          <form className="message-input-row" onSubmit={sendMessage}>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write a message…"
            />
            <button className="btn btn-primary" disabled={sending}>
              Send
            </button>
          </form>
        ) : (
          <p className="complaint-meta">This complaint is closed. Conversation is read-only.</p>
        )}
      </div>
    </div>
  );
}
