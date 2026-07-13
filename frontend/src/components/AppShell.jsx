import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_BY_ROLE = {
  customer: [
    { to: '/', label: 'My complaints' },
    { to: '/raise', label: 'Raise a complaint' },
    { to: '/profile', label: 'Profile' },
  ],
  agent: [
    { to: '/', label: 'Assigned to me' },
    { to: '/profile', label: 'Profile' },
  ],
  admin: [
    { to: '/', label: 'Overview' },
    { to: '/admin/complaints', label: 'All complaints' },
    { to: '/admin/agents', label: 'Agents' },
    { to: '/profile', label: 'Profile' },
  ],
};

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV_BY_ROLE[user?.role] || [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="wordmark">
            Harbor<span className="dot">.</span>
          </div>
          <nav>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-user">
          <div>{user?.name}</div>
          <span className="sidebar-role">{user?.role}</span>
          <div style={{ marginTop: 12 }}>
            <button
              className="btn btn-outline btn-sm"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#dfe7ec' }}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <main className="main-area">{children}</main>
    </div>
  );
}
