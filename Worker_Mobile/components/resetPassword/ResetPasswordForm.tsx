import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Button, Icon, Input, Text, VStack } from "native-base";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function ResetPasswordForm() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const passwordValue = watch("password");
  const onSubmit = () => {};

  return (
    <VStack w="100%">
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
            secureTextEntry
            placeholder="Mật khẩu mới"
            onChangeText={onChange}
            rightElement={<Icon as={Ionicons} name="mail-outline" />}
          />
        )}
        name="password"
      />
      <View style={styles.errorContainer}>
        {errors.password && (
          <Text style={styles.error}>Bạn phải nhập trường này.</Text>
        )}
      </View>
      <Controller
        control={control}
        rules={{
          required: true,
          validate: (value) =>
            value === passwordValue || "Mật khẩu không trùng khớp.",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            style={styles.emailInput}
            numberOfLines={1}
            size="lg"
            placeholder="Nhập lại mật khẩu"
            onChangeText={onChange}
            rightElement={<Icon as={Ionicons} name="mail-outline" />}
          />
        )}
        name="confirmPassword"
      />
      <View style={styles.errorContainer}>
        {errors.confirmPassword && (
          <Text style={styles.error}>Cả 2 mật khẩu phải trùng nhau.</Text>
        )}
      </View>
      <Button
        variant="solid"
        onPress={handleSubmit(onSubmit)}
        backgroundColor={Colors.ewmh.background}
      >
        Cập nhật mật khẩu
      </Button>
    </VStack>
  );
}

const styles = StyleSheet.create({
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
