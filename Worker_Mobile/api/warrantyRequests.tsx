import {
  ADD_WARRANTY_CARD_TO_WARRANTY_REQUEST_ENDPOINT,
  GET_WARRANTY_CARD_DETAILS_ENDPOINT,
  REMOVE_WARRANTY_CARD_FROM_WARRANTY_REQUEST_ENDPOINT,
} from "@/constants/Endpoints";
import { AddWarrantyCardRequest } from "@/models/AddWarrantyCardRequest";
import { RemoveWarrantyCardRequest } from "@/models/RemoveWarrantyCardRequest";
import { WarrantyCardDetailsModel } from "@/models/WarrantyCardDetailsModel";
import { GetAccessToken } from "@/utils/TokenUtils";

export async function API_WarrantyRequests_GetCardById(
  warrantyCardId: string
): Promise<WarrantyCardDetailsModel> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${GET_WARRANTY_CARD_DETAILS_ENDPOINT}?warrantyCardId=${warrantyCardId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json();
    const warrantyCardDetails = json as WarrantyCardDetailsModel;
    return warrantyCardDetails;
  } catch (error) {
    throw error;
  }
}

export async function API_WarrantyRequests_AddCardToRequest(
  request: AddWarrantyCardRequest
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${ADD_WARRANTY_CARD_TO_WARRANTY_REQUEST_ENDPOINT}`;
    const body = JSON.stringify(request);
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

export async function API_WarrantyRequests_RemoveCardFromRequest(
  request: RemoveWarrantyCardRequest
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${REMOVE_WARRANTY_CARD_FROM_WARRANTY_REQUEST_ENDPOINT}`;
    const body = JSON.stringify(request);
    const formData = new FormData();
    formData.append(`requestId`, request.requestId);
    formData.append(`warrantyCardId`, request.warrantyCardId);

    const response = await fetch(url, {
      method: "DELETE",
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
