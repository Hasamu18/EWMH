import { API_Login } from "@/api/auth";
import Colors from "@/constants/Colors";
import { NOT_FOUND } from "@/constants/HttpCodes";
import { WORKER } from "@/constants/Roles";
import { LoginRequest } from "@/models/LoginRequest";
import { Tokens } from "@/models/Tokens";
import { showModal } from "@/redux/components/customAlertDialogSlice";
import { useIsLoadingContext } from "@/redux/providers/IsLoadingProvider";
import { RootState } from "@/redux/store";
import {
  AddPushNotificationRecord,
  InitializeFirestoreDb,
} from "@/utils/PushNotificationUtils";
import {
  ChangeAutoLoginMode,
  DecodeToken,
  StoreTokens,
} from "@/utils/TokenUtils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Button,
  Checkbox,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomAlertDialog from "../shared/CustomAlertDialog";

export default function LoginForm() {
  const { enableIsLoading, disableIsLoading } = useIsLoadingContext();
  const dispatch = useDispatch();
  const pushNotificationState = useSelector(
    (state: RootState) => state.pushNotification
  );
  const db = InitializeFirestoreDb();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });
  const isUserWorker = async (accessToken: string): Promise<boolean> => {
    const decodedToken = await DecodeToken(accessToken);
    const role = (decodedToken as any).role as string;
    if (role !== WORKER) return false;
    return true;
  };
  const getWorkerId = async (accessToken: string): Promise<string> => {
    const decodedToken = await DecodeToken(accessToken);
    const workerId = (decodedToken as any).accountId as string;
    return workerId;
  };

  const handleLogin = async (data: LoginRequest) => {
    try {
      enableIsLoading();
      const response = await API_Login(data);
      if (response.status === NOT_FOUND) {
        dispatch(
          showModal({
            header: "Thông báo",
            body: "Email hoặc mật khẩu không chính xác. Xin vui lòng thử lại sau.",
            proceedText: "Chấp nhận",
          })
        );
        return;
      }
      const body: Tokens = await response.json();
      const isWorker = await isUserWorker(body.at);
      if (!isWorker) {
        dispatch(
          showModal({
            header: "Thông báo",
            body: "Chỉ Nhân viên (Worker) mới được phép truy cập ứng dụng này.",
            proceedText: "Chấp nhận",
          })
        );
        return;
      }
      StoreTokens(body);
      const workerId = await getWorkerId(body.at);
      await AddPushNotificationRecord(db, {
        workerId: workerId,
        date: new Date().toString(),
        exponentPushToken: pushNotificationState.exponentPushToken,
      });
      router.navigate("/(tabs)/home");
    } catch (error) {
      dispatch(
        showModal({
          header: "Thông báo",
          body: "Đã có lỗi xảy ra. Xin hãy thông báo cho quản trị viên biết.",
          proceedText: "Chấp nhận",
        })
      );
    } finally {
      disableIsLoading();
    }
  };

  const onSubmit = (data: LoginRequest) => {
    handleLogin(data);
  };

  return (
    <VStack>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange } }) => (
          <Input
            style={styles.input}
            numberOfLines={1}
            size="lg"
            placeholder="Email hoặc số điện thoại"
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
        name="emailOrPhone"
      />
      <View style={styles.errorContainer}>
        {errors.emailOrPhone && (
          <Text style={styles.error}>Bạn phải nhập trường này.</Text>
        )}
      </View>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={styles.input}
            size="lg"
            placeholder="Mật khẩu"
            numberOfLines={1}
            secureTextEntry
            onChangeText={onChange}
            rightElement={
              <Icon
                as={Ionicons}
                name="key-outline"
                style={{ marginRight: 10 }}
              />
            }
          />
        )}
        name="password"
      />
      <View style={styles.errorContainer}>
        {errors.password && (
          <View>
            <Text style={styles.error}>Bạn phải nhập trường này.</Text>
          </View>
        )}
      </View>
      <AdditionalOptions />

      <Button
        variant="solid"
        onPress={handleSubmit(onSubmit)}
        backgroundColor={Colors.ewmh.background}
      >
        Đăng nhập
      </Button>
      <CustomAlertDialog />
    </VStack>
  );
}

function AdditionalOptions() {
  const [isChecked, setIsChecked] = useState(false);
  const goToForgotPasswordScreen = () => {
    router.push("/forgotPassword");
  };
  const handleCheckbox = async () => {
    setIsChecked(!isChecked);
    await ChangeAutoLoginMode(Number(!isChecked));
  };
  return (
    <HStack style={styles.additionalOptions}>
      <Checkbox
        isChecked={isChecked}
        value=""
        colorScheme="green"
        onChange={() => handleCheckbox()}
        accessibilityLabel="Select this option"
      >
        Ghi nhớ đăng nhập
      </Checkbox>

      <Pressable onPress={goToForgotPasswordScreen}>
        <Text fontWeight="bold" fontSize="md" color={Colors.ewmh.background}>
          Quên mật khẩu?
        </Text>
      </Pressable>
    </HStack>
  );
}
const styles = StyleSheet.create({
  input: {
    padding: 5,
    fontSize: 18,
    width: "100%",
  },
  error: {
    color: Colors.ewmh.login.error,
  },
  errorContainer: {
    width: "100%",
    height: "12%",
  },
  additionalOptions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
