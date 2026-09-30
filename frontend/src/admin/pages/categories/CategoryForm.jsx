import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminListCategories, adminCreateCategory, adminUpdateCategory } from '../../api/categories';

const empty = { name: '', description: '', isActive: true, sortOrder: 0 };

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      adminListCategories().then((r) => {
        const cat = r.categories.find((c) => c._id === id);
        if (cat) setForm(cat);
      });
    }
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) await adminUpdateCategory(id, form);
      else await adminCreateCategory(form);
      navigate('/admin/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="admin-page-title">{isEdit ? 'Edit category' : 'Add category'}</h2>
      <form onSubmit={onSubmit} className="admin-form">
        <label>Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>Description
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label>Sort order
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </label>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Save category'}</button>
      </form>
    </div>
  );
}