export type Product = {
  productId: string;
  name: string;
  inOfStock: number;
  imageUrl: string;
  status: boolean;
  priceByDate: number;
  description?: string;
  warantyMonths?: number;
  productPriceId?: string;
  date?: string;
};

export type TopProduct = {
  productId: string;
  totalPurchasedQuantity: number;
  totalRevenue: number;
  productName: string;
  productDescription: string;
  productImageUrl: string;
  currentStock: number;
  warantyMonths: number;
  status: boolean;
  latestPrice: number;
  orderIdList: { orderId: string; purchaseTime: string }[];
  doneRequestIdList: { requestId: string; purchaseTime: string }[];
};
