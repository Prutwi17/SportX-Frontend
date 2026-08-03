import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Truck, Tag } from 'lucide-react';
import { cartService } from '../services/cartService';
import type { Cart as CartType } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductImage from '../components/common/ProductImage';

export default function Cart() {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await cartService.getCart();
      setCart(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingId(itemId);
    try {
      const res = await cartService.updateQuantity(itemId, quantity);
      setCart(res.data);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setRemovingId(itemId);
    setTimeout(async () => {
      try {
        const res = await cartService.removeItem(itemId);
        setCart(res.data);
      } finally {
        setRemovingId(null);
      }
    }, 300);
  };

  const shipping = cart ? (cart.subtotal >= 500 ? 0 : 49) : 0;
  const total = cart ? cart.subtotal + shipping : 0;

  if (loading) return <LoadingSpinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-24"
      >
        <div className="w-24 h-24 mx-auto rounded-[28px] bg-gradient-to-br from-brand-100 to-fuchsia-100 flex items-center justify-center mb-6">
          <ShoppingCart size={44} className="text-brand-600" />
        </div>
        <h2 className="font-display text-3xl font-extrabold text-slate-900 mb-3">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything yet</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/products"
            className="btn-gradient inline-block px-8 py-3.5 rounded-2xl font-display font-bold"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
          Shopping <span className="text-gradient">Cart</span>
        </h1>
        <p className="text-slate-500">{cart.items.length} item{cart.items.length > 1 ? 's' : ''} in your bag</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: removingId === item.id ? 0 : 1, x: removingId === item.id ? 50 : 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 sm:gap-5 bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-premium p-4 sm:p-5 transition-all"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shrink-0">
                  <ProductImage src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-slate-900 truncate">{item.productName}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">₹{item.price.toLocaleString('en-IN')} each</p>
                  <p className="font-display font-extrabold text-lg sm:text-xl text-gradient mt-1.5">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingId === item.id}
                        className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </motion.button>
                      <span className="w-10 h-9 flex items-center justify-center font-display font-bold text-slate-900 border-x-2 border-slate-200 text-sm">
                        {updatingId === item.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveItem(item.id)}
                      className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-semibold ml-auto transition-colors"
                    >
                      <Trash2 size={15} />
                      Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 sm:p-7 h-fit sticky top-24"
        >
          <h3 className="font-display text-xl font-extrabold text-slate-900 mb-6">Order Summary</h3>

          {shipping > 0 && (
            <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 rounded-2xl px-4 py-3 text-xs font-semibold mb-5">
              <Tag size={14} className="shrink-0" />
              Add ₹{(500 - cart.subtotal).toLocaleString('en-IN')} more for FREE shipping
            </div>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Items ({cart.totalItems})</span>
              <span className="font-semibold text-slate-800">₹{cart.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  <span className="text-slate-800">₹{shipping.toLocaleString('en-IN')}</span>
                )}
              </span>
            </div>
          </div>

          <hr className="my-5 border-slate-100" />

          <div className="flex justify-between items-center mb-6">
            <span className="font-display font-bold text-slate-900">Total</span>
            <span className="font-display text-2xl font-extrabold text-gradient">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/checkout')}
            className="btn-gradient w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-bold"
          >
            Proceed to Checkout
            <ArrowRight size={17} />
          </motion.button>
          <Link
            to="/products"
            className="block text-center text-slate-500 hover:text-brand-600 text-sm font-semibold mt-4 transition-colors"
          >
            Continue Shopping
          </Link>

          <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-100 text-xs text-slate-400">
            <Truck size={15} className="text-brand-500" />
            Free delivery on all orders above ₹500
          </div>
        </motion.div>
      </div>
    </div>
  );
}
