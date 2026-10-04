import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useAuthStore } from '../../store/authStore';
import Icon from '../ui/Icon';

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const categories = useCategories();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className={`nav2${open ? ' open' : ''}`}>
      <button className="nav2-burger" onClick={() => setOpen((o) => !o)}>☰ Menu</button>
      <div className="w">
        <ul>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/shop">Shop</NavLink></li>
          {categories.map((c) => (
            <li key={c._id}>
              <Link to={`/shop?category=${c.slug}`}>{c.name} <Icon name="arrow" size={11} className="nav2-caret" /></Link>
            </li>
          ))}
          <li><Link to="/track-order">Track Order</Link></li>
          {user ? (
            <>
              <li><Link to="/account/orders">My Orders</Link></li>
              <li><Link to="/account">My Account</Link></li>
              <li><button onClick={async () => { await logout(); navigate('/'); setOpen(false); }}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
            </>
          )}
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#ft">Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
}