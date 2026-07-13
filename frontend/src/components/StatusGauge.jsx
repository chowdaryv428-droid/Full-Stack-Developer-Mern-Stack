const STEPS = [
  { key: 'open', label: 'Open' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

// Signature "harbor gauge" — reads a complaint's journey like a ship's telegraph dial.
export default function StatusGauge({ status }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="harbor-gauge">
      {STEPS.map((step, i) => {
        let cls = 'gauge-step';
        if (i < currentIndex) cls += ' done';
        if (i === currentIndex) cls += ' current';
        return (
          <div key={step.key} className={cls}>
            <div className="track" />
            <div className="dot" />
            <div className="gauge-label">{step.label}</div>
          </div>
        );
      })}
    </div>
  );
}
