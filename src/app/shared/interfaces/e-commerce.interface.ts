// Interfaces principales del sistema de e-commerce

export interface SamplePack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  audioPreviewUrl: string;
  description: string;
  tags: string[];
  bpm: number;
  trackCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

export interface CartItem {
  id: string;
  samplePack: SamplePack;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  discount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PurchaseRequest {
  cartItems: CartItem[];
  userInfo: {
    email: string;
    name?: string;
  };
  paymentMethod: 'stripe' | 'paypal' | 'crypto';
}

// API Pagination interfaces
export interface PaginationParams {
  page: number;
  pageSize: number;
  genre?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: string;
  downloadLinks?: DownloadLink[];
}

export interface DownloadLink {
  samplePackId: string;
  url: string;
  expiresAt: Date;
}
