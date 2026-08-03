import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ArrowRight } from 'lucide-react';
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

  const statusColors: Record<string, { bg: string; dot: string }> = {
    PENDING: { bg: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
    CONFIRMED: { bg: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
    PACKED: { bg: 'bg-indigo-100 text-indigo-800', dot: 'bg-indigo-500' },
    SHIPPED: { bg: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
    OUT_FOR_DELIVERY: { bg: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
    DELIVERED: { bg: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
    CANCELLED: { bg: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
          <Package size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900">My Orders</h1>
          <p className="text-slate-500">Track and manage your purchases</p>
        </div>
      </motion.div>

      {!orders || orders.content.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="w-24 h-24 mx-auto rounded-[28px] bg-slate-100 flex items-center justify-center mb-6">
            <Package size={44} className="text-slate-400" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-3">No orders yet</h2>
          <p className="text-slate-500 mb-8">When you place an order, it will show up here</p>
          <Link to="/products" className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-display font-bold">
            Start Shopping
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.content.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/orders/${order.id}`}
                  className="group block bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium p-6 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono text-slate-500">#{order.orderNumber}</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]?.bg || 'bg-gray-100 text-gray-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColors[order.status]?.dot || 'bg-gray-400'}`} />
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl font-extrabold text-gradient">₹{order.total.toLocaleString('en-IN')}</span>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="w-11 h-11 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                        {item.productImage ? (
                          <ProductImage src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">🏷️</div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
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
                    i === page ? 'btn-gradient shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
