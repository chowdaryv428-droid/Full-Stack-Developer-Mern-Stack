import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { StatusBadge, PriorityTag } from '../components/Badge';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client
      .get('/complaints', { params: statusFilter ? { status: statusFilter } : {} })
      .then((res) => setComplaints(res.data.complaints))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>All complaints</h1>
          <p>Every complaint logged across the registry.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <h3>No complaints match this filter</h3>
          </div>
        ) : (
          complaints.map((c) => (
            <div className="complaint-row" key={c._id}>
              <div>
                <div className="complaint-code">{c.complaintCode}</div>
                <div className="complaint-subject">{c.subject}</div>
                <div className="complaint-meta">
                  {c.customer?.name} · {c.assignedAgent?.name ? `Agent: ${c.assignedAgent.name}` : 'Unassigned'} ·{' '}
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <PriorityTag priority={c.priority} />
                <StatusBadge status={c.status} />
                <Link className="btn btn-outline btn-sm" to={`/complaints/${c._id}`}>
                  Manage
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
