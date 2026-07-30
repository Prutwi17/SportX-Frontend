import api from './api';
import type { Cart } from '../types';

export const cartService = {
  getCart: () => api.get<Cart>('/cart'),
  addItem: (productId: number, quantity: number) =>
    api.post<Cart>('/cart', { productId, quantity }),
  updateQuantity: (itemId: number, quantity: number) =>
    api.put<Cart>(`/cart/${itemId}`, null, { params: { quantity } }),
  removeItem: (itemId: number) => api.delete<Cart>(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};
