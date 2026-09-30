import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../api/order';
import { useToast } from '../components/ui/Toast';

const statusColor = { placed: '#8a6a1c', packed: '#3a6a8a', shipped: '#4f7d2c', delivered: '#2c6b2f', cancelled: '#a13a3a' };

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const toast = useToast();

  const load = () => {
    getMyOrders().then(setOrders);
  };
  useEffect(load, []);

  const onCancel = async (o) => {
    if (!window.confirm('Cancel this order?')) return;
    setBusyId(o._id);
    try {
      await cancelOrder(o._id);
      toast('Order cancelled');
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Could not cancel this order');
    } finally {
      setBusyId(null);
    }
  };

  if (!orders) return <section className="sec"><div className="w"><p className="empty">Loading…</p></div></section>;

  return (
    <section className="sec">
      <div className="w">
        <div className="sh"><h3>My orders</h3></div>
        {orders.length === 0 ? <p className="empty">You haven't placed any orders yet.</p> : orders.map((o) => (
          <div key={o._id} style={{ border: '1px solid var(--ln)', borderRadius: 6, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <b>Order #{o._id.slice(-8).toUpperCase()}</b>
              <span style={{ color: statusColor[o.status], fontWeight: 600, textTransform: 'capitalize' }}>{o.status}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--mut)', margin: '6px 0' }}>
              {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s) · ₹{o.total}
            </p>
            {o.status === 'cancelled' && o.refundStatus === 'initiated' && (
              <p style={{ fontSize: 13 }}>Refund initiated. It can take 5–7 working days to reach your account.</p>
            )}
            {o.status === 'cancelled' && o.refundStatus === 'failed' && (
              <p style={{ fontSize: 13 }}>Your refund is pending review by our team. Please contact support if it doesn't arrive soon.</p>
            )}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Link to={`/order-success/${o._id}`} style={{ color: 'var(--g)', fontWeight: 600, fontSize: 13 }}>View details</Link>
              {['placed', 'packed', 'shipped'].includes(o.status) && (
                <Link to="/track-order" state={{ orderCode: o._id.slice(-8).toUpperCase(), phone: o.shippingAddress.phone }}
                  style={{ color: 'var(--g)', fontWeight: 600, fontSize: 13 }}>Track order</Link>
              )}
              {o.status === 'placed' && (
                <button onClick={() => onCancel(o)} disabled={busyId === o._id}
                  style={{ color: '#c0392b', fontWeight: 600, fontSize: 13 }}>
                  {busyId === o._id ? 'Cancelling…' : 'Cancel order'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}