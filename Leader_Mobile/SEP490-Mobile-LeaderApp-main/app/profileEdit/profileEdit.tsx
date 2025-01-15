import {
  Text,
  SafeAreaView,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect, useNavigation } from "expo-router";
import ProfileIcon from "@/components/custom_components/ProfileIcon";
import * as ImagePicker from "expo-image-picker";
import FormField from "@/components/custom_components/FormField";
import { formatDate } from "@/utils/utils";
import { AntDesign } from "@expo/vector-icons";
import DatePicker from "@/components/custom_components/DatePicker";
import CustomButton from "@/components/custom_components/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGlobalState } from "@/context/GlobalProvider";
import { useLeader } from "@/hooks/useLeader";

const ProfileEdit = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | null>("");
  const [form, setForm] = useState({
    FullName: "",
    Email: "",
    DateOfBirth: "",
  });
  const {
    handleGetLeaderInfo,
    userInfo,
    handleUpdateLeaderAvatar,
    handleUpdateLeaderInfo,
    apiError,
    validationErrors
  } = useLeader();
  const { loading, setLoading } = useGlobalState();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchUserInfo = async () => {
    await handleGetLeaderInfo();
  };

  useFocusEffect(
    useCallback(() => {
        if (!userInfo) {
          setLoading(true)
            fetchUserInfo();
        }
    }, [userInfo])
  );

  useEffect(() => {
    if (userInfo && (userInfo.user || userInfo)) {
      setForm({
        FullName: (userInfo.user || userInfo).fullName || "",
        Email: (userInfo.user || userInfo).email || "",
        DateOfBirth: (userInfo.user || userInfo).dateOfBirth || "",
      });
      setImageUri((userInfo.user || userInfo).avatarUrl || "");
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Chỉnh sửa hồ sơ",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#4072AF" },
      headerTintColor: "white",
    });
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#5F60B9" />
      </SafeAreaView>
    );
  }

  const submit = async () => {
    setLoading(true);
    const trimmedFullName = form.FullName.trim();
    const trimmedEmail = form.Email.trim();

    // Update leader info
    const updateResult = await handleUpdateLeaderInfo({
      fullName: trimmedFullName,
      email: trimmedEmail,
      dateOfBirth: form.DateOfBirth,
    });

    // Handle update errors
    if (updateResult && !updateResult.success) {
      setLoading(false);
      return;
    }

    if (imageUri) {
      setLoading(true)
      const avatarUpdateResult = await handleUpdateLeaderAvatar({
        photo: imageUri,
      });
      if (avatarUpdateResult) {
        await fetchUserInfo();
        router.back();
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Xin lỗi, bạn cần cho phép camera để thay đổi ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      console.log("Image pickled",imageUri)
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      setForm({ ...form, DateOfBirth: dateString });
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 py-0">
      {/* Display apiError at the top */}
      {apiError && (
        <Text className="text-red-500 font-bold mb-4 text-center">
          {apiError}
        </Text>
      )}
      <ProfileIcon image={imageUri} handlePress={pickImage} />
      <View>
        <FormField
          title="Tên Đầy Đủ"
          value={form.FullName}
          handleChangeText={(e: string) => setForm({ ...form, FullName: e })}
          placeholder="Nhập tên đầy đủ"
          otherStyles="mt-7"
          icon={<AntDesign name="user" size={24} color="black" />}
        />
        {/* Display validation error for fullName */}
        {validationErrors.fullName && (
          <Text className="text-red-500 font-bold mt-1">
            {validationErrors.fullName}
          </Text>
        )}

        <DatePicker
          title="Ngày sinh"
          placeholder="Chọn ngày sinh"
          values={formatDate(form.DateOfBirth)}
          otherStyles="mt-10"
          handlePress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={new Date(form.DateOfBirth)}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
        <FormField
          title="Email"
          value={form.Email}
          handleChangeText={(e: string) => setForm({ ...form, Email: e })}
          placeholder="Nhập email"
          otherStyles="mt-10"
          keyboardType="email-address"
          icon={<AntDesign name="mail" size={24} color="black" />}
        />
        {/* Display validation error for email */}
        {validationErrors.email && (
          <Text className="text-red-500 font-bold mt-1">
            {validationErrors.email}
          </Text>
        )}
      </View>

      <CustomButton
        title="Xác nhận lưu"
        handlePress={submit}
        containerStyles="mt-10"
        isLoading={loading}
      />
    </SafeAreaView>
  );
};

export default ProfileEdit;
