import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  createRequestCustomer: undefined;
  createRequest: { customerId: string; roomId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}