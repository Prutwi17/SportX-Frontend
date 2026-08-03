import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingCart, IndianRupee, Clock, AlertTriangle, ArrowUpRight, ChevronRight, RefreshCw } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardData } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = () => {
    dashboardService.getStats()
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setError('Failed to load dashboard data. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError('');
    loadStats();
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <p className="font-display text-xl font-bold text-slate-800">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-6 inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-2xl font-display font-semibold text-sm"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PACKED: 'bg-indigo-100 text-indigo-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const stats = [
    { label: 'Total Users', value: data?.totalUsers ?? 0, icon: Users, color: 'from-brand-500 to-purple-500', to: '/admin/dashboard' },
    { label: 'Total Products', value: data?.totalProducts ?? 0, icon: Package, color: 'from-accent-500 to-orange-400', to: '/admin/products' },
    { label: 'Total Orders', value: data?.totalOrders ?? 0, icon: ShoppingCart, color: 'from-emerald-500 to-teal-400', to: '/admin/orders' },
    { label: 'Revenue', value: `₹${(data?.totalRevenue ?? 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-fuchsia-500 to-pink-500', to: '/admin/dashboard' },
    { label: 'Pending Orders', value: data?.pendingOrders ?? 0, icon: Clock, color: 'from-amber-500 to-yellow-400', to: '/admin/orders' },
    { label: 'Low Stock Items', value: data?.lowStockProducts ?? 0, icon: AlertTriangle, color: 'from-red-500 to-rose-400', to: '/admin/products' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your store performance</p>
        </div>
        <Link
          to="/admin/products"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Manage Products
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={s.to}
              className="block bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium p-5 transition-all hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                <s.icon size={18} className="text-white" />
              </div>
              <p className="font-display text-2xl font-extrabold text-slate-900 truncate">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900">Recent Orders</h2>
          <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all
            <ChevronRight size={15} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wide text-slate-400">Order #</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wide text-slate-400">Status</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wide text-slate-400">Total</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wide text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-sm font-medium text-slate-800">{order.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-display font-bold text-slate-900">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-sm text-slate-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
