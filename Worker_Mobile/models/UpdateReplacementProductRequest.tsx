export type UpdateReplacementProductRequest = {
  product: {
    requestDetailId: string;
    quantity: number;
    isCustomerPaying: boolean;
    description: string;
  };
};
