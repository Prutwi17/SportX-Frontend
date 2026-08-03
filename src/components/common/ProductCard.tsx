import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    if (!isAuthenticated) { navigate('/login'); return; }
    void toggle(product.id);
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
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative h-full flex flex-col bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden transition-shadow duration-300 hover:shadow-premium"
    >
      <Link to={`/products/${product.id}`} className="block h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <ProductImage
            src={product.primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-accent-500 to-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              -{discount}%
            </span>
          )}

          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/70 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-dark-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            </div>
          )}

          <button
            onClick={handleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur transition-all duration-300 hover:scale-110 active:scale-90 ${
              inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:text-red-500 dark:bg-slate-800/90'
            }`}
          >
            <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity === 0}
            className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 bg-slate-900/85 backdrop-blur text-white text-[11px] font-semibold px-2 py-1.5 rounded-lg opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingBag size={12} />
            )}
            {product.stockQuantity === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>

        <div className="p-2.5 sm:p-3 flex flex-col flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-brand-500 truncate">
            {product.brandName || product.categoryName}
          </p>
          <h3 className="font-display font-semibold text-slate-900 text-[13px] leading-snug line-clamp-1 mt-0.5 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-1.5">
            {product.averageRating > 0 ? (
              <>
                <Star size={11} className="text-accent-500 fill-accent-500" />
                <span className="text-[11px] font-semibold text-slate-700">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400">({product.ratingCount})</span>
              </>
            ) : (
              <span className="text-[10px] text-slate-400">New arrival</span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 mt-auto pt-1.5">
            {product.discountedPrice ? (
              <>
                <span className="font-display font-bold text-slate-900 text-[15px]">
                  ₹{product.discountedPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </>
            ) : (
              <span className="font-display font-bold text-slate-900 text-[15px]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
