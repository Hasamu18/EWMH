export type RequestDetails = {
  requestId: string;
  contractId: string;
  status: number;
  startDate: string;
  preRepairEvidenceUrl: string;
  postRepairEvidenceUrl: string;
  customerId: string;
  customerAvatar: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerProblem: string;
  apartment: RequestDetailsApartment;
  roomId: string;
  workers: RequestDetailsWorker[];
  replacementProducts?: ReplacementProduct[];
  warrantyRequests?: WarrantyRequest[];
};

export type RequestDetailsWorker = {
  workerId: string;
  workerName: string;
  workerAvatar: string;
  workerPhoneNumber: string;
  isLead: boolean;
};
export type ReplacementProduct = {
  requestDetailId: string;
  requestId: string;
  imageUrl: string;
  productName: string;
  productPrice: number;
  isCustomerPaying: boolean;
  quantity: number;
  replacementReason: string;
};

export type WarrantyRequest = {
  warrantyCardId: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  productDescription: string;
  startDate: string;
  expireDate: string;
};

export type RequestDetailsApartment = {
  areaId: string;
  leaderId: string;
  name: string;
  description: string;
  address: string;
  managementCompany: string;
  avatarUrl: string;
  fileUrl?: string;
};
