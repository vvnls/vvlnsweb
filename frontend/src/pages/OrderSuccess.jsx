import { useLocation, useParams, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <section className="sec">
      <div className="w" style={{ textAlign: 'center', padding: '40px 0' }}>
        <h2 style={{ fontFamily: 'Lora,serif', fontSize: 26, marginBottom: 10 }}>Thank you for your order!</h2>
        {order ? (
          <p style={{ marginBottom: 20 }}>
            Order #{order._id.slice(-8).toUpperCase()} — total ₹{order.total} — {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'}
          </p>
        ) : (
          <p style={{ marginBottom: 20 }}>
            Order #{id.slice(-8).toUpperCase()} placed. A confirmation has been sent to your mobile number.
          </p>
        )}
        <Link className="btn" style={{ color: '#222' }} to="/track-order">Track my order</Link>
      </div>
    </section>
  );
}