import api from './api';
import type { Brand } from '../types';

export const brandService = {
  getAll: () => api.get<Brand[]>('/brands'),
  getById: (id: number) => api.get<Brand>(`/brands/${id}`),
  create: (data: { name: string; description?: string; imageUrl?: string }) =>
    api.post<Brand>('/brands', data),
  update: (id: number, data: { name: string; description?: string; imageUrl?: string }) =>
    api.put<Brand>(`/brands/${id}`, data),
  delete: (id: number) => api.delete(`/brands/${id}`),
};
