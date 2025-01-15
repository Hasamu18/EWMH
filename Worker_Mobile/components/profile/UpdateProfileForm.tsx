import { UpdateProfileRequest } from "@/models/UpdateProfileRequest";
import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { Button, Icon, Input, Text, VStack } from "native-base";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { API_Logout } from "@/api/auth";
import { API_User_UpdateProfile } from "@/api/user";
import Colors from "@/constants/Colors";
import { CONFLICT, SUCCESS } from "@/constants/HttpCodes";
import { VALID_EMAIL_REGEX } from "@/constants/Validation";
import { RemoveTokens } from "@/utils/TokenUtils";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";
import FullScreenSpinner from "../shared/FullScreenSpinner";
import LabeledDatePicker from "../shared/LabeledDatePicker";

export default function UpdateProfileForm() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [isUpdateProfileSuccessShown, setIsUpdateProfileSuccessShown] =
    useState(false);
  const updateProfileRequest = useSelector(
    (state: RootState) => state.updateProfile.updateProfileRequest
  );
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: updateProfileRequest.fullName,
      email: updateProfileRequest.email,
      dateOfBirth: updateProfileRequest.dateOfBirth,
    },
  });
  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    try {
      setIsUpdating(true);
      const response = await API_User_UpdateProfile(data);
      if (response.status === CONFLICT) {
        setIsErrorShown(true);
      } else if (response.status === SUCCESS) {
        setIsUpdateProfileSuccessShown(true);
      }
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmit = (data: UpdateProfileRequest) => {
    handleUpdateProfile(data);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await API_Logout();
      await RemoveTokens();
      router.navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      {updateProfileRequest === undefined ? (
        <FullScreenSpinner />
      ) : (
        <>
          <VStack>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <Text fontSize="lg" fontWeight="bold">
                    Họ và tên
                  </Text>
                  <Input
                    style={styles.input}
                    numberOfLines={1}
                    size="lg"
                    value={value}
                    placeholder="Họ và tên mới..."
                    onChangeText={onChange}
                    rightElement={
                      <Icon
                        as={Ionicons}
                        name="text-outline"
                        style={{ marginRight: 10 }}
                      />
                    }
                  />
                </>
              )}
              name="fullName"
            />
            <View style={styles.errorContainer}>
              {errors.fullName && (
                <Text style={styles.error}>Bạn phải nhập trường này.</Text>
              )}
            </View>

            <Controller
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: VALID_EMAIL_REGEX,
                  message: "",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text fontSize="lg" fontWeight="bold">
                    Địa chỉ Email
                  </Text>
                  <Input
                    style={styles.input}
                    size="lg"
                    placeholder="Email mới"
                    value={value}
                    numberOfLines={1}
                    onChangeText={onChange}
                    rightElement={
                      <Icon
                        as={Ionicons}
                        name="mail-outline"
                        style={{ marginRight: 10 }}
                      />
                    }
                  />
                </>
              )}
              name="email"
            />
            <View style={styles.errorContainer}>
              {errors.email && (
                <View>
                  <Text style={styles.error}>
                    Xin hãy nhập theo định dạng xxx@xxx.xxx
                  </Text>
                </View>
              )}
            </View>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text fontSize="lg" fontWeight="bold">
                    Ngày sinh
                  </Text>
                  <LabeledDatePicker
                    dateString={value}
                    setDateString={onChange}
                  />
                </>
              )}
              name="dateOfBirth"
            />
            <View style={styles.errorContainer}>
              {errors.dateOfBirth && (
                <View>
                  <Text style={styles.error}>
                    Xin hãy nhập theo định dạng năm/tháng/ngày.
                  </Text>
                </View>
              )}
            </View>
            {isUpdating ? (
              <ActivityIndicator size="large" />
            ) : (
              <Button
                variant="solid"
                onPress={handleSubmit(onSubmit)}
                backgroundColor={Colors.ewmh.background}
              >
                Cập nhật
              </Button>
            )}
          </VStack>

          <CustomAlertDialogV2
            isShown={isErrorShown}
            hideModal={() => {
              setIsErrorShown(false);
            }}
            proceedText="Chấp nhận"
            header="Thông báo"
            body={
              "Email này đã bị trùng với 1 email khác. Xin vui lòng thử lại."
            }
          />
          <CustomAlertDialogV2
            isShown={isUpdateProfileSuccessShown}
            hideModal={() => {
              setIsErrorShown(false);
            }}
            proceedText="Chấp nhận"
            header="Thông báo"
            body={
              "Đã cập nhật thông tin cá nhân thành công. Xin hãy đăng nhập vào ứng dụng để tiếp tục."
            }
            action={handleLogout}
            isActionExecuting={isLoggingOut}
          />
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    padding: 30,
  },
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
