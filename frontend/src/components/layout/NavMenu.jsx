import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import Icon from '../ui/Icon';

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const categories = useCategories();

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
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#ft">Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
}