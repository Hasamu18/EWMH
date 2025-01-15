import Colors from "./Colors";

export const WARRANTY_REQUEST = 0;
export const REPAIR_REQUEST = 1;

export const NEW_REQUEST = 0;
export const IN_PROGRESS = 1;
export const COMPLETED = 2;
export const CANCELED = 3;



export type RepairRequestStatus = {
  key: number;
  value: string;
  color: string;
  textColor: string;
};


export const REPAIR_REQUEST_STATUSES: RepairRequestStatus[] = [
  {
    key: NEW_REQUEST,
    value: "Yêu cầu mới",
    color: Colors.ewmh.requestStatus.newRequest,
    textColor: Colors.ewmh.requestStatus.newRequestText,
  },
  {
    key: IN_PROGRESS,
    value: "Đang thực hiện",
    color: Colors.ewmh.requestStatus.inProgress,
    textColor: Colors.ewmh.requestStatus.inProgressText,
  },
  {
    key: COMPLETED,
    value: "Đã hoàn thành",
    color: Colors.ewmh.requestStatus.completed,
    textColor: Colors.ewmh.requestStatus.completedText,
  },
   {
    key: CANCELED,
    value: "Đã hủy",
    color: Colors.ewmh.danger1,
    textColor: Colors.ewmh.requestStatus.completedText,
  },
];