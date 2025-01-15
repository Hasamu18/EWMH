import {
  GET_SHIPPING_ORDER_DETAILS,
  GET_SHIPPING_ORDERS,
  SHIPPING_ASSIGNED_TO_DELIVERING_STATUS,
  SHIPPING_DELIVERING_TO_DELAYED_STATUS,
  SHIPPING_DELIVERING_TO_DELIVERED_STATUS,
} from "@/constants/Endpoints";
import { ShippingOrder } from "@/models/ShippingOrder";
import { ShippingOrderDetails } from "@/models/ShippingOrderDetails";
import { DecodeToken, GetAccessToken } from "@/utils/TokenUtils";

export async function API_Shipping_GetShippingOrderDetails(
  orderId: string
): Promise<ShippingOrderDetails | undefined> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${GET_SHIPPING_ORDER_DETAILS}?OrderId=${orderId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    return result.order;
  } catch (error) {
    return undefined;
  }
}

export async function API_Shipping_GetShippingOrders(
  shippingId?: string
): Promise<ShippingOrder[]> {
  try {
    const accessToken = await GetAccessToken();
    const workerId = await getWorkerId(accessToken);
    let url = `${GET_SHIPPING_ORDERS}?WorkerId=${workerId}`;
    if (shippingId !== undefined && shippingId !== null) {
      url += `&ShippingId=${shippingId}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return [];
  }
}

export async function API_Shipping_ContinueShipping(
  shippingId: string
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const body = JSON.stringify({
      shippingId: shippingId,
    });
    const url = `${SHIPPING_ASSIGNED_TO_DELIVERING_STATUS}`;
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

export async function API_Shipping_DelayShipping(
  shippingId: string
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${SHIPPING_DELIVERING_TO_DELAYED_STATUS}?ShippingId=${shippingId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

//TODO: Change the body of the CompleteShipping API.
export async function API_Shipping_CompleteShipping(
  shippingId: string,
  photoUri: string
): Promise<Response> {
  try {
    const url = `${SHIPPING_DELIVERING_TO_DELIVERED_STATUS}`;
    const accessToken = await GetAccessToken();
    const formData = new FormData();
    formData.append("ShippingId", shippingId);
    formData.append("File", {
      uri: photoUri,
      name: "evidence.jpg",
      type: "image/jpeg",
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

const getWorkerId = async (accessToken: string): Promise<string> => {
  const decodedToken = await DecodeToken(accessToken);
  const workerId = (decodedToken as any).accountId as string;
  return workerId;
};
