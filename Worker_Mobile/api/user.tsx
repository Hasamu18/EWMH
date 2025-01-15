import {
  PROFILE_ENDPOINT,
  RENEW_ACCESS_TOKEN_ENDPOINT,
  SEND_RESET_PASSWORD_LINK_ENDPOINT,
  UPDATE_AVATAR_ENDPOINT,
  UPDATE_PROFILE_ENDPOINT,
} from "@/constants/Endpoints";
import { ProfileResponse } from "@/models/ProfileResponse";
import { Tokens } from "@/models/Tokens";
import { UpdateProfileRequest } from "@/models/UpdateProfileRequest";
import { GetAccessToken, GetTokens } from "@/utils/TokenUtils";

export async function API_User_GetProfile(): Promise<ProfileResponse> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${PROFILE_ENDPOINT}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

export async function API_User_UpdateAvatar(
  photoUri: string
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${UPDATE_AVATAR_ENDPOINT}`;
    const formData = new FormData();
    formData.append("photo", {
      uri: photoUri,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any); // Casting to any to bypass TypeScript issue

    const response = await fetch(url, {
      method: "PUT",
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

export async function API_User_UpdateProfile(
  updateProfileRequest: UpdateProfileRequest
): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${UPDATE_PROFILE_ENDPOINT}`;
    const formData = new FormData();
    formData.append(`fullName`, updateProfileRequest.fullName);
    formData.append(`email`, updateProfileRequest.email);
    formData.append(`dateOfBirth`, updateProfileRequest.dateOfBirth);
    const response = await fetch(url, {
      method: "PUT",
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

export async function API_User_SendPasswordResetLink(
  email: string
): Promise<Response> {
  try {
    const url = `${SEND_RESET_PASSWORD_LINK_ENDPOINT}`;
    const body = JSON.stringify({
      email: email,
    });
    console.log("Body:", body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: body,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function API_User_ValidateAccessToken(): Promise<Response> {
  try {
    const accessToken = await GetAccessToken();
    const url = `${PROFILE_ENDPOINT}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export async function API_User_GetNewAccessToken(tokens:Tokens): Promise<Tokens> {
  try {    
    const url = `${RENEW_ACCESS_TOKEN_ENDPOINT}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokens),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
