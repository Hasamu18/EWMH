import { Contract } from "@/model/contract";
import { Product } from "@/model/product";
import { Request } from "@/model/request";
import { User } from "@/model/user";
import { Worker } from "@/model/worker";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { NotificationItem } from "@/model/notification";
import { ShippingOrder } from "@/model/order";


interface GlobalStateContextProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;

  selectedStatus: number;
  setSelectedStatus: (value: number) => void;

  loading: boolean;
  setLoading: (value: boolean) => void;

  selectedProductFilter: boolean | null;
  setSelectedProductFilter: (value: boolean | null) => void;

  selectedRequestFilter: string;
  setSelectedRequestFilter: (value: string) => void;

  userInfo: User | null;
  setUserInfo: (value: User | null) => void;

  homeRequest: Request[];
  sethomeRequest: (value: Request[]) => void;

  newRequests: Request[];
  setNewRequests: (value: Request[]) => void;

  inProgressRequests: Request[];
  setInProgressRequests: (value: Request[]) => void;

  completedRequests: Request[];
  setCompletedRequests: (value: Request[]) => void;

  cancelledRequests: Request[];
  setCancelledRequests: (value: Request[]) => void;

  freeWorker: Worker[];
  setFreeWorker: (value: Worker[]) => void;

  busyWorker: Worker[];
  setBusyWorker: (value: Worker[]) => void;

  worker: Worker[];
  setWorker: (value: Worker[]) => void;

  products: Product[];
  setProducts: (value: Product[]) => void;

  searchProductQuery: string;
  setSearchProductQuery: (value: string) => void;

  searchContractQuery: string;
  setSearchContractQuery: (value: string) => void;

  contracts: Contract[];
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;

  pendingContracts: Contract[];
  setPendingContracts: (value: Contract[]) => void;

  validContracts: Contract[];
  setValidContracts: (value: Contract[]) => void;

  expiredContracts: Contract[];
  setExpiredContracts: (value: Contract[]) => void;

  orders: ShippingOrder[];
  setOrders: (value: ShippingOrder[]) => void;

  searchOrderQuery: string;
  setSearchOrderQuery: (value: string) => void;

  expoPushToken: string | null;
  setExpoPushToken: (value: string | null) => void;

  notification: Notifications.Notification | undefined;
  setNotification: (value: Notifications.Notification | undefined) => void;

  notificationList: NotificationItem[];
  setNotificationList: (value: NotificationItem[]) => void;
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(
  undefined
);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState<
    boolean | null
  >(null);
  const [selectedRequestFilter, setSelectedRequestFilter] = useState("");
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [newRequests, setNewRequests] = useState<Request[]>([]);
  const [inProgressRequests, setInProgressRequests] = useState<Request[]>([]);
  const [completedRequests, setCompletedRequests] = useState<Request[]>([]);
  const [cancelledRequests, setCancelledRequests] = useState<Request[]>([]);
  const [homeRequest, sethomeRequest] = useState<Request[]>([]);
  const [worker, setWorker] = useState<Worker[]>([]);
  const [freeWorker, setFreeWorker] = useState<Worker[]>([]);
  const [busyWorker, setBusyWorker] = useState<Worker[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [searchContractQuery, setSearchContractQuery] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [pendingContracts, setPendingContracts] = useState<Contract[]>([]);
  const [validContracts, setValidContracts] = useState<Contract[]>([]);
  const [expiredContracts, setExpiredContracts] = useState<Contract[]>([]);
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [searchOrderQuery, setSearchOrderQuery] = useState("");
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [selectedStatus, setSelectedStatus] = useState(0);


  return (
    <GlobalStateContext.Provider
      value={{
        selectedStatus,
        setSelectedStatus,
        worker,
        setWorker,
        searchOrderQuery,
        setSearchOrderQuery,
        orders,
        setOrders,
        notificationList,
        setNotificationList,
        pendingContracts,
        setPendingContracts,
        validContracts,
        setValidContracts,
        expiredContracts,
        setExpiredContracts,
        expoPushToken,
        setExpoPushToken,
        notification,
        setNotification,
        contracts,
        setContracts,
        searchContractQuery,
        setSearchContractQuery,
        searchProductQuery,
        setSearchProductQuery,
        products,
        setProducts,
        busyWorker,
        setBusyWorker,
        freeWorker,
        setFreeWorker,
        homeRequest,
        sethomeRequest,
        userInfo,
        setUserInfo,
        selectedRequestFilter,
        setSelectedRequestFilter,
        isSheetOpen,
        setIsSheetOpen,
        loading,
        setLoading,
        selectedProductFilter,
        setSelectedProductFilter,
        newRequests,
        setNewRequests,
        inProgressRequests,
        setInProgressRequests,
        completedRequests,
        setCompletedRequests,
        cancelledRequests,
        setCancelledRequests,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
};
