import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT } from "@/constants/Endpoints";
import { LoginRequest } from "@/models/LoginRequest";
import { GetAccessToken } from "@/utils/TokenUtils";

export async function API_Login(LoginRequest: LoginRequest) {
  try {
    const reqBody = JSON.stringify({
      Email_Or_Phone: LoginRequest?.emailOrPhone,
      password: LoginRequest?.password,
    });
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: reqBody,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function API_Logout() {
  try {
    const accessToken = await GetAccessToken();
    const response = await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json();
    console.log("json body after logout: ", json);
    return json;
  } catch (error) {
    throw error;
  }
}
