import { aparmentArea } from "./aparmentArea";
import { Customer } from "./customer";
import { Product } from "./product";
import { Worker } from "./worker";

export interface Request {
  get:{
    requestId: string; 
    customerProblem: string;
    contractId: string | null; 
    start: string;
    roomId: string;
    end?: string | null; 
    totalPrice?: number | null; 
    categoryRequest: number; 
    status: number; 
    conclusion?: string | null;
    fileUrl?: string;
    preRepairEvidenceUrl: string | null,
    postRepairEvidenceUrl: string | null,
  }
  getCustomer: Customer
  getApartment: aparmentArea
}


// export interface RequestDetails{
//   request:{
//     totalPrice: number,
//     purchaseTime: string
//   }
//  workerList: Worker[]
//  productList: Product[]
// }

export type RequestDetails = [
  {
    request:{
      totalPrice: number,
      purchaseTime: string
    }
    productList: Product[],
    workerList: Worker[]
  }
]