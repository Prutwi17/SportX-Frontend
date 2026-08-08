import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  CalendarClock,
  TrendingUp,
  Trophy,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Star,
  Wallet,
} from 'lucide-react';
import { reportsService } from '../../services/reportsService';
import type { ReportsData } from '../../types';
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

export default function Analytics() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    reportsService.getAnalytics()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load analytics. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner />;

  if (error || !data) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <p className="font-display text-xl font-bold text-slate-800">{error || 'No data available'}</p>
          <button onClick={load} className="mt-6 inline-flex items-center gap-2 btn-accent px-6 py-3 rounded-xl font-display font-semibold text-sm uppercase tracking-wide">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const revenueCards = [
    { label: "Today's Revenue", value: inr(data.todayRevenue), sub: `${data.todayOrders} orders`, icon: CalendarClock, color: 'from-slate-700 to-slate-900' },
    { label: 'Monthly Revenue', value: inr(data.monthlyRevenue), sub: `${data.monthlyOrders} orders`, icon: TrendingUp, color: 'from-brand-500 to-brand-700' },
    { label: 'Yearly Revenue', value: inr(data.yearlyRevenue), sub: `${data.yearlyOrders} orders`, icon: IndianRupee, color: 'from-brand-500 to-brand-700' },
    { label: 'Overall Revenue', value: inr(data.totalRevenue), sub: `${data.totalOrders} total orders`, icon: Wallet, color: 'from-dark-900 to-slate-800' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">Business Analytics</h1>
          <p className="text-slate-500 mt-1">Revenue, orders and product performance</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {revenueCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                  <c.icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-400">{c.sub}</span>
              </div>
              <p className="font-display text-xl font-extrabold text-slate-900 truncate">{c.value}</p>
              <p className="text-xs text-slate-500 mt-1">{c.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* KPI chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Average Order Value</p>
          <p className="font-display text-lg font-extrabold text-slate-900 mt-1">{inr(data.averageOrderValue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Best Selling Brand</p>
          <p className="font-display text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-1.5 truncate">
            {data.bestSellingBrand ? <><Trophy size={15} className="text-amber-400 fill-current shrink-0" />{data.bestSellingBrand}</> : 'N/A'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Active Customers</p>
          <p className="font-display text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
            <Users size={15} className="text-cyan-500" />{data.totalCustomers}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Order Status</p>
          <p className="text-sm font-bold text-slate-800 mt-1.5 flex flex-wrap gap-1.5">
            <span className="text-emerald-600">{data.completedOrders} done</span>·
            <span className="text-amber-600">{data.pendingOrders} pending</span>·
            <span className="text-red-600">{data.cancelledOrders} cancelled</span>
          </p>
        </div>
      </div>

      {/* 30-day trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-1">Daily Revenue</h2>
          <p className="text-xs text-slate-500 mb-5">Last 30 days</p>
          <LineChart data={data.revenueByDay} valueFormatter={(v) => inr(v)} labelEvery={5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-1">Daily Orders</h2>
          <p className="text-xs text-slate-500 mb-5">Last 30 days</p>
          <BarChart data={data.orderByDay} labelEvery={5} color="#f97316" />
        </motion.div>
      </div>

      {/* Monthly trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-1">Monthly Revenue</h2>
          <p className="text-xs text-slate-500 mb-5">Last 12 months</p>
          <BarChart data={data.revenueByMonth} valueFormatter={(v) => inr(v)} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-1">Monthly Orders</h2>
          <p className="text-xs text-slate-500 mb-5">Last 12 months</p>
          <LineChart data={data.orderByMonth} color="#0b0b0b" />
        </motion.div>
      </div>

      {/* Categories + top products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-1">Category Distribution</h2>
          <p className="text-xs text-slate-500 mb-5">Products per category</p>
          <DonutChart data={data.categoryDistribution} centerLabel="Products" centerValue={String(data.totalProducts)} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-1">Top Categories</h2>
          <p className="text-xs text-slate-500 mb-5">By sales revenue</p>
          <BarChart data={data.topCategories.map((c) => ({ label: c.name, value: c.value }))} valueFormatter={(v) => inr(v)} color="#f59e0b" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">Top Selling Products</h2>
          <div className="space-y-4">
            {data.topProducts.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No sales yet</p>}
            {data.topProducts.map((p, i) => (
              <div key={p.productId} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">{p.name[0]}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.quantitySold} sold</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-slate-800">
                  <Star size={12} className="text-amber-400 fill-current" />{i + 1}
                </span>
                <span className="text-sm font-bold text-slate-800">{inr(p.revenue)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent sales + low stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-extrabold text-slate-900">Recent Sales</h2>
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th className="hidden sm:table-cell">Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSales.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">No sales yet</td></tr>
                )}
                {data.recentSales.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                    <td className="font-mono text-sm font-medium text-slate-800">{o.orderNumber}</td>
                    <td className="hidden sm:table-cell text-sm text-slate-600">{o.address?.fullName || 'N/A'}</td>
                    <td className="font-display font-bold text-slate-900">{inr(o.total)}</td>
                    <td>
                      <span className={`admin-badge ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="hidden md:table-cell text-sm text-slate-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <AlertTriangle size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">Stock Alerts</h2>
              <p className="text-xs text-slate-500">Products needing attention</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-4 py-3.5 mb-3">
            <span className="text-sm font-semibold text-amber-700">Low Stock</span>
            <span className="text-xl font-extrabold text-amber-700">{data.lowStockProducts}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3.5 mb-4">
            <span className="text-sm font-semibold text-red-700">Out of Stock</span>
            <span className="text-xl font-extrabold text-red-700">{data.outOfStockProducts}</span>
          </div>
          <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
            <Package size={15} /> Manage inventory
          </Link>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
