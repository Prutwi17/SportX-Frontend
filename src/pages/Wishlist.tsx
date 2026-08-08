import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';
import { useWishlist } from '../context/WishlistContext';
import type { WishlistItem, Product } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/common/ProductCard';

function toProduct(item: WishlistItem): Product {
  return {
    id: item.productId,
    name: item.productName,
    description: '',
    price: item.price,
    discountedPrice: item.discountedPrice,
    stockQuantity: item.stockQuantity,
    categoryId: 0,
    categoryName: '',
    brandId: 0,
    brandName: '',
    active: true,
    averageRating: 0,
    ratingCount: 0,
    imageUrls: [],
    primaryImage: item.productImage,
  };
}

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { ids, refresh } = useWishlist();

  const fetchWishlist = async () => {
    try {
      const res = await wishlistService.getWishlist();
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    refresh();
  }, [refresh]);

  const visible = items.filter((item) => ids.has(item.productId));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
          <Heart size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">My Wishlist</h1>
          <p className="text-slate-500 dark:text-slate-400">{visible.length} saved item{visible.length !== 1 ? 's' : ''}</p>
        </div>
      </motion.div>

      {visible.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="w-24 h-24 mx-auto rounded-[28px] bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6">
            <Heart size={44} className="text-brand-500" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white mb-3">Your wishlist is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Save products you love and find them here later</p>
          <Link to="/products" className="btn-accent inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wide">
            Browse Products
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {visible.map((item, i) => (
            <div key={item.id} className="h-full">
              <ProductCard product={toProduct(item)} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
