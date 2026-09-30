import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
    } finally {
      setSent(true); // always show the same message, whether or not the email exists
      setLoading(false);
    }
  };

  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 420, marginBottom:70, marginTop:50 }}>
        <div className="sh"><h3>Forgot password</h3></div>
        {sent ? (
          <p>If that email exists in our system, a reset link has been sent. Check your inbox.</p>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
            <input required type="email" placeholder="Your email address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: 11, border: '1px solid var(--ln)', borderRadius: 4 }} />
            <button className="btn" style={{ color: '#222' }} disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
        <p style={{ marginTop: 16, fontSize: 13.5 }}>
          <Link to="/login" style={{ color: 'var(--g)', fontWeight: 600 }}>Back to login</Link>
        </p>
      </div>
    </section>
  );
}