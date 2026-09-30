import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';

export default function Shop() {
  const [params] = useSearchParams();
  const category = params.get('category') || undefined;
  const q = params.get('q') || undefined;
  const { products, total, loading } = useProducts({ category, q, limit: 24 });

  return (
    <section className="sec">
      <div className="w">
        <div className="sh"><h3>{q ? `Results for "${q}"` : category ? category.replace('-', ' ') : 'All products'}</h3></div>
        <div className="gr">
          {loading
            ? <p className="empty">Loading…</p>
            : total === 0
              ? <p className="empty">No products found. Try a different search.</p>
              : products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}