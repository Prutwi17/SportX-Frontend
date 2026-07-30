import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import type { PagedResponse, Order } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUSES = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export default function ManageOrders() {
  const [orders, setOrders] = useState<PagedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchOrders = () => {
    setLoading(true);
    orderService.getAllOrders(page, 15).then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const handleStatusUpdate = async (orderId: number, status: string) => {
    await orderService.updateStatus(orderId, status);
    fetchOrders();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr><th className="py-3 px-4">Order #</th><th className="py-3 px-4">Customer</th><th className="py-3 px-4">Total</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Date</th><th className="py-3 px-4">Actions</th></tr>
          </thead>
          <tbody>
            {orders?.content.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4"><Link to={`/orders/${order.id}`} className="text-indigo-600 hover:underline">{order.orderNumber}</Link></td>
                <td className="py-3 px-4">{order.address?.fullName || 'N/A'}</td>
                <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </td>
                <td className="py-3 px-4 text-sm">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</td>
                <td className="py-3 px-4">
                  <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:underline text-sm">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders && orders.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {Array.from({ length: orders.totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`px-3 py-1 rounded ${i === page ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
