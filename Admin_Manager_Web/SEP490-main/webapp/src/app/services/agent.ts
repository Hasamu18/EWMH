import { userRequests, baseUserRequests } from "./users.Api";
import { requestRequests } from "./requests.Api";
import { saleRequests } from "./sales.Api";

//Users.Api
const ACCOUNT_BASE = "account";
const Account = {
  login: (data: any) => baseUserRequests.post(`${ACCOUNT_BASE}/1`, data),
  disableUser: (data: any) => userRequests.put(`${ACCOUNT_BASE}/2`, data),
  getAccountInfo: () => userRequests.get(`${ACCOUNT_BASE}/3`),
  updateAccountInfo: (data: any) => userRequests.put(`${ACCOUNT_BASE}/4`, data),
  updateAccountAvatar: (data: any) =>
    userRequests.put(`${ACCOUNT_BASE}/5`, data),
  createPersonnelAccount: (data: any) =>
    userRequests.post(`${ACCOUNT_BASE}/6`, data),
  getAllRole: () => baseUserRequests.get(`${ACCOUNT_BASE}/7`),
  sendPasswordResetLink: (data: any) =>
    baseUserRequests.post(`${ACCOUNT_BASE}/8`, data),
  resetPassword: (data: any) =>
    baseUserRequests.post(`${ACCOUNT_BASE}/9`, data),
  getAllAccountPaginated: (params: any) =>
    userRequests.get(`${ACCOUNT_BASE}/10`, params),
  refreshToken: (data: any) =>
    baseUserRequests.post(`${ACCOUNT_BASE}/11`, data),
  logout: (data: any) => userRequests.post(`${ACCOUNT_BASE}/12`, data),
  approveCustomerAccount: (data: any) =>
    userRequests.post(`${ACCOUNT_BASE}/13`, data),
  getAllLeaderPaginated: (params: any) =>
    userRequests.get(`${ACCOUNT_BASE}/14`, params),
  assignWorkerToLeader: (data: any) =>
    userRequests.post(`${ACCOUNT_BASE}/16`, data),
  getAllPendingAccountPaginated: (params: any) =>
    userRequests.get(`${ACCOUNT_BASE}/18`, params),
  getAllWorkerPaginated: (params: any) =>
    userRequests.get(`${ACCOUNT_BASE}/19`, params),
  getAllFreeLeaders: () => userRequests.get(`${ACCOUNT_BASE}/21`),
  getAllWorkerFromLeader: (params: any) =>
    userRequests.get(`${ACCOUNT_BASE}/22`, params),
};

const APARTMENT_BASE = "apartment";
const Apartment = {
  addApartment: (data: any) => userRequests.post(`${APARTMENT_BASE}/1`, data),
  updateApartment: (data: any) => userRequests.put(`${APARTMENT_BASE}/2`, data),
  addRooms: (data: any) => userRequests.post(`${APARTMENT_BASE}/3`, data),
  updateRoom: (data: any) => userRequests.put(`${APARTMENT_BASE}/4`, data),
  getAllApartmentPaginated: (params: any) =>
    userRequests.get(`${APARTMENT_BASE}/5`, params),
  getAllRoomPaginated: (params: any) =>
    userRequests.get(`${APARTMENT_BASE}/6`, params),
};

//Sales.Api
const ORDER_BASE = "order";
const Order = {
  addProductToCart: (data: any) => saleRequests.post(`${ORDER_BASE}/1`, data),
  getCart: () => saleRequests.get(`${ORDER_BASE}/2`),
  removeProductFromCart: (data: any) =>
    saleRequests.del(`${ORDER_BASE}/3`, data),
  getPaymentLinkForProductsInCart: (data: any) =>
    saleRequests.post(`${ORDER_BASE}/4`, data),
  onlinePaymentFinished: (data: any) =>
    saleRequests.post(`${ORDER_BASE}/5`, data),
  getAllOrderPaginated: (params: any) =>
    saleRequests.get(`${ORDER_BASE}/7`, params),
  getOrderDetails: (params: any) => saleRequests.get(`${ORDER_BASE}/8`, params),
  getAllRequestOrdersPaginated: (params: any) =>
    requestRequests.get(`${REQUEST_BASE}/24`, params),
  getTodaysOrdersPaginated: (params: any) =>
    saleRequests.get(`${ORDER_BASE}/9`, params),
};

