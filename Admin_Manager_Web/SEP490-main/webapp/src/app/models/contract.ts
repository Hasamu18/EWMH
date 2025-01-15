export type Contract = {
  item: {
    contractId: string;
    customerId: string;
    servicePackageId: string;
    name: string;
    fileUrl: string;
    purchaseTime: string;
    expireDate: string;
    numOfRequest: number;
    remainingNumOfRequests: number;
    orderCode: string | null;
    isOnlinePayment: boolean;
    totalPrice: number;
  };
  getCusInfo: {
    accountId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    dateOfBirth: string;
    cmT_CCCD: string;
  };
  requestIdList: { requestId: string; start: string }[];
};

export type ContractDetails = {
  contract: {
    contractId: string;
    customerId: string;
    servicePackageId: string;
    fileUrl: string;
    purchaseTime: string;
    remainingNumOfRequests: number;
    orderCode: string;
    isOnlinePayment: boolean;
    totalPrice: number;
  };
  requestIdList: {
    requestId: string;
    purchaseTime: string;
  }[];
  customerInfo: {
    accountId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
    dateOfBirth: string;
    isDisabled: boolean;
    disabledReason: string | null;
    cmT_CCCD: string;
  };
};
