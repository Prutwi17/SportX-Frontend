import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw, Star, ChevronRight, Zap } from 'lucide-react';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import type { Product, Review } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService.getById(Number(id)).then((res) => {
      setProduct(res.data);
      setLoading(false);
    });
    reviewService.getProductReviews(Number(id)).then((res) => setReviews(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAddingToCart(true);
    try {
      await cartService.addItem(product!.id, quantity);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    await toggle(product!.id);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await reviewService.create(product!.id, reviewForm.rating, reviewForm.comment);
      setReviews((prev) => [...prev, res.data]);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <p className="text-center py-8">Product not found.</p>;

  const inWishlist = isWishlisted(product.id);
  const outOfStock = product.stockQuantity === 0;
  const discountPct = product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-brand-600 transition-colors">Products</Link>
        <ChevronRight size={14} />
        <span className="text-slate-800 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ============ IMAGE ============ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-[32px] overflow-hidden border border-slate-100">
            {product.primaryImage && !imageError ? (
              <motion.img
                src={product.primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Zap size={64} />
              </div>
            )}
            {discountPct > 0 && (
              <span className="absolute top-5 left-5 bg-gradient-to-r from-accent-500 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {discountPct}% OFF
              </span>
            )}
            {outOfStock && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-dark-900 text-white font-display font-bold px-6 py-3 rounded-2xl">Out of Stock</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ============ INFO ============ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:sticky lg:top-24 h-fit"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
              {product.categoryName}
            </span>
            <span className="text-xs font-semibold text-slate-400">{product.brandName}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {product.name}
          </h1>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= Math.round(product.averageRating) ? 'text-accent-500 fill-accent-500' : 'text-slate-200 fill-slate-200'}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700">{product.averageRating.toFixed(1)}</span>
              <span className="text-sm text-slate-400">({product.ratingCount} reviews)</span>
            </div>
          )}

          <div className="flex items-end gap-3 mt-5 pb-6 border-b border-slate-100">
            {product.discountedPrice ? (
              <>
                <span className="font-display text-4xl font-extrabold text-gradient">₹{product.discountedPrice}</span>
                <span className="text-xl text-slate-400 line-through mb-1">₹{product.price}</span>
                <span className="text-sm font-bold text-emerald-600 mb-1.5">Save ₹{product.price - product.discountedPrice}</span>
              </>
            ) : (
              <span className="font-display text-4xl font-extrabold text-slate-900">₹{product.price}</span>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed mt-6">{product.description}</p>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700">
                {outOfStock ? 'Out of Stock' : `${product.stockQuantity} available`}
              </span>
              {!outOfStock && (
                <span className={product.stockQuantity <= 5 ? 'text-accent-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                  {product.stockQuantity <= 5 ? 'Hurry, only few left!' : 'In Stock'}
                </span>
              )}
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${product.stockQuantity <= 5 ? 'bg-gradient-to-r from-accent-500 to-orange-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                style={{ width: `${Math.min(100, (product.stockQuantity / 100) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border-2 border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min={1}
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity || 1, Number(e.target.value))))}
                className="w-16 h-12 text-center font-display font-bold text-slate-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || outOfStock}
              className="btn-gradient flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-display font-bold text-base"
            >
              <ShoppingCart size={18} />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                inWishlist
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
              }`}
              title="Wishlist"
            >
              <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹500' },
              { icon: ShieldCheck, title: '100% Genuine', desc: 'Authentic products' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day returns' },
            ].map((b) => (
              <div key={b.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <b.icon size={20} className="mx-auto text-brand-600" />
                <p className="font-display font-semibold text-xs text-slate-800 mt-2">{b.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ============ REVIEWS ============ */}
      <section className="mt-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 flex items-center justify-center">
            <Star size={18} className="text-white" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">Reviews</h2>
          <span className="bg-brand-50 text-brand-600 text-sm font-bold px-3 py-1 rounded-full">{reviews.length}</span>
        </div>

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="bg-white border border-slate-100 shadow-soft rounded-3xl p-6 md:p-8 mb-8">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4">Write a Review</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-slate-700">Your rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReviewForm((prev) => ({ ...prev, rating: r }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={r <= reviewForm.rating ? 'text-accent-500 fill-accent-500' : 'text-slate-200 fill-slate-200'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience..."
              className="input-premium w-full mb-4"
              rows={3}
            />
            <button type="submit" className="btn-gradient px-6 py-3 rounded-2xl font-display font-semibold text-sm">
              Submit Review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-100 shadow-soft rounded-3xl p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-display font-semibold text-slate-900">{review.userName}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= review.rating ? 'text-accent-500 fill-accent-500' : 'text-slate-200 fill-slate-200'}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-slate-600 leading-relaxed">{review.comment}</p>}
                <p className="text-xs text-slate-400 mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
