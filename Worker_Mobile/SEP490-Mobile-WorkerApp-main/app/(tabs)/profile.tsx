import { API_Logout } from "@/api/auth";
import { API_User_GetProfile } from "@/api/user";
import GeneralInformationCard from "@/components/profile/GeneralInformationCard";
import SectionHeader from "@/components/profile/SectionHeader";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import { GENERAL_INFORMATION_OPTIONS } from "@/constants/GeneralInformationOptions";

import CustomAlertDialogV2 from "@/components/shared/CustomAlertDialogV2";
import Colors from "@/constants/Colors";
import { MOBILE_HEIGHT, SCREEN_HEIGHT } from "@/constants/Device";
import { UserProfile } from "@/models/ProfileResponse";
import { UpdateProfileRequest } from "@/models/UpdateProfileRequest";
import { setUpdateProfileRequest } from "@/redux/components/updateProfileSlice";
import { ChangeAutoLoginMode, RemoveTokens } from "@/utils/TokenUtils";
import { router, useFocusEffect } from "expo-router";
import { Avatar, Button, Text, VStack } from "native-base";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<UserProfile>();
  const loadUserProfile = () => {
    API_User_GetProfile().then((response) => {
      setProfile(response.response);
      setIsLoading(false);
      mapUserProfileToUpdateRequest(response.response);
    });
  };

  /*
    Only extracts the necessary profile fields to be updated. 
    The extracted object is used in the Store for later updates.
  */
  const mapUserProfileToUpdateRequest = (userProfile: UserProfile) => {
    const updateProfileRequest: UpdateProfileRequest = {
      email: userProfile.email,
      fullName: userProfile.fullName,
      dateOfBirth: userProfile.dateOfBirth,
    };
    dispatch(setUpdateProfileRequest(updateProfileRequest));
  };
  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [])
  );
  return (
    <>
      {profile === undefined || isLoading ? (
        <FullScreenSpinner />
      ) : (
        <View style={styles.container}>
          <AvatarSection profile={profile} />
          <GeneralInfoSection />
          <LogoutSection setIsLoading={setIsLoading} />
        </View>
      )}
    </>
  );
}

interface AvatarSectionProps {
  profile: UserProfile;
}
function AvatarSection({ profile }: AvatarSectionProps) {
  return (
    <VStack style={styles.avatarContainer} space={3}>
      <Avatar
        source={{
          uri: `${profile?.avatarUrl}&timestamp=${new Date().getTime()}`,
        }}
        size="2xl"
      >
        <Avatar.Badge bg="green.500" />
      </Avatar>
      <Text fontSize="xl" fontWeight="bold">
        {profile.fullName}
      </Text>
      <Text fontSize="lg">{profile.email}</Text>
    </VStack>
  );
}
function GeneralInfoSection() {
  return (
    <View style={styles.generalInfoContainer}>
      <SectionHeader title="Thông tin chung" />
      {GENERAL_INFORMATION_OPTIONS.map((option, key) => {
        return <GeneralInformationCard option={option} key={key} />;
      })}
    </View>
  );
}

interface LogoutSectionProps {
  setIsLoading: (val: boolean) => void;
}
function LogoutSection({ setIsLoading }: LogoutSectionProps) {
  const [isLogoutWarningShown, setIsLogoutWarningShown] = useState(false);
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await API_Logout();
      await RemoveTokens();
      await ChangeAutoLoginMode(0);
      router.navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsLogoutWarningShown(false);
    }
  };
  return (
    <View style={styles.logoutContainer}>
      <Button
        h="80%"
        backgroundColor={Colors.ewmh.danger1}
        onPress={() => setIsLogoutWarningShown(true)}
      >
        <Text fontWeight="bold" fontSize="sm" color={Colors.ewmh.foreground}>
          Đăng xuất
        </Text>
      </Button>
      <CustomAlertDialogV2
        isShown={isLogoutWarningShown}
        hideModal={() => setIsLogoutWarningShown(false)}
        header="Đăng xuất"
        body="Bạn có chắc chắn muốn đăng xuất?"
        proceedText="Đồng ý"
        cancelText="Hủy"
        action={handleLogout}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  avatarContainer: {
    flex: SCREEN_HEIGHT < MOBILE_HEIGHT ? 4 : 3,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  generalInfoContainer: {
    flex: 6,
    width: "100%",
  },
  logoutContainer: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
});
