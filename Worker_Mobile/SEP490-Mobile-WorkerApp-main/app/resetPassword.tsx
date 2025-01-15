import ResetPasswordForm from "@/components/resetPassword/ResetPasswordForm";
import { Text } from "native-base";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ResetPasswordScreen() {
  return (
    <View style={styles.container}>
      <PromptText />

      <ResetPasswordContainer />
    </View>
  );
}
function PromptText() {
  return (
    <View style={styles.promptTextContainer}>
      <Text fontSize="xl">
        Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đây.
      </Text>
    </View>
  );
}
function ResetPasswordContainer() {
  return (
    <View style={styles.resetPasswordContainer}>
      <ResetPasswordForm />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
  },
  resetPasswordContainer: {
    flex: 8,
    width: "100%",
  },

  promptTextContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
