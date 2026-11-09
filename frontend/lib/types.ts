export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  productId: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
  featured: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user: { id: string; name: string };
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
  price: number | string;
}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  user?: { id: string; name: string; email: string };
  items: OrderItem[];
  status: OrderStatus;
  total: number | string;
  addressId: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}
