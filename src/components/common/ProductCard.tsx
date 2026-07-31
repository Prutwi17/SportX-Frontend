import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import type { Product } from '../../types';
import { wishlistService } from '../../services/wishlistService';
import { cartService } from '../../services/cartService';
import { useAuth } from '../../context/AuthContext';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      if (inWishlist) {
        await wishlistService.removeItem(product.id);
        setInWishlist(false);
      } else {
        await wishlistService.addItem(product.id);
        setInWishlist(true);
      }
    } catch { /* ignore */ }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    try {
      await cartService.addItem(product.id, 1);
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.35), ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden transition-shadow duration-300 hover:shadow-premium-lg"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          {product.primaryImage ? (
            <img
              src={product.primaryImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🏷️</div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-accent-400 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              -{discount}%
            </span>
          )}

          {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-orange-600 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm border border-orange-200">
              Only {product.stockQuantity} left
            </span>
          )}

          {product.stockQuantity === 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              Out of Stock
            </span>
          )}

          <button
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 active:scale-90 ${
              inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:text-red-500'
            }`}
          >
            <Heart size={17} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity === 0}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur text-white text-xs font-semibold px-3.5 py-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingBag size={13} />
            )}
            {product.stockQuantity === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>

        <div className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-500 mb-1">
            {product.brandName || product.categoryName}
          </p>
          <h3 className="font-display font-semibold text-slate-900 text-[15px] line-clamp-1 group-hover:text-brand-700 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-1.5">
            {product.averageRating > 0 ? (
              <>
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={s <= Math.round(product.averageRating) ? 'text-accent-500 fill-accent-500' : 'text-slate-200 fill-slate-200'}
                    />
                  ))}
                </span>
                <span className="text-xs text-slate-500 ml-1">
                  {product.averageRating.toFixed(1)} ({product.ratingCount})
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Zap size={12} className="text-brand-500" /> New arrival
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            {product.discountedPrice ? (
              <>
                <span className="font-display font-bold text-slate-900 text-lg">
                  ₹{product.discountedPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </>
            ) : (
              <span className="font-display font-bold text-slate-900 text-lg">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${product.stockQuantity > 20 ? 'bg-green-500' : product.stockQuantity > 0 ? 'bg-accent-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (product.stockQuantity / 50) * 100)}%` }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
