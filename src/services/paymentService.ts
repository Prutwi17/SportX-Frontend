import api from './api';
import type { PaymentDTO } from '../types';

export const paymentService = {
  createRazorpayOrder: (data: { addressId: number; paymentMethod?: string; couponCode?: string; notes?: string }) =>
    api.post<PaymentDTO>('/payments/create-order', data),

  verifyPayment: (data: { orderId?: number; razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string }) =>
    api.post<PaymentDTO>('/payments/verify', data),

  processPayment: (data: { orderId: number; paymentMethod: string; razorpayPaymentId?: string; razorpayOrderId?: string }) =>
    api.post<PaymentDTO>('/payments', data),

  getByOrderId: (orderId: number) =>
    api.get<PaymentDTO>(`/payments/order/${orderId}`),
};
