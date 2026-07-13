export function StatusBadge({ status }) {
  const labels = {
    open: 'Open',
    assigned: 'Assigned',
    in_progress: 'In progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return <span className={`badge badge-${status}`}>{labels[status] || status}</span>;
}

export function PriorityTag({ priority }) {
  return (
    <span style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>
      <span className={`priority-dot priority-${priority}`} />
      {priority}
    </span>
  );
}
