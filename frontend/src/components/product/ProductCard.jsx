import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useToast } from '../ui/Toast';

export default function ProductCard({ product }) {
  const add = useCartStore((s) => s.add);
  const navigate = useNavigate();
  const toast = useToast();
  const v = product.variants[0];
  const onSale = v.mrp && v.mrp > v.price;

  return (
    <article className="cd">
      {/* {onSale && <span className="sale">Sale!</span>} */}
      <Link to={`/product/${product.slug}`}>
        <div className="im" style={{ backgroundImage: product.images?.[0] ? `url(${product.images[0].url})` : 'linear-gradient(150deg,#4f7d2c,#1a2c12)' }} />
      </Link>
      <div className="in">
        <small>{product.category?.name}</small>
        <h4><Link to={`/product/${product.slug}`}>{product.title}</Link></h4>
        <div className="pr">
          {onSale && <s>₹{v.mrp}</s>}₹{product.minPrice}
          {product.maxPrice > product.minPrice ? ` – ₹${product.maxPrice}` : ''}
        </div>
      </div>
      <div className="cd-actions">
        <button className="ad" onClick={() => { add(product, v); toast(`${product.title} added to cart`); }}>
          Add to cart
        </button>
        <button className="ad ad-buy" onClick={() => { add(product, v); navigate('/checkout'); }}>
          Buy Now
        </button>
      </div>
    </article>
  );
}