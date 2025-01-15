import { useGlobalState } from "@/context/GlobalProvider";
import { Contract } from "@/model/contract";
import useAxios from "@/utils/useSaleAxios";

export function useContract() {
  const { fetchData, error } = useAxios();
  const { contracts, setContracts,        
    pendingContracts,
    setPendingContracts,
    validContracts,
    setValidContracts,
    expiredContracts,
    setExpiredContracts, searchContractQuery, setSearchContractQuery } = useGlobalState();

  const handleGetPendingContract = async () => {
    try {
      const response = await fetchData({
        url: "/service-package/13",
        method: "GET",
        params: {
          phone: searchContractQuery
        }
      });

      if (response) {
        setPendingContracts(response);
        setContracts((prevContracts: Contract[]) => [
          ...prevContracts,
          ...response,
        ] as Contract[]);
      } else {
        setPendingContracts([]);
        console.error(
          "No contracts found or failed response:",
          response || error
        );
        return;
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      return;
    }
  };

  const handleGetValidContract = async () => {
    try {
      const response = await fetchData({
        url: "/service-package/15",
        method: "GET",
        params: {
          phone: searchContractQuery
        }
      });

      if (response) {
        setValidContracts(response);
        setContracts((prevContracts: Contract[]) => [
          ...prevContracts,
          ...response,
        ] as Contract[]);
      } else {
        setPendingContracts([]);
        console.error(
          "No contracts found or failed response:",
          response || error
        );
        return;
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      return;
    }
  };

  const handleGetExpiredContract = async () => {
    try {
      const response = await fetchData({
        url: "/service-package/16",
        method: "GET",
        params: {
          phone: searchContractQuery
        }
      });

      if (response) {

        setExpiredContracts(response);

        setContracts((prevContracts: Contract[]) => [
          ...prevContracts,
          ...response,
        ] as Contract[]);
      } else {
        setPendingContracts([]);
        console.error(
          "No contracts found or failed response:",
          response || error
        );
        return;
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      return;
    }
  };

  const handleScanContract = async (data: {
    ContractId: string;
    File: { uri: string; name: string; type: string }; 
  }) => {
    const formData = new FormData();
    formData.append("ContractId", data.ContractId);
  
    formData.append("File", {
      uri: data.File.uri,
      name: data.File.name,
      type: data.File.type,
    } as any);
  
    try {
      const response = await fetchData({
        url: "/service-package/9", // Update with the correct endpoint if necessary
        method: "PUT",
        data: formData,
        header: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response) {
        return { success: true };
      } else {
        console.error("Error uploading contract", response);
        return { success: false };
      }
    } catch (err) {
      // Catch any error during the file upload process
      console.error("Error uploading contract", err);
      return { success: false };
    }
  };

  const handleCancelContract = async ( contractId: string ) => {

    const formData = new FormData();
    formData.append("ContractId", contractId);

    const response = await fetchData({
      url: "/service-package/10",
      method: "DELETE",
      data: formData,
      header: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response) {
      return response;
    } else {
      console.log("Failed to cancel contract");
      console.log("Cancel Contract Error", error);
    }
  };

  return {
    contracts,
    pendingContracts,
    validContracts,
    expiredContracts,
    searchContractQuery,
    setSearchContractQuery,
    setContracts,
    handleGetPendingContract,
    handleGetValidContract,
    handleGetExpiredContract,
    handleScanContract,
    handleCancelContract
  };
}
