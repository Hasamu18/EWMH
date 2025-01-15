import { Tokens } from "@/models/Tokens";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
export async function StoreTokens(response: Tokens): Promise<void> {
  const tokens = JSON.stringify(response);
  await SecureStore.setItemAsync("tokens", tokens);
}

export async function GetTokens(): Promise<Tokens> {
  const tokensStr = await SecureStore.getItemAsync("tokens");
  const tokens: Tokens = JSON.parse(tokensStr as string);
  return tokens;
}

export async function RemoveTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync("tokens");
    console.log("Token removed successfully.");
  } catch (error) {
    console.error("Error removing token from SecureStore:", error);
  }
}

export async function ChangeAutoLoginMode(mode: number) {
  await SecureStore.setItemAsync("autoLogin", mode.toString());
}

export async function GetAutoLoginMode(): Promise<string> {
  const mode = await SecureStore.getItemAsync("autoLogin");
  return mode === null ? "" : mode;
}

export async function DecodeToken(token: string) {
  const user = jwtDecode(token);
  return user;
}

export async function GetAccessToken() {
  const tokens = await GetTokens();
  return tokens.at;
}
