import {
  API_User_GetNewAccessToken,
  API_User_ValidateAccessToken,
} from "@/api/user";
import LoginForm from "@/components/login/LoginForm";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import { UNAUTHORIZED } from "@/constants/HttpCodes";
import { Tokens } from "@/models/Tokens";
import { useIsLoadingContext } from "@/redux/providers/IsLoadingProvider";
import { GetAutoLoginMode } from "@/utils/TokenUtils";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Text, VStack } from "native-base";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const { isLoading, enableIsLoading, disableIsLoading } =
    useIsLoadingContext();
  const IsAccessTokenValid = async (): Promise<boolean> => {
    const response = await API_User_ValidateAccessToken();
    if (response.status === UNAUTHORIZED) return false;
    return true;
  };
  const GetNewAccessToken = async (): Promise<void> => {
    const tokensStr = await SecureStore.getItemAsync("tokens");
    const oldTokens: Tokens = JSON.parse(tokensStr as string);
    const response = await API_User_GetNewAccessToken(oldTokens);
    const newTokens = JSON.stringify(response);
    await SecureStore.setItemAsync("tokens", newTokens);
  };
  const validateAndRefreshToken = async () => {
    const isTokenValid = await IsAccessTokenValid();
    if (!isTokenValid) await GetNewAccessToken();
    console.log("Returning redirect!", isTokenValid);
    router.navigate("/(tabs)/home");
  };
  const handlePreLogin = async () => {
    try {
      enableIsLoading();
      const autoLoginMode = await GetAutoLoginMode();
      console.log("autoLoginMode!: ", autoLoginMode);
      if (autoLoginMode === "1") {
        await validateAndRefreshToken();
      }
    } catch {
    } finally {
      disableIsLoading();
    }
  };
  useEffect(() => {
    handlePreLogin();
  }, []);
  return (
    <>
      {isLoading ? (
        <FullScreenSpinner />
      ) : (
        <View style={styles.container}>
          <WelcomeText />
          <LoginFormContainer />
        </View>
      )}
    </>
  );
}
function WelcomeText() {
  return (
    <VStack style={styles.welcomeText}>
      <Text fontWeight="bold" fontSize="2xl">
        Xin chào bạn!
      </Text>
      <Text fontSize="xl" textAlign="center">
        Hãy đăng nhập để quản lý công việc.
      </Text>
    </VStack>
  );
}
function LoginFormContainer() {
  return (
    <View style={styles.loginForm}>
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
  },

  welcomeText: {
    flex: 3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loginForm: {
    flex: 7,
    width: "100%",
  },
});
