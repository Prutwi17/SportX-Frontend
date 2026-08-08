import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Package, XCircle, BadgePercent } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductImage from '../components/common/ProductImage';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
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
    try {
      await orderService.cancelOrder(order!.id);
      fetchOrder();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <p className="text-center py-8">Order not found.</p>;

  const statusColors: Record<string, { bg: string; dot: string }> = {
    PENDING: { bg: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
    CONFIRMED: { bg: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
    PACKED: { bg: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500' },
    SHIPPED: { bg: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500' },
    OUT_FOR_DELIVERY: { bg: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
    DELIVERED: { bg: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
    CANCELLED: { bg: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => navigate('/orders')} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-900 rounded-3xl p-7 md:p-9 relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-600/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-accent-500/15 rounded-full blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Order</p>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">#{order.orderNumber}</h1>
            <p className="text-slate-400 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${statusColors[order.status]?.bg || 'bg-gray-100 text-gray-700'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusColors[order.status]?.dot || 'bg-gray-400'}`} />
              {order.status.replace(/_/g, ' ')}
            </span>
            {order.paymentMethod && (
              <span className="text-sm font-semibold text-white/70 bg-white/10 border border-white/15 px-4 py-2 rounded-full">
                {order.paymentMethod.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Address */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <MapPin size={17} className="text-white" />
            </div>
            <h2 className="font-display text-lg font-extrabold text-slate-900">Shipping Address</h2>
          </div>
          <p className="font-semibold text-slate-900">{order.address.fullName}</p>
          <p className="text-slate-600 text-sm mt-0.5">{order.address.addressLine1}</p>
          {order.address.addressLine2 && <p className="text-slate-600 text-sm">{order.address.addressLine2}</p>}
          <p className="text-slate-600 text-sm">{order.address.city}, {order.address.state} {order.address.zipCode}</p>
          <p className="text-slate-600 text-sm">{order.address.country}</p>
          <p className="text-slate-600 text-sm">{order.address.phone}</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <BadgePercent size={17} className="text-white" />
            </div>
            <h2 className="font-display text-lg font-extrabold text-slate-900">Payment Summary</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-semibold text-slate-800">₹{order.subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="font-semibold text-slate-800">₹{order.shippingCost.toLocaleString('en-IN')}</span></div>
            {order.tax > 0 && <div className="flex justify-between"><span className="text-slate-500">Tax</span><span className="font-semibold text-slate-800">₹{order.tax.toLocaleString('en-IN')}</span></div>}
            {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{order.discount.toLocaleString('en-IN')}</span></div>}
            {order.couponCode && <div className="flex justify-between"><span className="text-slate-500">Coupon</span><span className="font-semibold text-brand-600">{order.couponCode}</span></div>}
            <hr className="border-slate-100 my-3" />
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-slate-900">Total</span>
              <span className="font-display text-2xl font-extrabold text-gradient">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
            <Package size={17} className="text-white" />
          </div>
          <h2 className="font-display text-lg font-extrabold text-slate-900">Items</h2>
          <span className="bg-slate-100 text-slate-600 text-sm font-bold px-3 py-1 rounded-full">{order.items.length}</span>
        </div>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                <ProductImage src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-slate-900 truncate">{item.productName}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-display font-extrabold text-slate-900 shrink-0">₹{item.subtotal.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-display font-semibold text-sm transition-colors shadow-lg shadow-red-500/25"
        >
          <XCircle size={16} />
          Cancel Order
        </button>
      )}
    </div>
  );
}
