import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMyOrder } from '../api/order';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { getMyOrder(id).then(setOrder); }, [id]);

  return (
    <section className="sec">
      <div className="w" style={{ textAlign: 'center', padding: '40px 0' }}>
        <h2 style={{ fontFamily: 'Lora,serif', fontSize: 26, marginBottom: 10 }}>Thank you for your order!</h2>
        {order && (
          <p style={{ marginBottom: 20 }}>
            Order #{order._id.slice(-8).toUpperCase()} — total ₹{order.total} — {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'}
          </p>
        )}
        <Link className="btn" style={{ color: '#222' }} to="/account/orders">View my orders</Link>
      </div>
    </section>
  );
}