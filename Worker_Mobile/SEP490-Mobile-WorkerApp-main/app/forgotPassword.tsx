import { API_User_SendPasswordResetLink } from "@/api/user";
import CustomAlertDialogV2 from "@/components/shared/CustomAlertDialogV2";
import Colors from "@/constants/Colors";
import { SUCCESS } from "@/constants/HttpCodes";
import { Ionicons } from "@expo/vector-icons";
import { Button, Icon, Input, Text, VStack } from "native-base";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function ForgotPasswordScreen() {
  return (
    <View style={styles.container}>
      <PromptText />
      <EmailInputContainer />
    </View>
  );
}
function PromptText() {
  return (
    <VStack style={styles.promptText}>
      <Text fontWeight="bold" fontSize="2xl">
        Bạn đã quên mật khẩu?
      </Text>
      <Text fontSize="xl" textAlign="center" w="80%">
        Hãy nhập email của bạn để cài lại mật khẩu.
      </Text>
    </VStack>
  );
}
type EmailInputDefaultValue = {
  email: string;
};
function EmailInputContainer() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const [email, setEmail] = useState<string>();
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isResetLinkSentShown, setIsResetLinkSentShown] =
    useState<boolean>(false);
  const onSubmit = (data: EmailInputDefaultValue) => {
    setEmail(data.email);
    setIsSendingLink(true);
    console.log("email:", data.email);
    API_User_SendPasswordResetLink(data.email)
      .then((response) => {
        if (response.status !== SUCCESS) {
          response.text().then((txt) => {
            console.log("Đã có lỗi xảy ra.", txt);
          });
        } else {
          setIsResetLinkSentShown(true);
        }
      })
      .finally(() => {
        setIsSendingLink(false);
      });
  };
  return (
    <VStack w="100%" style={styles.emailInputContainer}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={styles.emailInput}
            numberOfLines={1}
            size="lg"
            placeholder="Địa chỉ Email"
            onChangeText={onChange}
            rightElement={
              <Icon
                as={Ionicons}
                name="mail-outline"
                style={{ marginRight: 10 }}
              />
            }
          />
        )}
        name="email"
      />
      <View style={styles.errorContainer}>
        {errors.email && (
          <Text style={styles.error}>Bạn phải nhập trường này.</Text>
        )}
      </View>
      {isSendingLink ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          variant="solid"
          onPress={handleSubmit(onSubmit)}
          backgroundColor={Colors.ewmh.background}
        >
          Xác nhận
        </Button>
      )}
      <CustomAlertDialogV2
        isShown={isResetLinkSentShown}
        hideModal={() => setIsResetLinkSentShown(false)}
        header="Thông báo"
        body={`Link đặt lại mật khẩu đã được gửi qua địa chỉ email: ${email}. Bạn hãy kiểm tra nhé.`}
        proceedText="Chấp nhận"
      />
    </VStack>
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

  promptText: {
    flex: 3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emailInputContainer: {
    flex: 7,
  },
  error: {
    color: Colors.ewmh.login.error,
  },
  errorContainer: {
    width: "100%",
    height: "12%",
  },
  emailInput: {
    padding: 5,
    fontSize: 18,
    width: "100%",
  },
});
