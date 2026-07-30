import api from './api';
import type { DashboardData } from '../types';

export const dashboardService = {
  getStats: () => api.get<DashboardData>('/dashboard'),
};
