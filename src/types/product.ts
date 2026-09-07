export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "FREE" | "Free Size";
export type ProductGender = "Men" | "Women" | "Unisex" | "Kids";

export interface ProductImage {
  id?: number;
  image_base64: string;
  is_primary: boolean;
  created_at?: string;
}

export interface Product {
  id: number;
  category_id: number | null;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  size: ProductSize;
  color: string;
  material: string | null;
  gender: ProductGender;
  sku: string;
  primary_image?: string | null;
  images?: ProductImage[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilterParams {
  category_id?: number;
  gender?: string;
  size?: string;
  color?: string;
  material?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  is_active?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ProductListResponse {
  data: Product[];
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  stock: number;
  color: string;
  category_id?: number | null;
  size?: ProductSize;
  material?: string;
  gender?: ProductGender;
  sku?: string;
  images?: {
    image_base64: string;
    is_primary: boolean;
  }[];
}
