import api from './api';
import type { Coupon } from '../types';

export const couponService = {
  getAll: () => api.get<Coupon[]>('/coupons'),
  getById: (id: number) => api.get<Coupon>(`/coupons/${id}`),
  getByCode: (code: string) => api.get<Coupon>(`/coupons/code/${code}`),
  create: (data: Omit<Coupon, 'id' | 'usedCount'>) => api.post<Coupon>('/coupons', data),
  delete: (id: number) => api.delete(`/coupons/${id}`),
};
