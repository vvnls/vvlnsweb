import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <section className="sec"><div className="w" style={{ maxWidth: 420 }}>
        <p>This reset link is missing its token. <Link to="/forgot-password" style={{ color: 'var(--g)', fontWeight: 600 }}>Request a new one</Link>.</p>
      </div></section>
    );
  }

  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 420, marginBottom:50 }}>
        <div className="sh"><h3>Reset password</h3></div>
        {done ? (
          <p>Password updated. Redirecting to login…</p>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
            <input required type="password" placeholder="New password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: 11, border: '1px solid var(--ln)', borderRadius: 4 }} />
            {error && <p style={{ color: '#b33', fontSize: 13 }}>{error}</p>}
            <button className="btn" style={{ color: '#222' }} disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}