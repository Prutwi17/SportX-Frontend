import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ExternalLink, ChevronDown, PackageSearch, Trash2 } from 'lucide-react';
import { orderService } from '../../services/orderService';
import type { PagedResponse, Order } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/admin/AdminLayout';
import Toast from '../../components/admin/Toast';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const STATUSES = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-brand-100 text-brand-700',
  SHIPPED: 'bg-brand-100 text-brand-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState<PagedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToast(msg);
    window.setTimeout(() => setToast(''), 2600);
  };

  const fetchOrders = () => {
    setLoading(true);
    orderService.getAllOrders(page, 15).then((res) => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const handleStatusUpdate = async (orderId: number, status: string) => {
    const previous = orders?.content.find((o) => o.id === orderId)?.status;
    try {
      await orderService.updateStatus(orderId, status);
      fetchOrders();
      showToast(status === 'CANCELLED' ? 'Order cancelled' : `Status updated to ${status.replace(/_/g, ' ').toLowerCase()}`);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update order status';
      showToast(msg, 'error');
      if (previous) {
        setOrders((prev) => (prev ? { ...prev, content: prev.content.map((o) => (o.id === orderId ? { ...o, status: previous } : o)) } : prev));
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await orderService.deleteOrder(deleteTarget.id);
      setDeleteTarget(null);
      showToast('Order permanently deleted');
      fetchOrders();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete order';
      setDeleteTarget(null);
      showToast(msg, 'error');
    } finally {
      setDeleteBusy(false);
    }
  };

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <Toast message={toast} type={toastType} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Permanently Delete Order"
        message={`Are you sure you want to permanently delete Order #${deleteTarget?.orderNumber}? This will remove all associated payment and item records from the database.`}
        confirmLabel="Permanently Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteBusy}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Manage Orders</h1>
            <p className="text-slate-500 text-sm">Track, update, and delete customer orders</p>
          </div>
        </div>
        {orders && (
          <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl">
            <PackageSearch size={14} className="text-slate-500" />
            {orders.totalElements} orders total
          </span>
        )}
      </div>

      <div className="admin-card overflow-x-auto lg:overflow-visible">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th className="hidden sm:table-cell">Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Payment</th>
              <th className="hidden lg:table-cell">Date</th>
              <th className="admin-th-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.content.length === 0 && (
              <tr>
                <td colSpan={7} className="py-14 text-center">
                  <p className="text-sm font-medium text-slate-400">No orders found</p>
                  <p className="text-xs text-slate-400/80 mt-1">Orders will appear here once customers start shopping</p>
                </td>
              </tr>
            )}
            {orders?.content.map((order) => (
              <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                <td>
                  <Link to={`/orders/${order.id}`} className="font-mono text-sm font-semibold text-brand-600 hover:underline whitespace-nowrap">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="hidden sm:table-cell">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate max-w-[200px]">{order.address?.fullName || 'N/A'}</p>
                    {order.address?.phone && <p className="text-xs text-slate-400 truncate max-w-[200px]">{order.address.phone}</p>}
                  </div>
                </td>
                <td className="font-display font-bold text-slate-900 whitespace-nowrap">₹{order.total.toLocaleString('en-IN')}</td>
                <td>
                  <div className="relative inline-flex">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`appearance-none cursor-pointer border-0 outline-none rounded-full pl-3.5 pr-8 py-1.5 text-xs font-bold transition-shadow focus:ring-2 focus:ring-brand-500/40 ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current" />
                  </div>
                </td>
                <td className="hidden md:table-cell text-sm text-slate-500 capitalize">{order.paymentMethod?.replace(/_/g, ' ').toLowerCase() || '—'}</td>
                <td className="hidden lg:table-cell text-sm text-slate-500 whitespace-nowrap">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                </td>
                <td className="admin-td-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link to={`/orders/${order.id}`} className="admin-action text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/10">
                      <ExternalLink size={13} /> View
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(order)}
                      className="admin-action text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Permanently Delete Order"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders && (
          <Pagination
            page={page}
            totalPages={orders.totalPages}
            onPage={setPage}
            totalElements={orders.totalElements}
            pageSize={15}
          />
        )}
      </div>
    </AdminLayout>
  );
}
