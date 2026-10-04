import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { createOrder, verifyPayment } from '../api/order';
import { SITE } from '../config/site';

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
  const [method, setMethod] = useState('cod');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const submittingRef = useRef(false);

  const list = Object.values(items);
  const subtotal = list.reduce((n, i) => n + i.qty * i.variant.price, 0);
  const qualifiesFreeShipping = subtotal >= SITE.freeShippingAbove;
  const shippingFee = qualifiesFreeShipping ? 0 : SITE.shippingFee;
  const codCharge = method === 'cod' ? SITE.codCharge : 0;
  const total = subtotal + shippingFee + codCharge;

  const onChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current || list.length === 0) return;
    submittingRef.current = true;
    setError('');
    setPlacing(true);

    const orderItems = list.map((i) => ({ productId: i.product._id, variantLabel: i.variant.label, qty: i.qty }));
    const reset = () => { submittingRef.current = false; setPlacing(false); };

    try {
      if (method === 'cod') {
        const res = await createOrder({ email, items: orderItems, shippingAddress: address, paymentMethod: 'cod' });
        clear();
        navigate(`/order-success/${res.order._id}`, { state: { order: res.order } });
        return;
      }

      const res = await createOrder({ email, items: orderItems, shippingAddress: address, paymentMethod: 'razorpay' });
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error('Could not load payment gateway. Check your connection.');

      const rzp = new window.Razorpay({
        key: res.keyId,
        amount: res.amount,
        currency: 'INR',
        name: 'Vedvisha Naturals',
        order_id: res.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              email, items: orderItems, shippingAddress: address,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clear();
            navigate(`/order-success/${verifyRes.order._id}`, { state: { order: verifyRes.order } });
          } catch (err) {
            setError(err.response?.data?.message || 'Payment succeeded but order creation failed. Contact support.');
          } finally {
            reset();
          }
        },
        modal: { ondismiss: reset },
        prefill: { name: address.name, email, contact: address.phone },
        theme: { color: '#4f7d2c' },
      });
      rzp.on('payment.failed', () => { setError('Payment failed. Please try again.'); reset(); });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
      reset();
    }
  };

  if (list.length === 0) {
    return <section className="sec"><div className="w"><p className="empty">Your cart is empty.</p></div></section>;
  }

  return (
    <section className="sec">
      <div className="w checkout-grid">
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <div className="sh"><h3>Contact & shipping</h3></div>
          <input required type="email" placeholder="Email address (for order confirmation)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required name="name" placeholder="Full name" value={address.name} onChange={onChange} />
          <input required name="phone" placeholder="Mobile number" value={address.phone} onChange={onChange} />
          <input required name="line1" placeholder="Address line 1" value={address.line1} onChange={onChange} />
          <input name="line2" placeholder="Address line 2 (optional)" value={address.line2} onChange={onChange} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input required name="city" placeholder="City" value={address.city} onChange={onChange} style={{ flex: 1, minWidth: 100 }} />
            <input required name="state" placeholder="State" value={address.state} onChange={onChange} style={{ flex: 1, minWidth: 100 }} />
            <input required name="pincode" placeholder="Pincode" value={address.pincode} onChange={onChange} style={{ flex: 1, minWidth: 100 }} />
          </div>

          <div className="sh" style={{ marginTop: 10 }}><h3>Payment method</h3></div>
          <label className="pay-option">
            <input type="radio" checked={method === 'cod'} onChange={() => setMethod('cod')} />
            <span>Cash on Delivery</span>
            <small>+₹{SITE.codCharge} COD charge</small>
          </label>
          <label className="pay-option">
            <input type="radio" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} />
            <span>Pay online (UPI / Card)</span>
            <small>No extra charge</small>
          </label>

          {error && <p className="admin-error">{error}</p>}
          <button className="btn" style={{ color: '#222', width: 'fit-content' }} disabled={placing}>
            {placing ? 'Placing order…' : method === 'cod' ? 'Place order' : 'Proceed to pay'}
          </button>
        </form>

        <div>
          <div className="sh"><h3>Order summary</h3></div>
          {list.map((i) => (
            <div key={`${i.product._id}:${i.variant.label}`} className="bill-row">
              <span>{i.product.title} ({i.variant.label}) × {i.qty}</span>
              <span>₹{i.variant.price * i.qty}</span>
            </div>
          ))}
          <div className="bill-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="bill-row">
            <span>Shipping</span>
            {qualifiesFreeShipping ? <span className="bill-free">Free</span> : <span>₹{shippingFee}</span>}
          </div>
          {method === 'cod' && (
            <div className="bill-row"><span>Cash on Delivery charge</span><span>₹{codCharge}</span></div>
          )}
          {qualifiesFreeShipping && <p className="bill-savings">You saved ₹{SITE.shippingFee} with free shipping on this order!</p>}
          {!qualifiesFreeShipping && <p className="bill-hint">Add ₹{SITE.freeShippingAbove - subtotal} more to unlock free shipping.</p>}
          <div className="bill-total"><span>Total</span><span>₹{total}</span></div>
        </div>
      </div>
    </section>
  );
}