import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const back = location.state?.from;
      navigate(user.role === 'admin' ? '/admin' : back || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 420, marginBottom:50 }}>
        <div className="sh"><h3>Login</h3></div>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
          <input required type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 11, border: '1px solid var(--ln)', borderRadius: 4 }} />
          <input required type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 11, border: '1px solid var(--ln)', borderRadius: 4 }} />
            <Link to="/forgot-password" style={{ fontSize: 12.5, color: 'var(--mut)', textAlign: 'right' }}>Forgot password?</Link>
          {error && <p style={{ color: '#b33', fontSize: 13 }}>{error}</p>}
          <button className="btn" style={{ color: '#222' }} disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 13.5 }}>
          New here? <Link to="/register" style={{ color: 'var(--g)', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </section>
  );
}