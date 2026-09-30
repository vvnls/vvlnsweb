import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProduct, getReviews } from '../api/products';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../components/ui/Toast';
import ReviewList from '../components/product/ReviewList';
import ImageGallery from '../components/product/ImageGallery';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewData, setReviewData] = useState({ reviews: [], average: 0, total: 0 });
  const add = useCartStore((s) => s.add);
  const toast = useToast();

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setVariantIdx(0);
    setQty(1);
    setReviewData({ reviews: [], average: 0, total: 0 });
    getProduct(slug).catch(() => setNotFound(true)).then((p) => p && setProduct(p));
    getReviews(slug).then(setReviewData).catch(() => {});
  }, [slug]);

  if (notFound) {
    return (
      <section className="sec"><div className="w">
        <p className="empty">Product not found. <Link to="/shop">Back to shop</Link></p>
      </div></section>
    );
  }
  if (!product) return <section className="sec"><div className="w"><p className="empty">Loading…</p></div></section>;

  const v = product.variants[variantIdx];
  const onSale = v.mrp && v.mrp > v.price;
  const maxQty = Math.min(v.stock, 10);

  const onAdd = () => {
    for (let i = 0; i < qty; i++) add(product, v);
    toast(`${product.title} (${v.label}) added to cart`);
  };

  return (
    <section className="sec">
      <Helmet>
        <title>{product.seo?.metaTitle || `${product.title} | Vedvisha Naturals`}</title>
        <meta name="description" content={product.seo?.metaDescription || product.shortDescription || ''} />
      </Helmet>

      <div className="w pd-grid">
        <ImageGallery images={product.images} />
        <div className="pd-info">
          <small style={{ color: 'var(--mut)' }}>{product.category?.name}</small>
          <h1 className="pd-title">{product.title}</h1>
          {product.shortDescription && <p style={{ marginBottom: 18 }}>{product.shortDescription}</p>}

          <div className="pd-variants">
            {product.variants.map((variant, i) => (
              <button key={variant.label}
                onClick={() => { setVariantIdx(i); setQty(1); }}
                className={`ct pd-variant-btn${i === variantIdx ? ' on' : ''}`}>
                {variant.label}
              </button>
            ))}
          </div>

          <div className="pr pd-price">{onSale && <s>₹{v.mrp}</s>}₹{v.price}</div>
          <p className={`pd-stock${v.stock > 0 ? '' : ' out'}`}>
            {v.stock > 0 ? `In stock (${v.stock} left)` : 'Out of stock  '}
            <span className="d-stocks">past month 500+ bought</span>
          </p>

          {v.stock > 0 && (
            <div className="pd-qty-row">
              <div className="q pd-qty">
                <button onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Less">−</button>
                {qty}
                <button onClick={() => setQty((n) => Math.min(maxQty, n + 1))} aria-label="More">+</button>
              </div>
              <button className="btn pd-add" onClick={onAdd}>Add to cart</button>
            </div>
          )}

          {product.description && <p className="pd-desc">{product.description}</p>}
        </div>
      </div>

      <div className="w" style={{ marginTop: 40 }}>
        <div className="sh"><h3>Customer reviews</h3></div>
        <ReviewList {...reviewData} />
      </div>
    </section>
  );
}