import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetProduct, adminCreateProduct, adminUpdateProduct } from '../../api/products';
import { adminListCategories } from '../../api/categories';
import ImageUploader from '../../components/ImageUploader';
import VariantEditor from '../../components/VariantEditor';

const empty = {
  title: '', category: '', shortDescription: '', description: '',
  images: [], variants: [{ label: '', price: '', mrp: '', stock: '' }],
  tags: '', isActive: true, isFeatured: false,
  seo: { metaTitle: '', metaDescription: '', hsnCode: '' },
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminListCategories().then((r) => setCategories(r.categories));
    if (isEdit) {
      adminGetProduct(id).then((p) => setForm({
        ...p, category: p.category._id, tags: p.tags.join(', '),
        seo: p.seo || { metaTitle: '', metaDescription: '' },
      }));
    }
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        variants: form.variants.map((v) => ({
          label: v.label, sku: v.sku, price: Number(v.price),
          mrp: v.mrp ? Number(v.mrp) : undefined, stock: Number(v.stock),
        })),
      };
      if (isEdit) await adminUpdateProduct(id, payload);
      else await adminCreateProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="admin-page-title">{isEdit ? 'Edit product' : 'Add product'}</h2>
      <form onSubmit={onSubmit} className="admin-form">
        <label>Title
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label>Category
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </label>
        <label>Short description
          <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
        </label>
        <label>Description
          <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label>Tags (comma separated)
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </label>
        <label>HSN code (for GST invoices)
          <input value={form.hsnCode || ''} onChange={(e) => setForm({ ...form, hsnCode: e.target.value })} />
        </label>
        <div className="admin-field-block">
          <span>Images</span>
          <ImageUploader images={form.images} onChange={(images) => setForm({ ...form, images })} />
        </div>
        <div className="admin-field-block">
          <span>Variants</span>
          <VariantEditor variants={form.variants} onChange={(variants) => setForm({ ...form, variants })} />
        </div>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
        </label>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
        </label>
        <label>SEO title
          <input value={form.seo.metaTitle} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })} />
        </label>
        <label>SEO description
          <input value={form.seo.metaDescription} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })} />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
      </form>
    </div>
  );
}