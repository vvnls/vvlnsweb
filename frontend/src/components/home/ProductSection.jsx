import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../product/ProductCard';

export default function ProductSection({ title, params }) {
  const { products, loading } = useProducts({ limit: 8, ...params });
  if (!loading && products.length === 0) return null;

  return (
    <section className="sec">
      <div className="w">
        <div className="sh"><h3>{title}</h3><Link to="/shop">View all</Link></div>
        <div className="gr">
          {loading
            ? <p className="empty">Loading…</p>
            : products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}