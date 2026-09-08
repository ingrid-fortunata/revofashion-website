import { client } from "./client";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  OrderListResponse,
  OrderFilterParams,
} from "@/types/order";

/**
 * Places a new order with shipping details and cart items via POST /orders.
 * Automatically decrements product stock and returns the created Order.
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  return client.post<CreateOrderResponse>("/orders", payload);
}

/**
 * Retrieves orders list (for current customer or all for admin) via GET /orders.
 */
export async function getOrders(
  params?: OrderFilterParams
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
    params: cleanedParams,
  });
}

/**
 * Retrieves a single order with items by order ID via GET /orders/:id.
 */
export async function getOrderById(
  id: number
): Promise<{ data: Order }> {
  return client.get<{ data: Order }>(`/orders/${id}`);
}

export const orderService = {
  createOrder,
  getOrders,
  getOrderById,
};

export default orderService;
