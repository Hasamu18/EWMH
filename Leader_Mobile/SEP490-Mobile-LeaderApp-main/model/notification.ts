export interface NotificationItem {
    id: string;
    title: string;
    body: string;
    timestamp: any; 
    read: boolean;
    data?: { requestId?: string, contractId?: string, orderId?: string}
  }

export interface Message {
    to?:  string,
    sound?: string,
    title?: string,
    body?: string,
    data?: { requestId?: string, contractId?: string },
    channelId?: string,
  };

  export type PushNotificationRecord = {
    exponentPushToken: string;
    leaderId: string;
    date: string;
  };

  export type PushNotificationWorkerRecord = {
    exponentPushToken: string;
    workerId: string;
    date: string;
  };

  export type PushNotificationCustomerRecord = {
    exponentPushToken: string;
    customerId: string;
    date: string;
  };