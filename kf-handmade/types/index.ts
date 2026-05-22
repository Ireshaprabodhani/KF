export interface ProductColor {
  id: string;
  product_id: string;
  name: string;
  hex: string;
  images: string[];
  videos: string[];
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount: number;
  images: string[];        // fallback for colorless products
  available: boolean;
  created_at: string;
  updated_at: string;
  colors?: ProductColor[]; // populated via join on single-product fetch
}

export interface CartItem {
  cartItemId: string;            // crypto.randomUUID() at add-time
  product: Product;
  quantity: number;
  selectedColor: ProductColor | null;
  notes: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
}
