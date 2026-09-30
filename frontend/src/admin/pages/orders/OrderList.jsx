import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminListOrders } from '../../api/orders';
import DataTable from '../../components/DataTable';

const statuses = ['', 'placed', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function OrderList() {
  const [data, setData] = useState({ orders: [], total: 0 });
  const [status, setStatus] = useState('');

  useEffect(() => {
    adminListOrders({ status: status || undefined, limit: 50 }).then(setData);
  }, [status]);

  return (
    <div>
      <div className="admin-page-head"><h2 className="admin-page-title">Orders</h2></div>
      <select className="admin-search" value={status} onChange={(e) => setStatus(e.target.value)}>
        {statuses.map((s) => <option key={s} value={s}>{s || 'All statuses'}</option>)}
      </select>
      <DataTable
        columns={[
          { key: 'id', label: 'Order', render: (o) => `#${o._id.slice(-8).toUpperCase()}` },
          { key: 'customer', label: 'Customer', render: (o) => o.user?.name },
          { key: 'total', label: 'Total', render: (o) => `₹${o.total}` },
          { key: 'payment', label: 'Payment', render: (o) => `${o.paymentMethod.toUpperCase()} · ${o.paymentStatus}` },
          { key: 'status', label: 'Status', render: (o) => o.status },
          { key: 'date', label: 'Date', render: (o) => new Date(o.createdAt).toLocaleDateString() },
        ]}
        rows={data.orders}
        renderActions={(o) => <Link to={`/admin/orders/${o._id}`} className="admin-link">View</Link>}
      />
    </div>
  );
}