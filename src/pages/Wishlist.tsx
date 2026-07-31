import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';
import { cartService } from '../services/cartService';
import type { WishlistItem } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistService.getWishlist();
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId: number) => {
    await wishlistService.removeItem(productId);
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleAddToCart = async (productId: number) => {
    await cartService.addItem(productId, 1);
    alert('Added to cart!');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/25">
          <Heart size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900">My Wishlist</h1>
          <p className="text-slate-500">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="w-24 h-24 mx-auto rounded-[28px] bg-red-50 flex items-center justify-center mb-6">
            <Heart size={44} className="text-red-300" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-3">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8">Save products you love and find them here later</p>
          <Link to="/products" className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-display font-bold">
            Browse Products
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-premium overflow-hidden transition-all duration-300"
            >
              <Link to={`/products/${item.productId}`} className="block relative">
                <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-slate-300 text-3xl">🏷️</span>
                  )}
                </div>
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
                  <Heart size={14} className="text-red-500 fill-red-500" />
                </div>
              </Link>
              <div className="p-5">
                <Link to={`/products/${item.productId}`}>
                  <h3 className="font-display font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">{item.productName}</h3>
                </Link>
                <div className="mt-2 mb-4">
                  {item.discountedPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-xl text-gradient">₹{item.discountedPrice}</span>
                      <span className="text-sm text-slate-400 line-through">₹{item.price}</span>
                    </div>
                  ) : (
                    <span className="font-display font-extrabold text-xl text-slate-900">₹{item.price}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    className="btn-gradient flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-display font-bold py-2.5 rounded-xl"
                  >
                    <ShoppingCart size={15} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="w-11 h-10 rounded-xl border-2 border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
