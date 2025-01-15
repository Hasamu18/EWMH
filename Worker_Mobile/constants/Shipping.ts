import Colors from "./Colors";

export const SHIPPING_ASSIGNED = 1;
export const SHIPPING_DELIVERING = 2;
export const SHIPPING_DELIVERED = 3;
export const SHIPPING_DELAYED = 4;



export type ShippingOrderStatus = {
  key: number;
  value: string;
  color: string;
  textColor: string;
};


export const SHIPPING_ORDER_STATUSES: ShippingOrderStatus[] = [
  {
    key: SHIPPING_ASSIGNED,
    value: "Đã tiếp nhận",
    color: Colors.ewmh.shippingOrderStatus.assignedOrder,
    textColor: Colors.ewmh.shippingOrderStatus.assignedOrderText,
  },
  {
    key: SHIPPING_DELIVERING,
    value: "Đang giao",
    color: Colors.ewmh.shippingOrderStatus.inProgress,
    textColor: Colors.ewmh.shippingOrderStatus.inProgressText,
  },
  {
    key: SHIPPING_DELIVERED,
    value: "Đã giao",
    color: Colors.ewmh.shippingOrderStatus.completed,
    textColor: Colors.ewmh.shippingOrderStatus.completedText,
    },  
  {
    key: SHIPPING_DELAYED,
    value: "Tạm hoãn",
    color: Colors.ewmh.shippingOrderStatus.delayed,
    textColor: Colors.ewmh.shippingOrderStatus.delayedText,
  },
];