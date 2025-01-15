import { useGlobalState } from "@/context/GlobalProvider";
import useAxios from "@/utils/useRequestAxios";
import { useState } from "react";

export function useRequest() {
  const { fetchData, error } = useAxios();
  const [customerProblemError, setCustomerProblemError] = useState("");
  const {
    homeRequest,
    newRequests,
    inProgressRequests,
    completedRequests,
    cancelledRequests,
    selectedRequestFilter,
    sethomeRequest,
    setNewRequests,
    setInProgressRequests,
    setCompletedRequests,
    setCancelledRequests,
    setSelectedRequestFilter,
  } = useGlobalState();

  const handleGetHomeRequest = async () => {
    const response = await fetchData({
      url: "/request/7",
      method: "GET",
      params: {
        status: null,
        startDate: null,
      },
    });

    if (response) {
      sethomeRequest(response);
    } else {
      sethomeRequest([]);
      console.log("Failed to fetch new requests for home");
      console.log("Request Error", error);
    }
  };

  const handleGetRequestDetail = async (requestId: string) => {
    const response = await fetchData({
      url: `/request/19`,  
      method: "GET", 
      params: {
        requestId
      }          
    });
  
    if (response) {
      console.log("Request detail fetch sucessfully:", response);
      return response;
    } else {
      console.log("Failed to fetch request detail");
      console.log("Fetch detail error:", error);
    }
  };

  const handleCancelRequest = async ( data : {requestId: string, conclusion: string} ) => {
    const response = await fetchData({
      url: "/request/4",
      method: "DELETE",
      data: data,
    });

    if (response) {
      return response;
    } else {
      console.log("Failed to cancel request");
      console.log("Cancel Request Error", error);
    }
  };

  const handleGetRequestList = async (data: { status: number }) => {
    const response = await fetchData({
      url: "/request/7",
      method: "GET",
      params: {
        status: data.status,
        startDate: selectedRequestFilter || null,
      },
    });

    if (response) {
      switch (data.status) {
        case 0:
          setNewRequests(response);
          break;
        case 1:
          setInProgressRequests(response);
          break;
        case 2:
          setCompletedRequests(response);
          break;
        case 3:
          setCancelledRequests(response);
          break;
        default:
          console.log("Unknown status");
          console.log("Request Error", error);
          break;
      }
    } else {
      console.log("Failed to fetch all requests");
      console.log("All Request Error", error);
    }
  };

  const handleGetCustomerRooms = async (email_Or_Phone: string) => {
    const response = await fetchData({
      url: `/request/1`,
      method: "GET",
      params: {
        email_Or_Phone: email_Or_Phone || ""
      }
    });
    if (response) {
      return response;
    } else {
      console.log("Failed to fetch customer's rooms");
      console.log("Customer Room Error", error);
    }
  };

  const handleCreateRequest = async (data: {
    customerId: string;
    roomId: string;
    customerProblem: string;
    categoryRequest: number;
  }) => {
    setCustomerProblemError("");

    if (!data.customerProblem) {
      setCustomerProblemError("Yêu cầu khách hàng không được để trống");
      console.log("Customer Problem Error")
      return;
    }

    const formData = new FormData();
    formData.append("customerId", data.customerId);
    formData.append("roomId", data.roomId);
    formData.append("customerProblem", data.customerProblem);
    formData.append("categoryRequest", data.categoryRequest.toString());

    const response = await fetchData({
      url: "/request/2",
      method: "POST",
      data: formData,
      header: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response) {
      return response;
    } else {
      console.error("Create Response Error", error);
      return null;
    }
  };

  const handleRequestUpdate = async (data: { requestId: string; roomId: string; customerProblem: string }) => {
    console.log("Data in Update:", data)
    setCustomerProblemError("");

    if (!data.customerProblem) {
      setCustomerProblemError("Yêu cầu khách hàng không được để trống");
      return;
    }

    console.log("Update Data:",data)
    const response = await fetchData({
      url: `/request/3`,  
      method: "PUT",           
      data: {
        requestId: data.requestId,
        roomId: data.roomId,
        customerProblem: data.customerProblem,
      },
    });
  
    if (response) {
      console.log("Request updated successfully:", response);
      return response;
    } else {
      console.log("Failed to update the request");
      console.log("Update Request Error:", error);
    }
  };
  


  return {
    homeRequest,
    selectedRequestFilter,
    newRequests,
    inProgressRequests,
    completedRequests,
    cancelledRequests,
    customerProblemError,
    handleGetRequestList,
    handleGetHomeRequest,
    setSelectedRequestFilter,
    handleGetCustomerRooms,
    handleCreateRequest,
    handleCancelRequest,
    handleRequestUpdate,
    handleGetRequestDetail
  };
}
