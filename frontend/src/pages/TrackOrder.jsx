import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { trackOrder } from '../api/order';

const STEPS = [
  ['placed', 'Order placed'],
  ['packed', 'Packed'],
  ['shipped', 'Shipped'],
  ['delivered', 'Delivered'],
];

const fmt = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function TrackOrder() {
  const location = useLocation();
  const [params] = useSearchParams();
  const [orderCode, setOrderCode] = useState(location.state?.orderCode || params.get('order') || '');
  const [phone, setPhone] = useState(location.state?.phone || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = async (code, ph) => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      setResult(await trackOrder({ orderCode: code, phone: ph }));
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // when the customer arrives from "My orders", look it up straight away
  useEffect(() => {
    if (location.state?.orderCode && location.state?.phone) {
      lookup(location.state.orderCode, location.state.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    lookup(orderCode, phone);
  };

  const at = (status) => result?.history.find((h) => h.status === status)?.at;
  const cancelled = result?.status === 'cancelled';

  return (
    <section className="sec">
      <Helmet>
        <title>Track your order | Vedvisha Naturals</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="w">
        <div className="sh"><h3>Track your order</h3></div>
        <form onSubmit={onSubmit} className="track-form">
          <input required placeholder="Order number (8 characters, from your email)" value={orderCode}
            onChange={(e) => setOrderCode(e.target.value.replace('#', ''))} maxLength={9} />
          <input required inputMode="numeric" placeholder="Mobile number used for the order" value={phone}
            onChange={(e) => setPhone(e.target.value)} maxLength={10} />
          {error && <p className="admin-error">{error}</p>}
          <button className="btn" disabled={loading}>{loading ? 'Checking…' : 'Track order'}</button>
        </form>

        {result && (
          <div className="track-card">
            <p><b>Order #{result.orderCode}</b> · placed on {fmt(result.placedAt)}</p>
            <p style={{ color: 'var(--mut)', fontSize: 13 }}>
              {result.items.map((i) => `${i.title} (${i.variantLabel}) × ${i.qty}`).join(', ')}
            </p>
            <p style={{ fontSize: 13 }}>Delivering to {result.city} - {result.pincode} · ₹{result.total} · {result.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'}</p>

            {cancelled ? (
              <div className="tl-cancel">This order was cancelled{at('cancelled') ? ` on ${fmt(at('cancelled'))}` : ''}.</div>
            ) : (
              <div className="tl">
                {STEPS.map(([key, label]) => (
                  <div key={key} className={`tl-step${at(key) ? ' done' : ''}${result.status === key ? ' now' : ''}`}>
                    <span className="tl-dot" />
                    <b>{label}</b>
                    <small>{at(key) ? fmt(at(key)) : 'Pending'}</small>
                  </div>
                ))}
              </div>
            )}

            {['shipped', 'delivered'].includes(result.status) && (
              result.trackingNumber || result.trackingUrl ? (
                <div style={{ marginTop: 8 }}>
                  {result.courier && <p><b>Courier:</b> {result.courier}</p>}
                  {result.trackingNumber && <p><b>Tracking number:</b> {result.trackingNumber}</p>}
                  {result.trackingUrl && (
                    <a className="btn" style={{ marginTop: 10 }} href={result.trackingUrl} target="_blank" rel="noopener noreferrer">
                      Track on courier website
                    </a>
                  )}
                </div>
              ) : (
                <p style={{ marginTop: 8, fontSize: 13.5 }}>Your parcel is on its way. Courier tracking details will be added here shortly.</p>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}