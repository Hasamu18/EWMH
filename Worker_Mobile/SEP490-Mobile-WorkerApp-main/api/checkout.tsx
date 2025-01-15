import { CHECKOUT_REPAIR_REQUEST } from "@/constants/Endpoints";
import { CheckoutRequest } from "@/models/CheckoutRequest";
import { GetAccessToken } from "@/utils/TokenUtils";

export async function API_Checkout(
  checkoutRequest: CheckoutRequest
): Promise<string> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${CHECKOUT_REPAIR_REQUEST}`;
    const formData = new FormData();
    formData.append(`requestId`, checkoutRequest.requestId);
    formData.append(`conclusion`, checkoutRequest.conclusion);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.text()}`);
    }
    const result = await response.text();
    return result;
  } catch (error) {
    throw error;
  }
}