const PRODUCT_BASE = "product";
const Product = {
  addProduct: (data: any) => saleRequests.post(`${PRODUCT_BASE}/1`, data),
  updateProduct: (data: any) => saleRequests.put(`${PRODUCT_BASE}/2`, data),
  disableProduct: (data: any) => saleRequests.put(`${PRODUCT_BASE}/3`, data),
  getProduct: (params: any) => saleRequests.get(`${PRODUCT_BASE}/4`, params),
  getAllProductPaginated: (params: any) =>
    saleRequests.get(`${PRODUCT_BASE}/5`, params),
  getRevenueAndNumberOfPurchaseOfProduct: (params: any) =>
    saleRequests.get(`${PRODUCT_BASE}/6`, params),
};

const SERVICEPAKAGE_BASE = "service-package";
const ServicePackage = {
  addServicePackage: (data: any) =>
    saleRequests.post(`${SERVICEPAKAGE_BASE}/1`, data),
  updateServicePackage: (data: any) =>
    saleRequests.put(`${SERVICEPAKAGE_BASE}/2`, data),
  disableServicePackage: (data: any) =>
    saleRequests.put(`${SERVICEPAKAGE_BASE}/3`, data),
  getServicePackage: (params: any) =>
    saleRequests.get(`${SERVICEPAKAGE_BASE}/4`, params),
  getAllServicePackagePaginated: (params: any) =>
    saleRequests.get(`${SERVICEPAKAGE_BASE}/5`, params),
  getDraftContract: (params: any) =>
    saleRequests.get(`${SERVICEPAKAGE_BASE}/6`, params),
  getPaymentType: (data: any) =>
    saleRequests.post(`${SERVICEPAKAGE_BASE}/7`, data),
  onlinePaymentFinished: (data: any) =>
    saleRequests.post(`${SERVICEPAKAGE_BASE}/8`, data),
  updateContractImage: (data: any) =>
    saleRequests.put(`${SERVICEPAKAGE_BASE}/9`, data),
  cancelContract: (data: any) =>
    saleRequests.del(`${SERVICEPAKAGE_BASE}/10`, data),
  getAllContractsPaginated: (params: any) =>
    saleRequests.get(`${SERVICEPAKAGE_BASE}/14`, params),
  getRevenueAndNumberOfPurchaseOfServicePackage: (params: any) =>
    saleRequests.get(`${SERVICEPAKAGE_BASE}/18`, params),
  getContractDetails: (params: any) =>
    saleRequests.get(`${SERVICEPAKAGE_BASE}/19`, params),
};

//Requests.Api
const FEEDBACK_BASE = "feedback";
const Feedback = {
  getAllFeedbacksPaginated: (params: any) =>
    requestRequests.get(`${FEEDBACK_BASE}/1`, params),
  getFeedbackDetails: (params: any) =>
    requestRequests.get(`${FEEDBACK_BASE}/2`, params),
  approveFeedback: (data: any) =>
    requestRequests.post(`${FEEDBACK_BASE}/4`, data),
};

const REQUEST_BASE = "request";
const Request = {
  getAllRoomByCustomer: (params: any) =>
    requestRequests.get(`${REQUEST_BASE}/1`, params),
  createRequest: (data: any) => requestRequests.post(`${REQUEST_BASE}/2`, data),
  updateRequest: (data: any) => requestRequests.put(`${REQUEST_BASE}/3`, data),
  cancelRequest: (data: any) => requestRequests.del(`${REQUEST_BASE}/4`, data),
  addWorkerToRequest: (data: any) =>
    requestRequests.post(`${REQUEST_BASE}/5`, data),
  addProductToRequest: (data: any) =>
    requestRequests.post(`${REQUEST_BASE}/6`, data),
  getLeaderRequestList: (params: any) =>
    requestRequests.get(`${REQUEST_BASE}/7`, params),
  getCustomerRequestList: (params: any) =>
    requestRequests.get(`${REQUEST_BASE}/8`, params),
  getAllRequestsPaginated: (params: any) =>
    requestRequests.get(`${REQUEST_BASE}/18`, params),
  getDetailsOfRequest: (params: any) =>
    requestRequests.get(`${REQUEST_BASE}/25`, params),
  updatePriceOfRequest: (data: any) =>
    requestRequests.put(`${REQUEST_BASE}/26`, data),
  getAllTodaysRequestsPaginated: (params: any) =>
    requestRequests.get(`${REQUEST_BASE}/27`, params),
  getCurrentPriceOfRequest: () => requestRequests.get(`${REQUEST_BASE}/28`),
};

const STATISTIC_BASE = "Transaction";
const Transaction = {
  getStatistics: (params: any) =>
    requestRequests.get(`${STATISTIC_BASE}/1`, params),
  getStatisticsByMonth: (params: any) =>
    requestRequests.get(`${STATISTIC_BASE}/3`, params),
};

const agent = {
  Account,
  Apartment,
  Order,
  Product,
  ServicePackage,
  Request,
  Transaction,
  Feedback,
};
export default agent;
