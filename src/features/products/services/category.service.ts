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

  /**
   * Create a new category (Admin only).
   */
  async createCategory(payload: import("@/types/category").CreateCategoryPayload): Promise<Category> {
    const response = await client.post<ApiResponse<Category> | Category>("/categories", payload);
    return (response as ApiResponse<Category>).data || (response as Category);
  },

  /**
   * Update an existing category (Admin only).
   */
  async updateCategory(
    id: number,
    payload: Partial<import("@/types/category").CreateCategoryPayload>
  ): Promise<Category> {
    const response = await client.put<ApiResponse<Category> | Category>(
      `/categories/${id}`,
      payload
    );
    return (response as ApiResponse<Category>).data || (response as Category);
  },

  /**
   * Delete a category (Admin only).
   * Safe conflict handling when linked products exist.
   */
  async deleteCategory(id: number): Promise<{ message?: string }> {
    return client.delete<{ message?: string }>(`/categories/${id}`);
  },
};

