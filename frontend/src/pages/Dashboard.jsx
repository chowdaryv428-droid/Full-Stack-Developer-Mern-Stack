import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityTag } from '../components/Badge';

function ComplaintRow({ c }) {
  return (
    <div className="complaint-row">
      <div>
        <div className="complaint-code">{c.complaintCode}</div>
        <div className="complaint-subject">{c.subject}</div>
        <div className="complaint-meta">
          {c.customer?.name ? `${c.customer.name} · ` : ''}
          {c.assignedAgent?.name ? `Agent: ${c.assignedAgent.name} · ` : 'Unassigned · '}
          {new Date(c.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <PriorityTag priority={c.priority} />
        <StatusBadge status={c.status} />
        <Link className="btn btn-outline btn-sm" to={`/complaints/${c._id}`}>
          View
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.get('/complaints');
        setComplaints(res.data.complaints);
        if (user.role === 'admin') {
          const statRes = await client.get('/complaints/stats/overview');
          setStats(statRes.data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.role]);

  const heading =
    user.role === 'customer'
      ? 'My complaints'
      : user.role === 'agent'
      ? 'Assigned to me'
      : 'Registry overview';

  const subtitle =
    user.role === 'customer'
      ? 'Track every issue you have raised, start to finish.'
      : user.role === 'agent'
      ? 'Complaints currently in your queue.'
      : 'Trends and recent activity across the whole registry.';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{heading}</h1>
          <p>{subtitle}</p>
        </div>
        {user.role === 'customer' && (
          <Link className="btn btn-primary" to="/raise">
            Raise a complaint
          </Link>
        )}
      </div>

      {user.role === 'admin' && stats && (
        <div className="stat-grid">
          <div className="stat-tile">
            <div className="stat-value">{stats.totalComplaints}</div>
            <div className="stat-label">Total complaints</div>
          </div>
          {stats.byStatus.map((s) => (
            <div className="stat-tile" key={s._id}>
              <div className="stat-value">{s.count}</div>
              <div className="stat-label">{s._id.replace('_', ' ')}</div>
            </div>
          ))}
          <div className="stat-tile">
            <div className="stat-value">{stats.averageRating ?? '—'}</div>
            <div className="stat-label">Avg. satisfaction</div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here yet</h3>
            <p>
              {user.role === 'customer'
                ? 'When you raise a complaint, it will show up here.'
                : 'Nothing is queued for you right now.'}
            </p>
          </div>
        ) : (
          complaints.slice(0, 20).map((c) => <ComplaintRow key={c._id} c={c} />)
        )}
      </div>
    </div>
  );
}
