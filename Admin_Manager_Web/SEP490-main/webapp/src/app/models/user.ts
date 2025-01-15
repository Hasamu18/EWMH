export type User = {
  accountId: string;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  avatarUrl: string;
  dateOfBirth: string;
  isDisabled: boolean;
  disabledReason: string;
  role: string;
};

export type Leader = User & {
  leaderId: string;
  areaId: string;
  name: string;
};

export type FreeLeader = {
  accountId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  dateOfBirth: string;
};

export type Worker = {
  item: {
    accountId: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    avatarUrl: string;
    dateOfBirth: string;
    isDisabled: boolean;
    disabledReason: string | null;
    role: string;
    customers: null;
    leaders: null;
    workers: {
      workerId: string;
      leaderId: string;
      leader: Leader | null;
      requestWorkers: any[];
    } | null;
  };
  getLeaderInfo?: Leader;
};

export type Customer = User;

export type PendingCustomer = {
  get: {
    pendingAccountId: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: string;
    cmT_CCCD: string;
    roomIds: string[];
  };
  apartment: [
    {
      areaId: string;
      leaderId: string;
      name: string;
      description: string;
      address: string;
      managementCompany: string;
      avatarUrl: string;
      leader: User;
    },
  ];
};
