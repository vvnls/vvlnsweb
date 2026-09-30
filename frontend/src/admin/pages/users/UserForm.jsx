import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetUser, adminCreateUser, adminUpdateUser } from '../../api/users';

const empty = { name: '', email: '', phone: '', password: '', role: 'customer', isActive: true };

export default function UserForm() {
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) adminGetUser(id).then((r) => setForm({ ...r.user, password: '' }));
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        const { name, phone, role, isActive, password } = form;
        await adminUpdateUser(id, { name, phone, role, isActive, ...(password && { password }) });
      } else {
        await adminCreateUser(form);
      }
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="admin-page-title">{isEdit ? 'Edit user' : 'Add user'}</h2>
      <form onSubmit={onSubmit} className="admin-form">
        <label>Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>Email
          <input required type="email" disabled={isEdit} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>Phone
          <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label>{isEdit ? 'New password (leave blank to keep current)' : 'Password'}
          <input type="password" required={!isEdit} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <label>Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Save user'}</button>
      </form>
    </div>
  );
}