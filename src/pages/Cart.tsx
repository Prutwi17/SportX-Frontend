import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cartService } from '../services/cartService';
import type { Cart as CartType } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
        className="text-center py-20"
      >
        <p className="text-7xl mb-6">🛒</p>
        <h2 className="text-3xl font-bold mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Shopping Cart
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                className="flex gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 card-hover"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-2xl">🏷️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{item.productName}</h3>
                  <p className="text-indigo-600 font-bold text-xl mt-1">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingId === item.id}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors font-medium text-lg disabled:opacity-50"
                      >
                        −
                      </motion.button>
                      <span className="px-4 py-2 font-medium border-x border-gray-200 min-w-[40px] text-center">
                        {updatingId === item.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors font-medium text-lg disabled:opacity-50"
                      >
                        +
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium ml-2 transition-colors"
                    >
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
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24"
        >
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({cart.totalItems})</span>
              <span className="font-medium">₹{cart.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  <span>₹{shipping.toLocaleString('en-IN')}</span>
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400">Free shipping on orders above ₹500</p>
            )}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-xl mb-6">
            <span>Total</span>
            <span className="text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/checkout')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Proceed to Checkout
          </motion.button>
          <Link
            to="/products"
            className="block text-center text-gray-500 hover:text-indigo-600 text-sm mt-4 transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
