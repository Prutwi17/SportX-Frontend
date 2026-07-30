import api from './api';
import type { Address } from '../types';

export const addressService = {
  getAll: () => api.get<Address[]>('/addresses'),
  getById: (id: number) => api.get<Address>(`/addresses/${id}`),
  create: (data: Omit<Address, 'id' | 'userId'>) => api.post<Address>('/addresses', data),
  update: (id: number, data: Omit<Address, 'id' | 'userId'>) => api.put<Address>(`/addresses/${id}`, data),
  delete: (id: number) => api.delete(`/addresses/${id}`),
  setDefault: (id: number) => api.put(`/addresses/${id}/default`),
};
