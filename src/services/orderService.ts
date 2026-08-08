import api from './api';
import type { Order, PagedResponse } from '../types';

export const orderService = {
  placeOrder: (data: { addressId: number; paymentMethod?: string; couponCode?: string; notes?: string }) =>
    api.post<Order>('/orders', data),

  getUserOrders: (page = 0, size = 10) =>
    api.get<PagedResponse<Order>>('/orders', { params: { page, size } }),

  getById: (id: number) => api.get<Order>(`/orders/${id}`),

  getByNumber: (orderNumber: string) => api.get<Order>(`/orders/number/${orderNumber}`),

  cancelOrder: (id: number) => api.put(`/orders/${id}/cancel`),

  getAllOrders: (page = 0, size = 10) =>
    api.get<PagedResponse<Order>>('/orders/admin', { params: { page, size } }),

  updateStatus: (id: number, status: string) =>
    api.put<Order>(`/orders/${id}/status`, { status }),

  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
};
