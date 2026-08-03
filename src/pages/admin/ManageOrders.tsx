import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { orderService } from '../../services/orderService';
import type { PagedResponse, Order } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUSES = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState<PagedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchOrders = () => {
    setLoading(true);
    orderService.getAllOrders(page, 15).then((res) => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await orderService.updateStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update order status';
      alert(msg);
      fetchOrders();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-500 to-orange-400 flex items-center justify-center shadow-lg shadow-accent-500/20">
          <ShoppingCart size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">Manage Orders</h1>
          <p className="text-slate-500 text-sm">Track and update order statuses</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Order #</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Customer</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Total</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Status</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Date</th>
              <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wide text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.content.map((order) => (
              <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5">
                  <Link to={`/orders/${order.id}`} className="font-mono text-sm font-semibold text-brand-600 hover:underline">{order.orderNumber}</Link>
                </td>
                <td className="py-3.5 px-5 font-medium text-slate-800">{order.address?.fullName || 'N/A'}</td>
                <td className="py-3.5 px-5 font-display font-bold text-slate-900">₹{order.total.toLocaleString('en-IN')}</td>
                <td className="py-3.5 px-5">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className={`border-0 outline-none rounded-full px-3 py-1.5 text-xs font-bold cursor-pointer ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </td>
                <td className="py-3.5 px-5 text-sm text-slate-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</td>
                <td className="py-3.5 px-5">
                  <Link to={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-semibold transition-colors">
                    <ExternalLink size={13} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders && orders.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-5">
            {Array.from({ length: orders.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-xl font-display font-semibold text-sm transition-all ${i === page ? 'btn-gradient shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
