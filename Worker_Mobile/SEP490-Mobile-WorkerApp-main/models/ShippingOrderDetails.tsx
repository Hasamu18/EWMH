export type ShippingOrderDetails = {
  result: ShippingOrderDetails_OrderItem[];
  sum: number;
  purchaseTime: string;
  fileUrl: string;
};

export type ShippingOrderDetails_OrderItem = {
  product: ShippingOrderDetails_Product;
  orderDetail: ShippingOrderDetails_OrderDetail;
};

export type ShippingOrderDetails_Product = {
  productId: string;
  name: string;
  imageUrl: string;
  description: string;
  warantyMonths: number;
};

export type ShippingOrderDetails_WarrantyCard = {
  warrantyCardId: string;
  customerId: string;
  productId: string;
  startDate: string;
  expireDate: string;
};

export type ShippingOrderDetails_WarrantyCards = {
  getWarrantyCards: ShippingOrderDetails_WarrantyCard[];
  remainingDays: number[];
};

export type ShippingOrderDetails_OrderDetail = {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  warrantyCards: ShippingOrderDetails_WarrantyCards;
};
