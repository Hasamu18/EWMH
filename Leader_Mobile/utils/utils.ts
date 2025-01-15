import { cancelledData, completedData, inprogressData, newData } from "@/constants/status";
import { useEffect } from "react";
import { Alert, Linking } from "react-native";

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
}

export const formatCurrency = (
    amount: number | null | undefined,
    locale: "vi-VN" = "vi-VN"
  ) => {
    let returnAmount = 0;
  
    if (amount === null || amount === undefined) {
      return returnAmount.toLocaleString(locale, {
        style: "currency",
        currency: "VND",
        currencyDisplay: "code" 
      });
    }
  
    if (locale === "vi-VN") {
      returnAmount = amount;
    }
  
    return returnAmount.toLocaleString(locale, {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code"
    });
  };
  
  export const getTimelineData = (status : string) => {
    switch (status) {
      case 'Hoàn Thành':
        return completedData;
      case 'Đã Hủy':
        return cancelledData;
      case 'Đang Thực Hiện':
        return inprogressData;
      case 'Yêu Cầu Mới':
        return newData;
      default:
        console.warn("No matching status found, returning empty array.");
        return []; 
    }
  };

  export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  export const validatePhone = (phone: string) => {
    // Define a regex pattern for Vietnamese phone numbers
    const phonePattern = /^0[35789][0-9]{8,9}$/;
  
    // Test the input phone number against the pattern
    return phonePattern.test(phone);
  };


  export const getStatusDetails = (status: number) => {
    switch (status) {
      case 0:
        return "Yêu Cầu Mới" 
      case 1:
        return "Đang Thực Hiện"
      case 2:
        return "Hoàn Thành"
      case 3:
        return "Đã Hủy"
      default:
        return "Không Xác Định"
    }
  };

  export const getOrderStatusDetails = (status: number | undefined) => {
    switch (status) {
      case 0:
        return "Đơn Hàng Mới" 
      case 1:
        return "Đã Tiếp Nhận"
      case 2:
        return "Đang Giao Hàng"
      case 3:
        return "Đã Hoàn Thành"
      case 4:
        return "Trì Hoãn"
      default:
        return "Không Xác Định"
    }
  };

  export const getCategoryRequest = (status: number) => {
    switch (status) {
      case 0:
        return "Bảo Hành" 
      case 1:
        return "Sửa Chữa"
      default:
        return "Không xác định"
    }
  };

  export const handlePhonePress = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert("Lỗi", "Đã xảy ra sự cố khi mở trình quay số.");
    });
  };
  
  
  export const useFakeLoading = (setLoadingFunction : any, timeoutDuration = 7000) => {
    useEffect(() => {
      const timer = setTimeout(() => setLoadingFunction(false), timeoutDuration);
      return () => clearTimeout(timer);
    }, [setLoadingFunction, timeoutDuration]);
  };

  export const useDelayEmptyState = (setDelayEmptyState : any, timeoutDuration = 7000) => {
    useEffect(() => {
      const timer = setTimeout(() => setDelayEmptyState(false), timeoutDuration);
      return () => clearTimeout(timer);
    }, [setDelayEmptyState, timeoutDuration]);
  };

export function getContractStatus(orderCode : number | null, remainingNumOfRequests: number) {
    switch (true) {
      case (orderCode === 2):
        return "Chờ Kí";
      case ((orderCode !== 2 || orderCode === null) && remainingNumOfRequests === 0):
        return "Hết Hạn";
      case ((orderCode !== 2 || orderCode === null) && remainingNumOfRequests !== 0):
        return "Đã Duyệt";
      default:
        return "Unknown Status";
    }
}

export function getPaymentType(isOnlinePayment : boolean) {
  switch (true) {
    case (isOnlinePayment === true):
      return "Online";
    case (isOnlinePayment === false):
      return "Tiền mặt";
    default:
      return "Unknown Status";
  }
}

export const isEvidenceProvided = (url: string | null): boolean => {
  return url !== null && url.trim() !== "";
};

  