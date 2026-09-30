import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useToast } from '../ui/Toast';
import { SITE } from '../../config/site';

export default function CartDrawer({ open, onClose }) {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const toast = useToast();
  const list = Object.entries(items);
  const subtotal = list.reduce((n, [, i]) => n + i.qty * i.variant.price, 0);
  const navigate = useNavigate();

  return (
    <>
      <div className={`sd${open ? ' on' : ''}`} onClick={onClose} />
      <aside className={`dr${open ? ' on' : ''}`} aria-label="Cart">
        <div className="dh">Cart<button onClick={onClose} aria-label="Close">✕</button></div>
        <div className="its">
          {list.length === 0
            ? <p className="empty">No products in the cart.</p>
            : list.map(([key, i]) => (
              <div className="it" key={key}>
                <b>{i.product.title} ({i.variant.label})</b>
                <span>₹{i.variant.price * i.qty}</span>
                <div className="q">
                  <button onClick={() => setQty(key, i.qty - 1)} aria-label="Less">−</button>
                  {i.qty}
                  <button onClick={() => setQty(key, i.qty + 1)} aria-label="More">+</button>
                </div>
              </div>
            ))}
        </div>
        <div className="df">
          <div className="tt"><span>Subtotal =</span><span> ₹{subtotal}</span></div>
          <p className="sm">
            {list.length === 0 ? '' : subtotal >= SITE.freeShippingAbove
              ? `You've unlocked free shipping — you saved ₹${SITE.shippingFee}!`
              : `Add ₹${SITE.freeShippingAbove - subtotal} more for free shipping.`}
          </p>
          <button className="co" onClick={() => {
            if (list.length === 0) { toast('Your cart is empty'); return; }
            onClose();
            navigate('/checkout');
          }}>Checkout</button>
        </div>
      </aside>
    </>
  );
}