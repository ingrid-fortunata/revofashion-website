import { createOrder } from "@/features/orders/services/order.service";
import { CreateOrderPayload, CreateOrderResponse } from "@/types/order";
import { FetchOptions } from "@/types/api";

export const checkoutService = {
  /**
   * Dispatches order placement with shipping details and cart item references.
   */
  async submitCheckout(
    payload: CreateOrderPayload,
    options?: FetchOptions
  ): Promise<CreateOrderResponse> {
    return createOrder(payload, options);
  },
};

export default checkoutService;
