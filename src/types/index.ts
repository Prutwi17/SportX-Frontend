export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  profileImage: string;
  enabled: boolean;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  active: boolean;
  averageRating: number;
  ratingCount: number;
  imageUrls: string[];
  primaryImage: string;
  createdAt?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  discountedPrice: number;
  stockQuantity: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productDescription?: string;
  categoryName?: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface PaymentDTO {
  id: number;
  orderId: number;
  orderNumber?: string;
  paymentMethod: string;
  status: string;
  amount: number;
  currency?: string;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  keyId?: string;
  verified?: boolean;
  message?: string;
  paidAt?: string;
}

export interface Order {
  id: number;
  userId?: number;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus?: string;
  transactionId?: string;
  couponCode: string;
  notes: string;
  createdAt: string;
  address: Address;
  items: OrderItem[];
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  productId: number;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  validFrom: string;
  validUntil: string;
}

export interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  todayRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  outOfStockProducts: number;
  averageOrderValue: number;
  topSellingProducts: TopProduct[];
  categoryDistribution: NameValue[];
  orderTrend: ChartPoint[];
  revenueTrend: ChartPoint[];
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface NameValue {
  name: string;
  value: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  image: string;
  quantitySold: number;
  revenue: number;
}

export interface ReportsData {
  todayRevenue: number;
  todayOrders: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  yearlyRevenue: number;
  yearlyOrders: number;
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  averageOrderValue: number;
  bestSellingBrand: string;
  revenueByDay: ChartPoint[];
  revenueByMonth: ChartPoint[];
  orderByDay: ChartPoint[];
  orderByMonth: ChartPoint[];
  categoryDistribution: NameValue[];
  topCategories: NameValue[];
  topProducts: TopProduct[];
  recentSales: Order[];
}

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  profileImage: string;
  enabled: boolean;
  createdAt: string;
  totalOrders: number;
  totalSpending: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
