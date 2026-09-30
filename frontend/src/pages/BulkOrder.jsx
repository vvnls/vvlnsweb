import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { submitBulkEnquiry } from '../api/bulkEnquiry';

const empty = { name: '', businessName: '', email: '', phone: '', productInterest: '', quantity: '', message: '' };

export default function BulkOrder() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitBulkEnquiry(form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sec">
      <Helmet>
        <title>Bulk Orders | Vedvisha Naturals</title>
        <meta name="description" content="Enquire about bulk pricing and minimum order quantities for herbs, powders and spices." />
      </Helmet>
      <div className="w" style={{ maxWidth: 560 }}>
        <div className="sh"><h3>Bulk order enquiry</h3></div>
        <p style={{ marginBottom: 18 }}>
          Buying for a clinic, salon, store or event? Tell us what you need and roughly how much,
          and our team will get back to you with minimum order quantity, pricing and shipping details.
        </p>

        {sent ? (
          <p style={{ fontWeight: 600 }}>Thank you! Our team will get back to you shortly at the email or number you provided.</p>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
            <input required name="name" placeholder="Your name" value={form.name} onChange={onChange} />
            <input name="businessName" placeholder="Business name (optional)" value={form.businessName} onChange={onChange} />
            <input required name="email" type="email" placeholder="Email address" value={form.email} onChange={onChange} />
            <input required name="phone" placeholder="Mobile number" value={form.phone} onChange={onChange} />
            <input required name="productInterest" placeholder="Product(s) you're interested in (e.g. Amla powder, Ashwagandha)"
              value={form.productInterest} onChange={onChange} />
            <input required name="quantity" placeholder="Quantity needed (e.g. 50 kg/month, 500 units one-time)"
              value={form.quantity} onChange={onChange} />
            <textarea name="message" rows={4} placeholder="Anything else we should know? (optional)"
              value={form.message} onChange={onChange} />
            {error && <p className="admin-error">{error}</p>}
            <button className="btn" style={{ color: '#222', width: 'fit-content' }} disabled={loading}>
              {loading ? 'Sending…' : 'Submit enquiry'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}