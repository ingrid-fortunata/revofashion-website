import { client } from "@/lib/api/client";
import { ApiResponse } from "@/types/api";
import { Category } from "@/types/category";

export const categoryService = {
  /**
   * Fetch all active product categories.
   */
  async getCategories(): Promise<Category[]> {
    const response = await client.get<ApiResponse<Category[]>>("/categories");
    return response.data || [];
  },

  /**
   * Fetch single category by ID with associated products.
   */
  async getCategoryById(id: number): Promise<Category> {
    const response = await client.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },
};
