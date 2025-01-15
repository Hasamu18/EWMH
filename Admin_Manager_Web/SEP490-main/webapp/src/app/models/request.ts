import { Contract } from "./contract";
import { Feedback } from "./feedback";
import { User } from "./user";

export type RequestValues = {
  requestPrice: number;
  [key: string]: number;
};

export type Request = {
  request: RequestDetails;
  customer_Leader: CustomerLeader[];
  workerList: { getWokerInfo: User; isLead: boolean }[];
  productList: Product[];
};

type RequestDetails = {
  requestId: string;
  leaderId: string;
  customerId: string;
  contractId: string | null;
  roomId: string;
  start: string;
  end: string | null;
  customerProblem: string;
  conclusion: string | null;
  status: number;
  categoryRequest: number;
  purchaseTime: string | null;
  totalPrice: number | null;
  fileUrl: string | null;
  orderCode: string | null;
  isOnlinePayment: boolean | null;
  contract: Contract | null;
  customer: User | null;
  feedbacks: Feedback[];
  leader: User | null;
  priceRequests: any[];
  requestPrice: number;
};

type CustomerLeader = {
  accountId: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatarUrl: string;
  dateOfBirth: string;
  isDisabled: boolean;
  disabledReason: string | null;
  role: "CUSTOMER" | "LEADER";
  customers: any | null;
  leaders: any | null;
};

type Product = {
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalPrice: number;
  description: string;
  isCustomerPaying: boolean;
};
