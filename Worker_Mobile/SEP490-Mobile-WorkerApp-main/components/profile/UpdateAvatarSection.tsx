import { API_User_UpdateAvatar } from "@/api/user";
import Colors from "@/constants/Colors";
import { SUCCESS } from "@/constants/HttpCodes";
import { UserProfile } from "@/models/ProfileResponse";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Button, Icon, VStack } from "native-base";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";
interface AvatarSectionProps {
  profile: UserProfile;
}
export default function UpdateAvatarSection({ profile }: AvatarSectionProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isUpdateSuccessDialogShown, setIsUpdateSuccessDialogShown] =
    useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions["Images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      updateImage(result.assets[0].uri);
    }
  };
  const updateImage = async (base64: string) => {
    try {
      setIsUpdating(true);
      const response = await API_User_UpdateAvatar(base64);
      if (response.status !== SUCCESS) {
        response.json().then((res) => {
          console.log(res);
        });
      } else {
        console.log("Update successful!");
        setIsUpdateSuccessDialogShown(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <VStack space={3} style={{ alignItems: "center" }}>
      <Avatar
        source={{
          uri: `${profile?.avatarUrl}&timestamp=${new Date().getTime()}`,
        }}
        size="2xl"
      />
      {isUpdating ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button
          variant="solid"
          backgroundColor={Colors.ewmh.background}
          onPress={() => pickImage()}
          leftIcon={<Icon as={Ionicons} name="camera-outline" />}
        >
          Thay ảnh đại diện
        </Button>
      )}
      <CustomAlertDialogV2
        isShown={isUpdateSuccessDialogShown}
        hideModal={() => setIsUpdateSuccessDialogShown(false)}
        proceedText="Chấp nhận"
        header="Thông báo"
        body="Đã cập nhật hình đại diện thành công."
      />
    </VStack>
  );
}
