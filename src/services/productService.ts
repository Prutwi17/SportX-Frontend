import api from './api';
import type { Product, PagedResponse } from '../types';

export const productService = {
  getAll: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') =>
    api.get<PagedResponse<Product>>('/products', { params: { page, size, sortBy, sortDir } }),

  getById: (id: number) => api.get<Product>(`/products/${id}`),

  create: (data: FormData | Record<string, unknown>) => api.post<Product>('/products', data),

  update: (id: number, data: FormData | Record<string, unknown>) =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: number) => api.delete(`/products/${id}`),

  search: (q: string, page = 0, size = 10) =>
    api.get<PagedResponse<Product>>('/products/search', { params: { q, page, size } }),

  filter: (params: Record<string, unknown>) =>
    api.get<PagedResponse<Product>>('/products/filter', { params }),

  getByCategory: (categoryId: number, page = 0, size = 10) =>
    api.get<PagedResponse<Product>>(`/products/category/${categoryId}`, { params: { page, size } }),

  getByBrand: (brandId: number, page = 0, size = 10) =>
    api.get<PagedResponse<Product>>(`/products/brand/${brandId}`, { params: { page, size } }),
};
