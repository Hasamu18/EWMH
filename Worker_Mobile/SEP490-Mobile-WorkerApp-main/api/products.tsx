import { PRODUCT_BY_ID_ENDPOINT } from "@/constants/Endpoints";

import { ProductDetails } from "@/models/ProductDetails";
import { GetAccessToken } from "@/utils/TokenUtils";

// export async function API_Products_GetAll(
//   searchParams: ProductSearchParams
// ): Promise<ProductsResponse> {
//   try {
//     const PARAM_LIST = BuildSearchParams(searchParams);
//     const accessToken = await GetAccessToken();
//     const response = await fetch(PRODUCTS_ENDPOINT + PARAM_LIST, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const json = await response.json();
//     const products = json as ProductsResponse;
//     return products;
//   } catch (error) {
//     throw error;
//   }
// }
export async function API_Products_GetById(
  id: string
): Promise<ProductDetails> {
  try {
    const url = `${PRODUCT_BY_ID_ENDPOINT}?ProductId=${id}`;
    const accessToken = await GetAccessToken();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json();
    const productById = json as ProductDetails;
    return productById;
  } catch (error) {
    throw error;
  }
}
