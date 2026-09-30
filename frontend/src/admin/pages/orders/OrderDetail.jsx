import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminGetOrder, adminUpdateOrderStatus, adminRetryRefund, adminDownloadInvoice } from '../../api/orders';

const NEXT = { placed: ['packed', 'cancelled'], packed: ['shipped', 'cancelled'], shipped: ['delivered'], delivered: [], cancelled: [] };
const COURIERS = ['Shiprocket', 'Delhivery', 'India Post', 'DTDC', 'Blue Dart', 'Xpressbees'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [ship, setShip] = useState({ courier: '', trackingNumber: '', trackingUrl: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    adminGetOrder(id).then((o) => {
      setOrder(o);
      setShip({ courier: o.courier || '', trackingNumber: o.trackingNumber || '', trackingUrl: o.trackingUrl || '' });
    });
  };
  useEffect(load, [id]);

  const run = async (fn) => {
    setSaving(true);
    setError('');
    try {
      await fn();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const onStatus = (status) => {
    if (!status) return;
    if (status === 'cancelled') {
      const refundNote = order.paymentMethod === 'razorpay' && order.paymentStatus === 'paid' ? ' and the payment refunded' : '';
      if (!window.confirm(`Cancel this order? Stock will be restored${refundNote}.`)) return;
    }
    run(() => adminUpdateOrderStatus(id, { status, ...ship }));
  };

  if (!order) return <p>Loading…</p>;
  const a = order.shippingAddress;

  return (
    <div>
      <h2 className="admin-page-title">Order #{order._id.slice(-8).toUpperCase()}</h2>
      <div className="admin-form" style={{ maxWidth: 700 }}>
        <p><b>Customer:</b> {order.user?.name} ({order.user?.email})</p>
        <p><b>Address:</b> {a.name}, {a.line1}, {a.line2 || ''} {a.city}, {a.state} - {a.pincode} · {a.phone}</p>
        <p><b>Payment:</b> {order.paymentMethod.toUpperCase()} · {order.paymentStatus}</p>
        <div>
          <b>Items:</b>
          <ul>{order.items.map((i, idx) => <li key={idx}>{i.title} ({i.variantLabel}) × {i.qty} — ₹{i.price * i.qty}</li>)}</ul>
        </div>
        <p><b>Total:</b> ₹{order.total}</p>
        {order.invoiceNumber && <p><b>Invoice No:</b> {order.invoiceNumber}</p>}
        <button className="admin-btn-ghost" onClick={() => adminDownloadInvoice(order._id, order.invoiceNumber)}>
          Download Invoice (PDF)
        </button>
        <p><b>Status:</b> {order.status}</p>

        {order.statusHistory?.length > 0 && (
          <p style={{ fontSize: 13, color: 'var(--mut)' }}>
            {order.statusHistory.map((h) => `${h.status} (${new Date(h.at).toLocaleString('en-IN')})`).join(' → ')}
          </p>
        )}
        {order.status === 'cancelled' && (
          <p>Cancelled by {order.cancelledBy}{order.cancelReason ? `: ${order.cancelReason}` : ''}</p>
        )}
        {order.refundStatus === 'initiated' && <p>Refund initiated (ID: {order.refundId}).</p>}
        {order.refundStatus === 'failed' && (
          <div>
            <p className="admin-error">The automatic refund failed. Retry it, or refund manually from the Razorpay dashboard.</p>
            <button className="admin-btn" disabled={saving} onClick={() => run(() => adminRetryRefund(id))}>Retry refund</button>
          </div>
        )}

        {order.status !== 'cancelled' && (
          <div className="admin-field-block">
            <span>Shipping details</span>
            <label>Courier / shipping platform
              <input list="couriers" value={ship.courier} onChange={(e) => setShip({ ...ship, courier: e.target.value })}
                placeholder="Pick one or type your own" />
              <datalist id="couriers">{COURIERS.map((c) => <option key={c} value={c} />)}</datalist>
            </label>
            <label>Tracking number (AWB)
              <input value={ship.trackingNumber} onChange={(e) => setShip({ ...ship, trackingNumber: e.target.value })} />
            </label>
            <label>Tracking link (optional, must start with https://)
              <input value={ship.trackingUrl} onChange={(e) => setShip({ ...ship, trackingUrl: e.target.value })}
                placeholder="Leave empty for Shiprocket or Delhivery, we build it for you" />
            </label>
            <button className="admin-btn-ghost" disabled={saving}
              onClick={() => run(() => adminUpdateOrderStatus(id, { status: order.status, ...ship }))}>
              Save shipping details
            </button>
          </div>
        )}

        {NEXT[order.status].length > 0 && (
          <label>Move order to
            <select value="" onChange={(e) => onStatus(e.target.value)} disabled={saving}>
              <option value="">Choose next status…</option>
              {NEXT[order.status].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        )}
        {error && <p className="admin-error">{error}</p>}
      </div>
    </div>
  );
}