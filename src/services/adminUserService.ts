import api from './api';
import type { AdminUser, PagedResponse } from '../types';

export const adminUserService = {
  getUsers: (params: { page?: number; size?: number; keyword?: string; role?: string; enabled?: boolean } = {}) =>
    api.get<PagedResponse<AdminUser>>('/admin/users', { params }),

  getUser: (id: number) => api.get<AdminUser>(`/admin/users/${id}`),

  updateUser: (id: number, data: { firstName: string; lastName: string; email: string; phone?: string; role: string }) =>
    api.put<AdminUser>(`/admin/users/${id}`, data),

  resetPassword: (id: number, newPassword: string) =>
    api.put<AdminUser>(`/admin/users/${id}/password`, { newPassword }),

  setEnabled: (id: number, enabled: boolean) =>
    api.put<AdminUser>(`/admin/users/${id}/status`, { enabled }),
};
