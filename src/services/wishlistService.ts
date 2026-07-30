import api from './api';
import type { WishlistItem } from '../types';

export const wishlistService = {
  getWishlist: () => api.get<WishlistItem[]>('/wishlist'),
  addItem: (productId: number) => api.post<WishlistItem>(`/wishlist/${productId}`),
  removeItem: (productId: number) => api.delete(`/wishlist/${productId}`),
  check: (productId: number) => api.get<boolean>(`/wishlist/check/${productId}`),
};
