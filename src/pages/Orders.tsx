import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ArrowRight, Calendar, Tag, CheckCircle2, Clock, XCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Order, PagedResponse } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductImage from '../components/common/ProductImage';

export default function Orders() {
  const [orders, setOrders] = useState<PagedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    orderService.getUserOrders(page).then((res) => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  if (loading) return <LoadingSpinner />;

  const statusBadges: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    PENDING: { bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800', text: 'Pending', icon: Clock },
    CONFIRMED: { bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', text: 'Success', icon: CheckCircle2 },
    PACKED: { bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800', text: 'Packed', icon: Package },
    SHIPPED: { bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', text: 'Shipped', icon: Package },
    OUT_FOR_DELIVERY: { bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800', text: 'Out for Delivery', icon: Package },
    DELIVERED: { bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', text: 'Completed', icon: CheckCircle2 },
    CANCELLED: { bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800', text: 'Cancelled', icon: XCircle },
    FAILED: { bg: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800', text: 'Failed', icon: AlertCircle },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
          <Package size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Order History</h1>
          <p className="text-slate-500 dark:text-slate-400">View and track all your purchases</p>
        </div>
      </motion.div>

      {!orders || orders.content.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
          <div className="w-24 h-24 mx-auto rounded-[28px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <ShoppingBag size={44} className="text-slate-400" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-3">No orders yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">When you place an order, it will appear here.</p>
          <Link to="/products" className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-display font-bold">
            Start Shopping
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="space-y-6">
            {orders.content.map((order, i) => {
              const badge = statusBadges[order.status] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: order.status, icon: Clock };
              const StatusIcon = badge.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-premium overflow-hidden transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Order ID</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">#{order.orderNumber}</span>
                      </div>
                      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Date Placed</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      {order.paymentMethod && (
                        <>
                          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                          <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Payment Method</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {order.paymentMethod === 'RAZORPAY' ? 'Razorpay' : 'Cash on Delivery'}
                            </span>
                          </div>
                          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                          <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Payment Status</span>
                            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                              (order.paymentStatus || (order.paymentMethod === 'COD' ? 'PENDING' : 'PAID')) === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}>
                              {order.paymentStatus || (order.paymentMethod === 'COD' ? 'Pending' : 'Paid')}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                        <StatusIcon size={14} />
                        {badge.text}
                      </span>
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
                      >
                        Details <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>

                  {/* Card Body - Products List */}
                  <div className="p-6 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0">
                          <ProductImage src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {item.categoryName && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-500 mb-0.5">
                              <Tag size={10} /> {item.categoryName}
                            </span>
                          )}
                          <h4 className="font-display font-bold text-slate-900 dark:text-white text-base truncate">
                            {item.productName}
                          </h4>
                          {item.productDescription && (
                            <p className="text-xs text-slate-400 truncate mt-0.5 max-w-md hidden sm:block">
                              {item.productDescription}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Qty: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.quantity}</span> × ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-display font-extrabold text-slate-900 dark:text-white text-base">
                            ₹{item.subtotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-slate-50/40 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grand Total</span>
                    <span className="font-display text-xl font-extrabold text-gradient">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {orders.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: orders.totalPages }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-xl font-display font-semibold transition-all ${
                    i === page ? 'btn-gradient shadow-lg' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
