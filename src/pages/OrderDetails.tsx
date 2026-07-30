import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await orderService.getById(Number(id));
      setOrder(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    await orderService.cancelOrder(order!.id);
    fetchOrder();
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <p className="text-center py-8">Order not found.</p>;

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PACKED: 'bg-indigo-100 text-indigo-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/orders')} className="text-indigo-600 hover:underline mb-4 inline-block">
        &larr; Back to Orders
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <p>{order.address.fullName}</p>
          <p>{order.address.addressLine1}</p>
          {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
          <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
          <p>{order.address.country}</p>
          <p>{order.address.phone}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${order.shippingCost.toFixed(2)}</span></div>
            {order.tax && <div className="flex justify-between"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>}
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
            {order.couponCode && <div className="flex justify-between"><span>Coupon</span><span>{order.couponCode}</span></div>}
            <hr />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded" />
                ) : (
                  <span className="text-gray-400 text-xs">Img</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-indigo-600 font-bold">${item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
        <button onClick={handleCancel} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
          Cancel Order
        </button>
      )}
    </div>
  );
}
