import { Leader, User } from "./user";

export type Order = {
  order: {
    orderId: string;
    purchaseTime: string;
    fileUrl: string;
    orderCode: string;
    totalPrice: number;
  };
  customer: User[];
};

export type RequestOrder = {
  order: {
    requestId: string;
    purchaseTime: string;
    fileUrl: string;
    orderCode: string;
    totalPrice: number;
  };
  customer_Leader: User[];
};

export type OrderDetails = {
  customer: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  apartment: {
    areaId: string;
    leaderId: string;
    name: string;
    description: string;
    address: string;
    managementCompany: string;
    avatarUrl: string;
    leader: Leader | null;
  };
  leader: User | null;
  order: {
    result: {
      product: {
        productId: string;
        name: string;
        imageUrl: string;
      };
      orderDetail: {
        orderId: string;
        productId: string;
        quantity: number;
        price: number;
        totalPrice: number;
      };
    }[];
    sum: number;
    purchaseTime: string;
    fileUrl: string;
  } | null;
};
