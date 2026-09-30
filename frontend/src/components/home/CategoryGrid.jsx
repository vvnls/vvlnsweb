import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import Icon from '../ui/Icon';

const COLORS = ['#4f7d2c', '#c78f2c', '#3a6a8a', '#8a5a2c', '#6a4f8a', '#2c8a6a', '#a13a5a', '#5a7a2c'];

export default function CategoryGrid() {
  const categories = useCategories();

  return (
    <section className="sec">
      <div className="w">
        <div className="cats2-head">
          <div>
            <p className="eyebrow">Our Categories</p>
            <h2 className="cats2-title">Explore Our Natural Range</h2>
          </div>
          <Link to="/shop" className="cats2-viewall">View All Categories <Icon name="arrow" size={15} /></Link>
        </div>
        <div className="cats2">
          {categories.map((c, i) => (
            <Link key={c._id} to={`/shop?category=${c.slug}`} className="cat2">
              <span className="cat2-circle" style={{ background: `linear-gradient(150deg, ${COLORS[i % COLORS.length]}, #1a2c12)` }} />
              <b>{c.name}</b>
              <Icon name="arrow" size={13} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}