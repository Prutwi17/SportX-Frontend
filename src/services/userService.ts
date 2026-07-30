import api from './api';
import type { User } from '../types';

export const userService = {
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (data: { firstName: string; lastName: string; phone?: string }) =>
    api.put<User>('/users/profile', data),
  deleteProfile: () => api.delete('/users/profile'),
};
