import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      await fetchMe();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 420, marginBottom:50 }}>
        <div className="sh"><h3>Create an account</h3></div>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
          <input required name="name" placeholder="Full name" value={form.name} onChange={onChange}
            style={{ padding: 11, border: '1px solid var(--ln)', borderRadius: 4 }} />
          <input required name="email" type="email" placeholder="Email address" value={form.email} onChange={onChange}
            style={{ padding: 11, border: '1px solid var(--ln)', borderRadius: 4 }} />
          <input name="phone" placeholder="Mobile number (optional)" value={form.phone} onChange={onChange}
            style={{ padding: 11, border: '1px solid var(--ln)', borderRadius: 4 }} />
          <input required name="password" type="password" placeholder="Password" value={form.password} onChange={onChange}
            style={{ padding: 11, border: '1px solid var(--ln)', borderRadius: 4 }} />
          {error && <p style={{ color: '#b33', fontSize: 13 }}>{error}</p>}
          <button className="btn" style={{ color: '#222' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 13.5 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--g)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </section>
  );
}