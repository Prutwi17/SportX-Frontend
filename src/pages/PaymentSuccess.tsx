import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Calendar, ArrowRight, Truck, Clock, Hash, Home, MapPin, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductImage from '../components/common/ProductImage';

export default function PaymentSuccess() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = id || searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    orderService.getById(Number(orderId))
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <LoadingSpinner />;

  const isCOD = order?.paymentMethod === 'COD';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden relative"
      >
        <div className={`h-1.5 w-full ${isCOD ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`} />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
              className={`w-14 h-14 shrink-0 rounded-2xl ${
                isCOD
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-400 shadow-emerald-500/30'
              } flex items-center justify-center shadow-lg`}
            >
              <CheckCircle2 size={30} className="text-white" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Order Confirmed
                </h1>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${
                    isCOD
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800'
                      : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {isCOD ? <Truck size={12} /> : <CheckCircle2 size={12} />}
                  {isCOD ? 'Cash on Delivery' : 'Payment Completed'}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                {isCOD
                  ? 'Your order has been placed successfully.'
                  : 'Thank you for your purchase. Your order is being processed.'}
              </p>
            </div>
          </div>

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-5 space-y-3"
            >
              {/* Key details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-2.5 text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Package size={14} className="text-brand-500" /> Order ID
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white truncate">#{order.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-2.5 text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar size={14} className="text-purple-500" /> Date
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-2.5 text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Hash size={14} className="text-indigo-500" /> {isCOD ? 'Amount to Pay' : 'Amount Paid'}
                  </span>
                  <span className="font-display font-extrabold text-slate-900 dark:text-white">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-2.5 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Payment Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isCOD
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {isCOD ? 'Pending' : 'Paid'}
                  </span>
                </div>
              </div>

              {order.transactionId && !isCOD && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Hash size={12} className="text-indigo-400" />
                  Transaction ID: <span className="font-mono text-slate-600 dark:text-slate-300 truncate">{order.transactionId}</span>
                </p>
              )}

              {/* Items summary */}
              {order.items?.length > 0 && (
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Items ({order.items.length})
                  </div>
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 px-3.5 py-2.5">
                        <div className="w-11 h-11 shrink-0 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                          <ProductImage src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.productName}</p>
                          <p className="text-xs text-slate-400">Qty {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Address */}
              {order.address && (
                <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-3 text-sm">
                  <MapPin size={15} className="text-brand-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white">{order.address.fullName}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {order.address.addressLine1}
                      {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ''}, {order.address.city}, {order.address.state} {order.address.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {isCOD && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs">
                  <Clock size={14} className="shrink-0 mt-0.5" />
                  <p>
                    Please pay the delivery executive when your order arrives. Estimated delivery: <b>2–5 business days</b>.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => order && navigate(`/orders/${order.id}`)}
              className="btn-accent flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wide"
            >
              <Package size={16} />
              Track Order
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/products')}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wide transition-colors"
            >
              <ShoppingBag size={16} />
              Continue Shopping
              <ArrowRight size={14} />
            </motion.button>
          </div>

          <Link to="/" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            <Home size={13} />
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
