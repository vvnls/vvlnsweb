import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminListUsers, adminDeleteUser } from '../../api/users';
import DataTable from '../../components/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';

export default function UserList() {
  const [data, setData] = useState({ users: [], total: 0 });
  const [q, setQ] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [error, setError] = useState('');

  const load = () => { adminListUsers({ q: q || undefined, limit: 50 }).then(setData); };
  useEffect(load, [q]);

  const onDelete = async () => {
    setError('');
    try {
      await adminDeleteUser(toDelete._id);
      setToDelete(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete user');
      setToDelete(null);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <h2 className="admin-page-title">Users</h2>
        <Link className="admin-btn" to="/admin/users/new">Add user</Link>
      </div>
      <input className="admin-search" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
      {error && <p className="admin-error">{error}</p>}
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status', render: (u) => <StatusBadge active={u.isActive} /> },
        ]}
        rows={data.users}
        renderActions={(u) => (
          <>
            <Link to={`/admin/users/${u._id}`} className="admin-link">Edit</Link>{' '}
            <button className="admin-link-danger" onClick={() => setToDelete(u)}>Delete</button>
          </>
        )}
      />
      <ConfirmDialog open={!!toDelete} message={`Delete "${toDelete?.name}"? This cannot be undone.`}
        onConfirm={onDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}