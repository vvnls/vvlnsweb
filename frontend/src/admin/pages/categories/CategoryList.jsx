import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminListCategories, adminDeleteCategory } from '../../api/categories';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [toDelete, setToDelete] = useState(null);
  const [error, setError] = useState('');

  const load = () => { adminListCategories().then((r) => setCategories(r.categories)); };
  useEffect(load, []);

  const onDelete = async () => {
    setError('');
    try {
      await adminDeleteCategory(toDelete._id);
      setToDelete(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete category');
      setToDelete(null);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <h2 className="admin-page-title">Categories</h2>
        <Link className="admin-btn" to="/admin/categories/new">Add category</Link>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'sortOrder', label: 'Order' },
          { key: 'status', label: 'Status', render: (c) => <StatusBadge active={c.isActive} /> },
        ]}
        rows={categories}
        renderActions={(c) => (
          <>
            <Link to={`/admin/categories/${c._id}`} className="admin-link">Edit</Link>{' '}
            <button className="admin-link-danger" onClick={() => setToDelete(c)}>Delete</button>
          </>
        )}
      />
      <ConfirmDialog open={!!toDelete} message={`Delete "${toDelete?.name}"?`}
        onConfirm={onDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}