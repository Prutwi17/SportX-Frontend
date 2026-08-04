import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Package, Calendar, DollarSign, ArrowRight, ShieldCheck, Truck, Clock, Hash, Home } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
    <div className="min-h-[80vh] flex items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-premium p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className={`absolute -top-24 -right-24 w-72 h-72 ${isCOD ? 'bg-blue-500/10' : 'bg-emerald-500/10'} rounded-full blur-3xl`} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className={`w-20 h-20 mx-auto rounded-3xl ${
              isCOD
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30'
                : 'bg-gradient-to-br from-emerald-500 to-teal-400 shadow-emerald-500/30'
            } flex items-center justify-center shadow-xl mb-6`}
          >
            <CheckCircle2 size={42} className="text-white" />
          </motion.div>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 ${
              isCOD
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800'
                : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {isCOD ? <Truck size={14} /> : <ShieldCheck size={14} />}
            {isCOD ? 'Order Placed' : 'Payment Completed'}
          </span>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Order Confirmed
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg mt-2 max-w-md mx-auto">
            {isCOD
              ? 'Your order has been placed successfully.'
              : 'Thank you for your purchase. Your order has been confirmed and is being processed.'}
          </p>

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 max-w-lg mx-auto text-left space-y-3.5"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Package size={15} className="text-brand-500" /> Order ID:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">#{order.orderNumber}</span>
              </div>

              {!isCOD && order.transactionId && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Hash size={15} className="text-indigo-500" /> Transaction ID:
                  </span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300 text-xs">{order.transactionId}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <DollarSign size={15} className={isCOD ? 'text-blue-500' : 'text-emerald-500'} /> {isCOD ? 'Amount to Pay:' : 'Amount Paid:'}
                </span>
                <span className="font-display font-extrabold text-slate-900 dark:text-white text-base">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Payment Method:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {isCOD ? 'Cash on Delivery' : 'Razorpay (Online)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Payment Status:</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                    isCOD
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {isCOD ? 'Pending' : 'Paid'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar size={15} className="text-purple-500" /> Date & Time:
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              {isCOD ? (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    <Clock size={16} className="shrink-0 mt-0.5" />
                    <p>Please pay the delivery executive when your order is delivered.</p>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Estimated Delivery:</span>
                    <span className="font-bold text-slate-900 dark:text-white">2–5 Business Days</span>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="btn-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-display font-bold text-sm shadow-lg shadow-brand-500/25"
            >
              <Home size={17} />
              Return to Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/orders')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-7 py-3.5 rounded-2xl font-display font-bold text-sm transition-colors"
            >
              <Package size={17} />
              View Orders
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-7 py-3.5 rounded-2xl font-display font-bold text-sm transition-colors"
            >
              <ShoppingBag size={17} />
              Continue Shopping
              <ArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
