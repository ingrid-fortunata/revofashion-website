import { Product } from "./product";

export interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  products?: Product[];
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  is_active?: boolean;
}
