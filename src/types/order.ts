export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  order_id?: number;
  product_id: number;
  name?: string;
  quantity: number;
  price_at_purchase: number;
  size: string;
  color: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  recipient_name: string;
  recipient_phone: string;
  tracking_number?: string | null;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface CreateOrderItemPayload {
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CreateOrderPayload {
  shipping_address: string;
  recipient_name: string;
  recipient_phone: string;
  items: CreateOrderItemPayload[];
}

export interface OrderListResponse {
  data: Order[];
  page: number;
  per_page: number;
  total: number;
  pages: number;
}
