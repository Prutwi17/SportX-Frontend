import api from './api';
import type { Cart } from '../types';

export function notifyCartUpdated() {
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

export const cartService = {
  getCart: () => api.get<Cart>('/cart'),
  addItem: async (productId: number, quantity: number) => {
    const res = await api.post<Cart>('/cart', { productId, quantity });
    notifyCartUpdated();
    return res;
  },
  updateQuantity: async (itemId: number, quantity: number) => {
    const res = await api.put<Cart>(`/cart/${itemId}`, null, { params: { quantity } });
    notifyCartUpdated();
    return res;
  },
  removeItem: async (itemId: number) => {
    const res = await api.delete<Cart>(`/cart/${itemId}`);
    notifyCartUpdated();
    return res;
  },
  clearCart: async () => {
    const res = await api.delete('/cart');
    notifyCartUpdated();
    return res;
  },
};
