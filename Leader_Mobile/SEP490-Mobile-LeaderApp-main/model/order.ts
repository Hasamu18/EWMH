import { aparmentArea } from "./aparmentArea";
import { Customer } from "./customer";
import { Product } from "./product";

export interface ShippingOrder {
  item: {
    shipping: Shipping;
    order: Order;
  };
  getCusInfo: Customer;
}

export interface Shipping {
  shippingId: string;
  leaderId: string;
  customerId: string;
  workerId?: string;
  shipmentDate: string;
  deliveriedDate?: string;
  status: number;
  customerNote: string;
  proofFileUrl?: string;
  address: number
}

export interface Order {
  orderId: string;
  customerId: string;
  purchaseTime: string;
  fileUrl: string;
}

export interface OrderProductDetails {
  product: Product;
  orderDetail: {
    orderId: string;
    productId: string;
    quantity: string;
    price: number;
    totalPrice: number;
    warrantyCards: {
      getWarrantyCards: [
        {
          warrantyCardId: string;
          customerId: string;
          productId: string;
          startDate: string;
          expireDate: string;
        }
      ];
      remainingDays: number[];
    };
  };
}

export interface OrderDetails {
  customer: Customer;
  apartment: aparmentArea;
  order: {
    result: OrderProductDetails[];
    sum: number;
    purchaseTime: string;
    fileUrl: string;
  };
}
