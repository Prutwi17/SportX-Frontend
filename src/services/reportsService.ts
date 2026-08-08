import api from './api';
import type { ReportsData } from '../types';

export const reportsService = {
  getAnalytics: () => api.get<ReportsData>('/reports/analytics'),
};
