import {
  ADD_POST_REPAIR_EVIDENCE,
  ADD_PRE_REPAIR_EVIDENCE,
  ADD_PRODUCT_TO_REPAIR_REQUEST,
  CANCEL_REQUEST,
  COMPLETE_REPAIR_REQUEST,
  DELETE_REPLACEMENT_PRODUCT_IN_REPAIR_REQUEST,
  GET_REPAIR_REQUEST_BY_ID_ENDPOINT,
  GET_REPAIR_REQUESTS_ENDPOINT,
  UPDATE_REPLACEMENT_PRODUCT_IN_REPAIR_REQUEST,
} from "@/constants/Endpoints";
import { CancelRequest } from "@/models/CancelRequest";
import { CompleteRequest } from "@/models/CompleteRequest";
import { NewReplacementProductRequest } from "@/models/NewReplacementProductRequest";
import { Request } from "@/models/Request";
import { RequestDetails } from "@/models/RequestDetails";
import { UpdateReplacementProductRequest } from "@/models/UpdateReplacementProductRequest";
import { GetAccessToken } from "@/utils/TokenUtils";

export async function API_Requests_GetAll(
  requestType: number
): Promise<Request[]> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${GET_REPAIR_REQUESTS_ENDPOINT}?requestType=${requestType}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json();
    const requests = json as Request[];
    return requests;
  } catch (error) {
    return [];
  }
}

export async function API_Requests_GetById(
  requestId: string
): Promise<RequestDetails | undefined> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${GET_REPAIR_REQUEST_BY_ID_ENDPOINT}?requestId=${requestId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json();
    const requests = json as RequestDetails;
    return requests;
  } catch (error) {
    return undefined;
  }
}

export async function API_Requests_AddProductToRequest(
  newReplacementProductRequest: NewReplacementProductRequest
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${ADD_PRODUCT_TO_REPAIR_REQUEST}`;
    const body = JSON.stringify(newReplacementProductRequest);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function API_Requests_UpdateReplacementProduct(
  updateReplacementProductRequest: UpdateReplacementProductRequest
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${UPDATE_REPLACEMENT_PRODUCT_IN_REPAIR_REQUEST}`;
    const body = JSON.stringify(updateReplacementProductRequest);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function API_Requests_DeleteReplacementProduct(
  requestDetailId: string
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${DELETE_REPLACEMENT_PRODUCT_IN_REPAIR_REQUEST}`;
    const body = JSON.stringify(requestDetailId);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function API_Requests_CompleteRequest(
  completeRequest: CompleteRequest
): Promise<string> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${COMPLETE_REPAIR_REQUEST}`;
    const body = JSON.stringify(completeRequest);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function API_Requests_CompleteWarrantyRequest(
  completeRequest: CompleteRequest
): Promise<string> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${COMPLETE_REPAIR_REQUEST}`;
    const body = JSON.stringify(completeRequest);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function API_Requests_CancelRequest(
  cancelRequest: CancelRequest
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${CANCEL_REQUEST}`;
    const body = JSON.stringify(cancelRequest);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function API_Requests_AddPreRepairEvidence(
  requestId: string,
  photoUri: string
): Promise<Response> {
  try {
    const url = `${ADD_PRE_REPAIR_EVIDENCE}`;
    const accessToken = await GetAccessToken();
    const formData = new FormData();
    formData.append("RequestId", requestId);
    formData.append("File", {
      uri: photoUri,
      name: "evidence.pdf",
      type: "application/pdf",
    } as any); // Casting to any to bypass TypeScript issue

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function API_Requests_AddPostRepairEvidence(
  requestId: string,
  pdfUri: string
): Promise<Response> {
  try {
    const url = `${ADD_POST_REPAIR_EVIDENCE}`;
    const accessToken = await GetAccessToken();
    const formData = new FormData();
    formData.append("RequestId", requestId);
    formData.append("File", {
      uri: pdfUri,
      name: "evidence.pdf",
      type: "application/pdf",
    } as any); // Casting to any to bypass TypeScript issue

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
