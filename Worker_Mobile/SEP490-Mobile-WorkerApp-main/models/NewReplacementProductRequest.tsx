export type NewReplacementProductRequest = {
  requestId: string;
  productList: NewReplacementProduct[];
};
export type NewReplacementProduct = {
  productId: string;
  quantity: number;
  isCustomerPaying: boolean;
  description: string;
};
