import { aparmentArea } from "./aparmentArea";
import { Shipping } from "./order";


  export interface Customer {
    accountId?: string; 
    fullName: string; 
    email?: string; 
    phoneNumber?: string; 
    avatarUrl: string; 
    dateOfBirth?: string | null; 
    isDisabled?: boolean; 
    disabledReason?: string | null; 
    role?: string;
    cmT_CCCD?: string
    shipping: Shipping
  }

  export interface CustomerRooms {
    existingUser: Customer[]
    getRooms: {
      roomId: string
      areaId: string
      customerId: string
      area: aparmentArea
      customer: string
    }[]
  }