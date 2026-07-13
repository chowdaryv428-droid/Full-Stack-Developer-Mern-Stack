import { createContext, useContext, useEffect, useState } from 'react';
import client, { extractError } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ccr_token');
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('ccr_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await client.post('/auth/login', { email, password });
      localStorage.setItem('ccr_token', res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: extractError(err) };
    }
  };

  const register = async (payload) => {
    try {
      const res = await client.post('/auth/register', payload);
      localStorage.setItem('ccr_token', res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: extractError(err) };
    }
  };

  const logout = () => {
    localStorage.removeItem('ccr_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
