import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminListProducts, adminDeleteProduct } from '../../api/products';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';

export default function ProductList() {
  const [data, setData] = useState({ products: [], total: 0 });
  const [q, setQ] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminListProducts({ q: q || undefined, limit: 50 }).then(setData).finally(() => setLoading(false));
  };
  useEffect(load, [q]);

  const onDelete = async () => {
    await adminDeleteProduct(toDelete._id);
    setToDelete(null);
    load();
  };

  return (
    <div>
      <div className="admin-page-head">
        <h2 className="admin-page-title">Products</h2>
        <Link className="admin-btn" to="/admin/products/new">Add product</Link>
      </div>
      <input className="admin-search" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
      {loading ? <p>Loading…</p> : (
        <DataTable
          columns={[
            { key: 'image', label: '', render: (p) => <img src={p.images?.[0]?.url} alt="" className="admin-row-thumb" /> },
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category', render: (p) => p.category?.name },
            { key: 'price', label: 'Price', render: (p) => `₹${p.minPrice}${p.maxPrice > p.minPrice ? ` – ₹${p.maxPrice}` : ''}` },
            { key: 'status', label: 'Status', render: (p) => <StatusBadge active={p.isActive} /> },
          ]}
          rows={data.products}
          renderActions={(p) => (
            <>
              <Link to={`/admin/products/${p._id}`} className="admin-link">Edit</Link>{' '}
              <button className="admin-link-danger" onClick={() => setToDelete(p)}>Delete</button>
            </>
          )}
        />
      )}
      <ConfirmDialog open={!!toDelete} message={`Delete "${toDelete?.title}"? This cannot be undone.`}
        onConfirm={onDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}