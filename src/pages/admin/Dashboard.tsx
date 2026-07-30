import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardData } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/products', label: 'Products', icon: '🏷️' },
  { to: '/admin/categories', label: 'Categories', icon: '📂' },
  { to: '/admin/brands', label: 'Brands', icon: '🏢' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🎫' },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    dashboardService.getStats().then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md shrink-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <p className="text-3xl font-bold">{data?.totalUsers}</p>
          </div>
          <Link to="/admin/products" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm">Total Products</h3>
            <p className="text-3xl font-bold">{data?.totalProducts}</p>
          </Link>
          <Link to="/admin/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm">Total Orders</h3>
            <p className="text-3xl font-bold">{data?.totalOrders}</p>
          </Link>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Revenue</h3>
            <p className="text-3xl font-bold">₹{data?.totalRevenue.toFixed(2)}</p>
          </div>
          <Link to="/admin/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-500">{data?.pendingOrders}</p>
          </Link>
          <Link to="/admin/products" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
            <p className="text-3xl font-bold text-red-500">{data?.lowStockProducts}</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Order #</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{order.orderNumber}</td>
                    <td className="py-2 px-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-sm">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">₹{order.total.toFixed(2)}</td>
                    <td className="py-2 px-4 text-sm text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
