import { client } from "@/lib/api/client";
import { Product, ProductFilterParams, ProductListResponse } from "@/types/product";

export const productService = {
  /**
   * Fetch products with optional filtering, search, sorting, and pagination.
   */
  async getProducts(params?: ProductFilterParams): Promise<ProductListResponse> {
    const cleanedParams: Record<string, string | number | undefined> = {};

    if (params) {
      if (params.category_id !== undefined && params.category_id !== null) {
        cleanedParams.category_id = params.category_id;
      }
      if (params.gender && params.gender !== "All") {
        cleanedParams.gender = params.gender;
      }
      if (params.size && params.size !== "All") {
        cleanedParams.size = params.size;
      }
      if (params.color) {
        cleanedParams.color = params.color;
      }
      if (params.material) {
        cleanedParams.material = params.material;
      }
      if (params.min_price !== undefined) {
        cleanedParams.min_price = params.min_price;
      }
      if (params.max_price !== undefined) {
        cleanedParams.max_price = params.max_price;
      }
      if (params.is_active !== undefined) {
        cleanedParams.is_active = params.is_active;
      }
      if (params.sort_by) {
        cleanedParams.sort_by = params.sort_by;
      }
      if (params.search && params.search.trim() !== "") {
        cleanedParams.search = params.search.trim();
      }
      if (params.page !== undefined) {
        cleanedParams.page = params.page;
      }
      if (params.per_page !== undefined) {
        cleanedParams.per_page = params.per_page;
      }
    }

    return client.get<ProductListResponse>("/products", {
      params: cleanedParams,
    });
  },

  /**
   * Fetch single product by ID.
   */
  async getProductById(id: number): Promise<{ data: Product }> {
    return client.get<{ data: Product }>(`/products/${id}`);
  },

  /**
   * Create a new product (Admin only).
   */
  async createProduct(payload: import("@/types/product").CreateProductPayload): Promise<{ data: Product }> {
    return client.post<{ data: Product }>("/products", payload);
  },

  /**
   * Update an existing product (Admin only).
   */
  async updateProduct(
    id: number,
    payload: Partial<import("@/types/product").CreateProductPayload>
  ): Promise<{ data: Product }> {
    return client.put<{ data: Product }>(`/products/${id}`, payload);
  },

  /**
   * Delete a product (Admin only).
   * Handled with conflict safety for products with active orders.
   */
  async deleteProduct(id: number): Promise<{ message?: string }> {
    return client.delete<{ message?: string }>(`/products/${id}`);
  },
};

