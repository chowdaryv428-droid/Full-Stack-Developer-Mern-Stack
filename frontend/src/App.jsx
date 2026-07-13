import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RaiseComplaint from './pages/RaiseComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminComplaints from './pages/AdminComplaints';
import AdminAgents from './pages/AdminAgents';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function Shell({ children }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return <div className="empty-state">Loading Harbor…</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Shell>
              <Dashboard />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/raise"
        element={
          <ProtectedRoute roles={['customer']}>
            <Shell>
              <RaiseComplaint />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints/:id"
        element={
          <ProtectedRoute>
            <Shell>
              <ComplaintDetail />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute roles={['admin']}>
            <Shell>
              <AdminComplaints />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agents"
        element={
          <ProtectedRoute roles={['admin']}>
            <Shell>
              <AdminAgents />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Shell>
              <Profile />
            </Shell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
