export type ShippingOrder = {
  shippingOrder: Shipping;
  cusInfo: CustomerShippingInfo;
  apartment: ShippingOrder_ApartmentInfo;
};

export type Shipping = {
  shippingId: string;
  leaderId: string;
  customerId: string;
  workerId: string;
  shipmentDate: string;
  deliveriedDate: string;
  status: number;
  customerNote: string;
  proofFileUrl: string;
  address: string;
};

export type CustomerShippingInfo = {
  accountId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  dateOfBirth: string;
};

export type ShippingOrder_ApartmentInfo = {
  areaId: string,
  leaderId: string,
  name: string;
  description: string;
  address: string;
  managementCompany: string;
  avatarUrl: string;
  fileUrl: string;  
}