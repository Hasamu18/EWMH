interface WorkerInfo {
    accountId: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    avatarUrl: string;
    dateOfBirth: string;
  }
  
  interface Worker {
    requestId?: string;
    workerId: string;
    workerInfo: WorkerInfo;
    isLead?: boolean
  }
  
// interface RequestedWorker {
//   accountId: string;
//   fullName: string;
//   email: string;
//   password: string;
//   phoneNumber: string;
//   avatarUrl: string;
//   dateOfBirth: string;
//   isLead?: boolean
// }

  export { Worker, WorkerInfo };