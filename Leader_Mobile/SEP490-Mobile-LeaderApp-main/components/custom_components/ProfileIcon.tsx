import { View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";

interface ProfileIconProp {
  image: string | null;
  handlePress?: () => void;
}

const ProfileIcon = ({ image, handlePress }: ProfileIconProp) => {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);

  // Fetch accountId asynchronously
  useEffect(() => {
    const fetchAccountId = async () => {
      const id = await SecureStore.getItemAsync("accountId");
      setAccountId(id);
    };
    fetchAccountId();
  }, []);

  // Set the correct image source
  useEffect(() => {
    if (accountId) {
      const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/sep490-8888.appspot.com/o/Accounts%2F${accountId}?alt=media`;
      const updatedImage = image === firebaseUrl
        ? `${firebaseUrl}&timestamp=${new Date().getTime()}`
        : image;
      setImageSource(updatedImage);
    }
  }, [accountId, image]);

  return (
    <TouchableOpacity
      className="mt-10 flex-row items-end justify-center"
      onPress={handlePress}
    >
      {imageSource ? (
        <>
          <Image
            source={{ uri: imageSource }}
            className="w-28 h-28 rounded-full"
          />
          <View className="bg-[#3F72AF] p-1 rounded-full -ml-6 border-2 border-white">
            <MaterialIcons name="edit" size={15} color="white" />
          </View>
        </>
      ) : (
        <>
          <FontAwesome name="user-circle" size={64} color="black" />
          <View className="bg-[#3F72AF] p-1 rounded-full -ml-6 border-2 border-white">
            <MaterialIcons name="edit" size={15} color="white" />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ProfileIcon;
