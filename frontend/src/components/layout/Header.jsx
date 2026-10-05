import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { getProducts } from '../../api/products';
import Icon from '../ui/Icon';
import image from '../../../src/assets/image.png';

export default function Header({ onCartClick }) {
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const count = Object.values(items).reduce((n, i) => n + i.qty, 0);
  const total = Object.values(items).reduce((n, i) => n + i.qty * i.variant.price, 0);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(() => {
      getProducts({ q: term, limit: 5 }).then((res) => setSuggestions(res.products));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClickOutside = (e) => { if (!boxRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const goToShop = () => {
    if (q.trim()) navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  const goToProduct = (slug) => {
    navigate(`/product/${slug}`);
    setQ('');
    setOpen(false);
  };

  return (
    <header className="hd">
      <div className="w bar">
        <Link to="/" className="logo2">
          <span className="logo2-icon"><img src={image} alt="Vedvishwa Naturals" /></span>
          <span>
            <span className="logo2-name">Vedvishwa<br />Naturals</span>
            <small>PURE HERBS · NATURAL WELLNESS · NATURALLY YOU</small>
          </span>
        </Link>

        <div className="search-box" ref={boxRef}>
          <form role="search" className="search-form" onSubmit={(e) => { e.preventDefault(); goToShop(); }}>
            <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
              type="search" placeholder="Search for herbs, powders, spices…" aria-label="Search" />
            <button type="submit">Search</button>
          </form>
          {open && suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((p) => (
                <button key={p._id} className="search-item" onMouseDown={(e) => e.preventDefault()} onClick={() => goToProduct(p.slug)}>
                  <span>{p.title}</span><span className="search-item-price">₹{p.minPrice}</span>
                </button>
              ))}
              <button className="search-item search-see-all" onMouseDown={(e) => e.preventDefault()} onClick={goToShop}>
                See all results for "{q}"
              </button>
            </div>
          )}
        </div>

        <div className="acts">
          <Link className="lg" to={user ? '/account' : '/login'}>
            <Icon name="user" size={18} /> {user ? user.name.split(' ')[0] : 'Login / Register'}
          </Link>
          <button className="cbtn" onClick={onCartClick}><Icon name="cart" size={18} /> Cart | ₹{total} ({count})</button>
        </div>
      </div>
    </header>
  );
}