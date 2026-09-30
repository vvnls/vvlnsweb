import { useEffect, useState } from 'react';
import { adminListProducts } from '../api/products';
import { adminListCategories } from '../api/categories';
import { adminListUsers } from '../api/users';
import { adminListOrders } from '../api/orders';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      adminListProducts({ limit: 1 }),
      adminListCategories(),
      adminListUsers({ limit: 1 }),
      adminListOrders({ excludeStatus: 'cancelled', limit: 1 }),
    ]).then(([products, categories, users, orders]) =>
      setStats({
        products: products.total,
        categories: categories.categories.length,
        users: users.total,
        orders: orders.total,
      })
    );
  }, []);

  if (!stats) return <p>Loading…</p>;

  return (
    <div>
      <h2 className="admin-page-title">Dashboard</h2>
      <div className="admin-stat-grid">
        <div className="admin-stat-card"><b>{stats.products}</b><span>Products</span></div>
        <div className="admin-stat-card"><b>{stats.categories}</b><span>Categories</span></div>
        <div className="admin-stat-card"><b>{stats.users}</b><span>Users</span></div>
        <div className="admin-stat-card"><b>{stats.orders}</b><span>Orders Received</span></div>
      </div>
    </div>
  );
}