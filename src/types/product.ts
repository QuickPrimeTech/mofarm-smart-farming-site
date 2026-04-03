// types/product.ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock?: number;
  low_stock_threshold?: number;
  created_at?: string;
}
