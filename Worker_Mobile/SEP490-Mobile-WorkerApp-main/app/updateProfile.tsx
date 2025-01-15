import { API_User_GetProfile } from "@/api/user";
import UpdateAvatarSection from "@/components/profile/UpdateAvatarSection";
import UpdateProfileForm from "@/components/profile/UpdateProfileForm";
import FullScreenSpinner from "@/components/shared/FullScreenSpinner";
import { UserProfile } from "@/models/ProfileResponse";
import { RootState } from "@/redux/store";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

export default function UpdateProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const isUpdatingProfile = useSelector(
    (state: RootState) => state.updateProfile.isUpdatingProfile
  );
  const [profile, setProfile] = useState<UserProfile>();
  const loadUserProfile = () => {
    API_User_GetProfile().then((response) => {
      setProfile(response.response);
      setIsLoading(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [])
  );
  return (
    <>
      {profile === undefined || isLoading || isUpdatingProfile ? (
        <FullScreenSpinner />
      ) : (
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <UpdateAvatarSection profile={profile} />
          </View>
          <View style={styles.updateProfileFormContainer}>
            <UpdateProfileForm />
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 10,
  },

  avatarContainer: {
    flex: 2,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  updateProfileFormContainer: {
    flex: 7,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
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
