import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  CalendarClock,
  TrendingUp,
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Package,
  AlertTriangle,
  PackageX,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  Star,
  Plus,
  UserPlus,
  BarChart3,
  LayoutDashboard,
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardData } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';
import LineChart from '../../components/admin/LineChart';
import BarChart from '../../components/admin/BarChart';
import DonutChart from '../../components/admin/DonutChart';

const inr = (v: number) => `₹${(v || 0).toLocaleString('en-IN')}`;

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-brand-100 text-brand-700',
  SHIPPED: 'bg-brand-100 text-brand-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = () => {
    setLoading(true);
    setError('');
    dashboardService.getStats()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard data. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStats(); }, []);

  if (loading) return <LoadingSpinner />;

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <p className="font-display text-xl font-bold text-slate-800">{error || 'No data available'}</p>
          <button
            onClick={loadStats}
            className="mt-6 inline-flex items-center gap-2 btn-accent px-6 py-3 rounded-xl font-display font-semibold text-sm uppercase tracking-wide"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const cards = [
    { label: 'Total Revenue', value: inr(data.totalRevenue), icon: IndianRupee, color: 'from-brand-500 to-brand-700', to: '/admin/analytics' },
    { label: "Today's Revenue", value: inr(data.todayRevenue), icon: CalendarClock, color: 'from-slate-700 to-slate-900', to: '/admin/analytics' },
    { label: 'Monthly Revenue', value: inr(data.monthlyRevenue), icon: TrendingUp, color: 'from-brand-500 to-brand-700', to: '/admin/analytics' },
    { label: 'Yearly Revenue', value: inr(data.yearlyRevenue), icon: IndianRupee, color: 'from-dark-900 to-slate-800', to: '/admin/analytics' },
    { label: 'Total Orders', value: String(data.totalOrders), icon: ShoppingCart, color: 'from-slate-800 to-slate-900', to: '/admin/orders' },
    { label: 'Completed', value: String(data.completedOrders), icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600', to: '/admin/orders' },
    { label: 'Pending', value: String(data.pendingOrders), icon: Clock, color: 'from-amber-500 to-amber-600', to: '/admin/orders' },
    { label: 'Cancelled', value: String(data.cancelledOrders), icon: XCircle, color: 'from-red-500 to-red-600', to: '/admin/orders' },
    { label: 'Customers', value: String(data.totalCustomers), icon: Users, color: 'from-brand-500 to-brand-700', to: '/admin/users' },
    { label: 'Products', value: String(data.totalProducts), icon: Package, color: 'from-slate-700 to-slate-900', to: '/admin/products' },
    { label: 'Low Stock', value: String(data.lowStockProducts), icon: AlertTriangle, color: 'from-amber-500 to-amber-700', to: '/admin/products' },
    { label: 'Out of Stock', value: String(data.outOfStockProducts), icon: PackageX, color: 'from-slate-600 to-slate-800', to: '/admin/products' },
  ];

  const quickActions = [
    { label: 'Add Product', to: '/admin/products', icon: Plus, color: 'text-white/80' },
    { label: 'Add User', to: '/admin/users', icon: UserPlus, color: 'text-white/80' },
    { label: 'View Analytics', to: '/admin/analytics', icon: BarChart3, color: 'text-white/80' },
    { label: 'Manage Orders', to: '/admin/orders', icon: ShoppingCart, color: 'text-white/80' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Store performance overview</p>
          </div>
        </div>
        <button
          onClick={loadStats}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to={s.to}
              className="block bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-premium p-5 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                  <s.icon size={18} className="text-white" />
                </div>
                <ArrowUpRight size={15} className="text-slate-300" />
              </div>
              <p className="font-display text-xl font-extrabold text-slate-900 truncate">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-soft p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">Revenue Trend</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last 12 months</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
              {inr(data.yearlyRevenue)} YTD
            </span>
          </div>
          <LineChart data={data.revenueTrend} valueFormatter={(v) => inr(v)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6"
        >
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">Category Distribution</h2>
          <DonutChart data={data.categoryDistribution} centerLabel="Products" centerValue={String(data.totalProducts)} />
        </motion.div>
      </div>

      {/* Order trend + top products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-soft p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">Order Trend</h2>
              <p className="text-xs text-slate-500 mt-0.5">Orders per month · last 12 months</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
              {data.totalOrders} total
            </span>
          </div>
          <BarChart data={data.orderTrend} labelEvery={2} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-extrabold text-slate-900">Top Selling Products</h2>
            <Link to="/admin/analytics" className="text-brand-600 hover:text-brand-700 text-xs font-semibold">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {data.topSellingProducts.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No sales yet</p>
            )}
            {data.topSellingProducts.map((p, i) => (
              <div key={p.productId} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                      {p.name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.quantitySold} sold</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-slate-800">
                  <Star size={12} className="text-amber-400 fill-current" />
                  {i + 1}
                </span>
                <span className="text-sm font-bold text-slate-800">{inr(p.revenue)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent orders + quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-soft p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-extrabold text-slate-900">Recent Orders</h2>
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
              <ChevronRight size={15} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th className="hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-slate-400">No orders yet</td>
                  </tr>
                )}
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                    <td className="font-mono text-sm font-medium text-slate-800">{order.orderNumber}</td>
                    <td>
                      <span className={`admin-badge ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="font-display font-bold text-slate-900">{inr(order.total)}</td>
                    <td className="hidden sm:table-cell text-sm text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-slate-900 rounded-3xl shadow-premium p-6 text-white"
        >
          <h2 className="font-display text-lg font-extrabold mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                >
                  <Icon size={17} className={a.color} />
                  <span className="text-sm font-semibold text-white flex-1">{a.label}</span>
                  <ArrowUpRight size={15} className="text-white/70" />
                </Link>
              );
            })}
          </div>
          <div className="mt-6 pt-5 border-t border-white/15">
            <p className="text-xs text-white/70">Average order value</p>
            <p className="font-display text-2xl font-extrabold mt-1">{inr(data.averageOrderValue)}</p>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
