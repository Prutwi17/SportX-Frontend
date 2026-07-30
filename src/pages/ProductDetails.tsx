import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import type { Product, Review } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService.getById(Number(id)).then((res) => {
      setProduct(res.data);
      setLoading(false);
    });
    reviewService.getProductReviews(Number(id)).then((res) => setReviews(res.data));
    if (isAuthenticated) {
      wishlistService.check(Number(id)).then((res) => setInWishlist(res.data));
    }
  }, [id, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAddingToCart(true);
    try {
      await cartService.addItem(product!.id, quantity);
      alert('Added to cart!');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      if (inWishlist) {
        await wishlistService.removeItem(product!.id);
        setInWishlist(false);
      } else {
        await wishlistService.addItem(product!.id);
        setInWishlist(true);
      }
    } catch { /* ignore */ }
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          {product.primaryImage ? (
            <img src={product.primaryImage} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-gray-400 text-4xl">No Image</span>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-2">{product.categoryName} | {product.brandName}</p>
          {product.averageRating > 0 && (
            <p className="text-yellow-500 mb-4">★ {product.averageRating.toFixed(1)} ({product.ratingCount} reviews)</p>
          )}

          <div className="mb-4">
            {product.discountedPrice ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-indigo-600">${product.discountedPrice}</span>
                <span className="text-xl text-gray-400 line-through">${product.price}</span>
              </div>
            ) : (
              <span className="text-3xl font-bold">${product.price}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>
          <p className="text-sm mb-4">
            {product.stockQuantity > 0 ? (
              <span className="text-green-600">In Stock ({product.stockQuantity} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium">Quantity:</label>
            <input
              type="number"
              min={1}
              max={product.stockQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded w-20 px-3 py-2"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stockQuantity === 0}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`px-4 py-3 rounded-lg border ${inWishlist ? 'bg-red-50 text-red-600 border-red-300' : 'hover:bg-gray-50'}`}
            >
              {inWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4">
              <label className="text-sm font-medium">Rating:</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                className="border rounded px-2 py-1"
              >
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience..."
              className="w-full border rounded px-3 py-2 mb-4"
              rows={3}
            />
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
              Submit Review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.userName}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                </div>
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
                <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
