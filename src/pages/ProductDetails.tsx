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
import ProductImage from '../components/common/ProductImage';

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
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const galleryImages = product
    ? [product.primaryImage, ...(product.imageUrls || []).filter(Boolean)].filter(
        (img, i, arr) => img && arr.indexOf(img) === i
      )
    : [];

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    productService.getById(Number(id)).then((res) => {
      if (!cancelled) {
        setProduct(res.data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setProduct(null);
        setLoading(false);
      }
    });
    reviewService.getProductReviews(Number(id)).then((res) => {
      if (!cancelled) setReviews(res.data);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAddingToCart(true);
    try {
      await cartService.addItem(product!.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1600);
    } catch {
      alert('Failed to add to cart');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
        <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Home</Link>
        <ChevronRight size={13} />
        <Link to="/products" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Products</Link>
        <ChevronRight size={13} />
        <span className="text-slate-800 dark:text-white font-medium truncate max-w-[240px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,44%)_1fr] gap-8 lg:gap-10 lg:items-start">
        {/* ============ IMAGE GALLERY ============ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:sticky lg:top-24"
        >
          <div className="relative aspect-square bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-soft">
            {galleryImages[activeImage] && !imageError ? (
              <ProductImage
                key={activeImage}
                src={galleryImages[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                <Zap size={56} />
              </div>
            )}
            {discountPct > 0 && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-brand-600/30">
                {discountPct}% OFF
              </span>
            )}
            {outOfStock && (
              <div className="absolute inset-0 bg-white/60 dark:bg-dark-900/70 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-dark-900 text-white font-display font-bold px-6 py-3 rounded-2xl shadow-xl uppercase tracking-wide">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-2.5 mt-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveImage(i); setImageError(false); }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImage
                      ? 'border-brand-500 shadow-md shadow-brand-500/20'
                      : 'border-slate-100 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25'
                  }`}
                >
                  <ProductImage src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ============ PRODUCT INFO ============ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="min-w-0"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-800 px-3 py-1 rounded-full">
              {product.categoryName}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">{product.brandName}</span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {product.name}
          </h1>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={15}
                    className={s <= Math.round(product.averageRating) ? 'text-brand-600 fill-brand-600' : 'text-slate-200 fill-slate-200'}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{product.averageRating.toFixed(1)}</span>
              <span className="text-sm text-slate-400">({product.ratingCount} reviews)</span>
            </div>
          )}

          <div className="flex items-end gap-3 mt-3 pb-5 border-b border-slate-100 dark:border-white/10">
            {product.discountedPrice ? (
              <>
                <span className="font-display text-3xl md:text-4xl font-extrabold text-gradient">₹{product.discountedPrice.toLocaleString('en-IN')}</span>
                <span className="text-lg text-slate-400 line-through mb-0.5">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">Save ₹{(product.price - product.discountedPrice).toLocaleString('en-IN')}</span>
              </>
            ) : (
              <span className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm sm:text-[15px]">{product.description}</p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {outOfStock ? 'Out of Stock' : `${product.stockQuantity} available`}
              </span>
              {!outOfStock && (
                <span className={product.stockQuantity <= 5 ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-emerald-600 font-semibold'}>
                  {product.stockQuantity <= 5 ? 'Hurry, only few left!' : 'In Stock'}
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${product.stockQuantity <= 5 ? 'bg-gradient-to-r from-brand-500 to-orange-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                style={{ width: `${Math.min(100, (product.stockQuantity / 100) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <div className="flex items-center border-2 border-slate-200 dark:border-white/15 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                <Minus size={15} />
              </button>
              <input
                type="number"
                min={1}
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity || 1, Number(e.target.value))))}
                className="w-14 h-11 text-center font-display font-bold text-slate-900 dark:text-white bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                className="w-11 h-11 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || outOfStock}
              className="btn-accent flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wide"
            >
              <ShoppingCart size={17} />
              {addingToCart ? 'Adding...' : addedToCart ? 'Added!' : 'Add to Cart'}
            </button>

            <button
              onClick={async () => {
                if (!isAuthenticated) { navigate('/login'); return; }
                setAddingToCart(true);
                try {
                  await cartService.addItem(product!.id, quantity);
                  navigate('/checkout');
                } catch {
                  alert('Failed to proceed to checkout');
                } finally {
                  setAddingToCart(false);
                }
              }}
              disabled={addingToCart || outOfStock}
              className="bg-dark-900 dark:bg-white text-white dark:text-dark-900 hover:bg-black dark:hover:bg-slate-100 flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wide transition-all shadow-md"
            >
              <Zap size={16} className="text-brand-500 fill-current" />
              Buy Now
            </button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${
                inWishlist
                  ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950/40 dark:border-brand-800 dark:text-brand-400'
                  : 'border-slate-200 text-slate-400 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 dark:border-white/15 dark:hover:bg-white/10'
              }`}
              title="Wishlist"
            >
              <Heart size={19} className={inWishlist ? 'fill-current' : ''} />
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹500' },
              { icon: ShieldCheck, title: '100% Genuine', desc: 'Authentic products' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day returns' },
            ].map((b) => (
              <div key={b.title} className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-3.5 text-center">
                <b.icon size={18} className="mx-auto text-brand-600 dark:text-brand-400" />
                <p className="font-display font-semibold text-xs text-slate-800 dark:text-white mt-1.5">{b.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ============ REVIEWS ============ */}
      <section className="mt-12 sm:mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Star size={16} className="text-white" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Customer Reviews</h2>
          <span className="bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-sm font-bold px-3 py-1 rounded-full">{reviews.length}</span>
        </div>

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-dark-800 border border-slate-100 dark:border-white/10 shadow-soft rounded-2xl p-5 md:p-7 mb-7">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3">Write a Review</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Your rating:</span>
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
              placeholder="Share your experience with this product..."
              className="input-premium w-full mb-4 dark:bg-dark-900 dark:text-white dark:border-white/15"
              rows={3}
            />
            <button type="submit" className="btn-accent px-6 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wide">
              Submit Review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white dark:bg-dark-800 border border-slate-100 dark:border-white/10 rounded-2xl p-5 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-sm text-slate-900 dark:text-white">{r.userName || 'Verified Buyer'}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={13} className={s <= r.rating ? 'text-brand-600 fill-brand-600' : 'text-slate-200 fill-slate-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
