import api from './api';
import type { Review } from '../types';

export const reviewService = {
  create: (productId: number, rating: number, comment: string) =>
    api.post<Review>(`/reviews/product/${productId}`, { rating, comment }),
  getProductReviews: (productId: number) =>
    api.get<Review[]>(`/reviews/public/product/${productId}`),
  hasReviewed: (productId: number) =>
    api.get<boolean>(`/reviews/product/${productId}/check`),
  approve: (id: number) => api.put<Review>(`/reviews/${id}/approve`),
  delete: (id: number) => api.delete(`/reviews/${id}`),
};
