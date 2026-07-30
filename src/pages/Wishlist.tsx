import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link to="/products" className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <Link to={`/products/${item.productId}`}>
                <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <h3 className="font-semibold">{item.productName}</h3>
                <div className="mt-1">
                  {item.discountedPrice ? (
                    <div className="flex gap-2">
                      <span className="font-bold text-indigo-600">${item.discountedPrice}</span>
                      <span className="text-sm text-gray-400 line-through">${item.price}</span>
                    </div>
                  ) : (
                    <span className="font-bold">${item.price}</span>
                  )}
                </div>
              </Link>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddToCart(item.productId)}
                  className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-700"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-red-500 text-sm px-3 py-2 border rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
