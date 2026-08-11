import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../types';
import { cartService } from '../../services/cartService';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductImage from './ProductImage';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const inWishlist = isWishlisted(product.id);

  const discount = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    void toggle(product.id);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    try {
      await cartService.addItem(product.id, 1);
    } finally {
      setAdding(false);
    }
  };

  const soldOut = product.stockQuantity === 0;
  const showRating = (product.averageRating ?? 0) > 0 && (product.ratingCount ?? 0) > 0;
  const ratingVal = product.averageRating ?? 0;
  const reviewCount = product.ratingCount ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25), ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="group relative h-full flex flex-col bg-white dark:bg-dark-800 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer p-3 sm:p-4"
    >
      {/* Top Badges & Wishlist */}
      <div className="relative aspect-square bg-slate-50 dark:bg-dark-900 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2">
        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-[#ff3b30] text-white font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md shadow-sm">
            -{discount}%
          </span>
        )}

        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            inWishlist
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/90 dark:bg-dark-800/90 text-slate-600 dark:text-slate-300 hover:text-red-500 shadow-sm border border-slate-200/60 dark:border-white/10'
          }`}
        >
          <Heart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        <ProductImage
          src={product.primaryImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {soldOut && (
          <div className="absolute inset-0 bg-white/70 dark:bg-dark-900/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-dark-900 text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1">
        {/* Rating Stars & Count */}
        {showRating && (
          <div className="flex items-center gap-1 mb-1">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={star <= Math.round(ratingVal) ? 'fill-current' : 'fill-slate-200 dark:fill-slate-600 text-slate-200 dark:text-slate-600'}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-0.5">
              {ratingVal.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ({reviewCount > 999 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
            </span>
          </div>
        )}

        {/* Brand */}
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 capitalize mb-0.5">
          {product.brandName || product.categoryName || 'SportX'}
        </p>

        {/* Name */}
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-1 group-hover:text-[#ff6a00] transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2 mb-3">
          <span className="font-display font-extrabold text-slate-900 dark:text-white text-base">
            ₹{(product.discountedPrice || product.price).toLocaleString('en-IN')}
          </span>
          {product.discountedPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={adding || soldOut}
          className="mt-auto w-full bg-[#ff6a00] hover:bg-[#ea580c] active:scale-[0.98] text-white font-display font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? (
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShoppingBag size={14} />
          )}
          {soldOut ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
