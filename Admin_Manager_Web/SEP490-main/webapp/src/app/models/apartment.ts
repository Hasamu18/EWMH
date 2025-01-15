import { User } from "./user";

export type Apartment = {
  areaId: string;
  leaderId: string;
  account: User;
  name: string;
  description: string;
  address: string;
  managementCompany: string;
  avatarUrl: string;
  roomIds: string[];
};
