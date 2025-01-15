import useAxios from "@/utils/useUserAxios";
import { useGlobalState } from "@/context/GlobalProvider";
import { useState } from "react";

export function useLeader() {
  const { fetchData, error } = useAxios();
  const { setLoading, userInfo, setUserInfo } = useGlobalState();

  // Error states for validation and API errors
  const [validationErrors, setValidationErrors] = useState<{ fullName?: string; email?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleGetLeaderInfo = async () => {
    setLoading(true);
    setApiError(null); // Clear previous API error
    const response = await fetchData({
      url: "/account/3",
      method: "GET",
    });

    if (response) {
      setUserInfo(response.response);
      setLoading(false);
    } else {
      setApiError("Failed to fetch user information");
      setLoading(false);
    }
  };

  const handleUpdateLeaderInfo = async (data: { fullName: string; email: string; dateOfBirth: string }) => {
    setValidationErrors({});
    let isValid = true;

    // Validation
    const errors: { fullName?: string; email?: string } = {};
    if (!data.fullName) {
      errors.fullName = "Tên đầy đủ không được để trống";
      isValid = false;
    }
    if (!data.email) {
      errors.email = "Email không được để trống";
      isValid = false;
    }

    if (!isValid) {
      setValidationErrors(errors);
      return { success: false };
    }

    setLoading(true);
    setApiError(null);
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("dateOfBirth", data.dateOfBirth);

    const response = await fetchData({
      url: "/account/4",
      method: "PUT",
      data: formData,
      header: { 'Content-Type': 'multipart/form-data' },
    });

    if (response) {
      setUserInfo(response.response);
      return { success: true };
    } else {
      setApiError("Failed to update user information");
      return { success: false };
    }
  };

  const handleUpdateLeaderAvatar = async (data: { photo: string }) => {
    setApiError(null);

    const formData = new FormData();
    formData.append("photo", {
      uri: data.photo,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any);

    const response = await fetchData({
      url: "/account/5",
      method: "PUT",
      data: formData,
      header: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'text/plain',
      },
    });

    if (response) {
      setUserInfo(response);
      return { success: true };
    } else {
      setApiError("Failed to update avatar");
      return { success: false };
    }
  };

  return {
    handleUpdateLeaderAvatar,
    handleUpdateLeaderInfo,
    handleGetLeaderInfo,
    userInfo,
    validationErrors,
    apiError,
  };
}
