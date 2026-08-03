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
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod: string;
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
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
