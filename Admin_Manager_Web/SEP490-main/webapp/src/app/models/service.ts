export type ServicePackage = {
  servicePackageId: string;
  name: string;
  numOfRequest: number;
  imageUrl: string;
  description: string;
  status: boolean;
  priceByDate: number;
  policy?: string;
  servicePackagePriceId?: string;
  date?: string;
};

export type TopServicePackage = {
  servicePackageId: string;
  totalPurchasedQuantity: number;
  totalRevenue: number;
  servicePackageName: string;
  servicePackageDescription: string;
  servicePackageImageUrl: string;
  numOfRequest: number;
  policy: string;
  status: boolean;
  latestPrice: number;
  contractIdList: { contractId: string; purchaseTime: string }[];
};
