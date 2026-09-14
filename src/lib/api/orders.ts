import { client } from "./client";
import { FetchOptions } from "@/types/api";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  OrderListResponse,
  OrderFilterParams,
  OrderStatus,
} from "@/types/order";

/**
 * Places a new order with shipping details and cart items via POST /orders.
 * Automatically decrements product stock and returns the created Order.
 */
export async function createOrder(
  payload: CreateOrderPayload,
  options?: FetchOptions
): Promise<CreateOrderResponse> {
  return client.post<CreateOrderResponse>("/orders", payload, options);
}

/**
 * Retrieves orders list (for current customer or all for admin) via GET /orders.
 * Supports optional FetchOptions for server-side token passing and cache control.
 */
export async function getOrders(
  params?: OrderFilterParams,
  options?: FetchOptions
): Promise<OrderListResponse> {
  const cleanedParams: Record<string, string | number | undefined> = {};

  if (params) {
    if (params.status) cleanedParams.status = params.status;
    if (params.order_id !== undefined) cleanedParams.order_id = params.order_id;
    if (params.recipient_name) cleanedParams.recipient_name = params.recipient_name;
    if (params.recipient_phone) cleanedParams.recipient_phone = params.recipient_phone;
    if (params.shipping_address) cleanedParams.shipping_address = params.shipping_address;
    if (params.customer_name) cleanedParams.customer_name = params.customer_name;
    if (params.search?.trim()) cleanedParams.search = params.search.trim();
    if (params.page !== undefined) cleanedParams.page = params.page;
    if (params.per_page !== undefined) cleanedParams.per_page = params.per_page;
  }

  return client.get<OrderListResponse>("/orders", {
    ...options,
    params: {
      ...cleanedParams,
      ...(options?.params || {}),
    },
  });
}

/**
 * Retrieves a single order with items by order ID via GET /orders/:id.
 * Supports optional FetchOptions for server-side token passing and cache control.
 */
export async function getOrderById(
  id: number,
  options?: FetchOptions
): Promise<{ data: Order }> {
  return client.get<{ data: Order }>(`/orders/${id}`, options);
}

/**
 * Soft-cancels an order (allowed only if status is 'pending' or 'paid') via DELETE /orders/:id.
 * Automatically restores product inventory stock on the backend.
 */
export async function cancelOrder(
  id: number,
  reason: string,
  options?: FetchOptions
): Promise<{ data: Order; message?: string }> {
  return client.delete<{ data: Order; message?: string }>(`/orders/${id}`, {
    ...options,
    body: JSON.stringify({ cancellation_reason: reason }),
  });
}

/**
 * Updates an order's lifecycle status via PATCH /orders/:id (Admin only).
 * Supports status transitions with tracking_number or cancellation_reason.
 */
export async function updateOrderStatus(
  id: number,
  payload: {
    status: OrderStatus;
    tracking_number?: string;
    cancellation_reason?: string;
  },
  options?: FetchOptions
): Promise<{ data: Order; message?: string }> {
  return client.patch<{ data: Order; message?: string }>(`/orders/${id}`, payload, options);
}

export const orderService = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};

export default orderService;


