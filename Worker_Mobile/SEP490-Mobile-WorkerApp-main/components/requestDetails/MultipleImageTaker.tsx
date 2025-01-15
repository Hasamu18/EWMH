import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/Device";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { Icon, IconButton, Image, VStack } from "native-base";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import CustomAlertDialogV2 from "../shared/CustomAlertDialogV2";

interface MultipleImageTakerProps {
  route: Href<string>;
  images: string[];
  removeImage: (index: number) => void;
  maxCount: number;
  isScanner?: boolean;
}

export default function MultipleImageTaker({
  route,
  images,
  removeImage,
  maxCount,
  isScanner,
}: MultipleImageTakerProps) {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const goToCaptureScreen = () => {
    if (isScanner) router.push("/documentScanner");
    else router.push(route);
  };
  const showDeleteConfirmationDialog = (index: number) => {
    setSelectedImageIndex(index);
    setIsDeleteModalShown(true);
  };

  return (
    <ScrollView horizontal style={styles.imagePreviewer}>
      {images.map((uri, index) => (
        <VStack key={index} style={styles.imageContainer}>
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            alt="screenshot"
          />
          <IconButton
            size="lg"
            style={styles.deleteButton}
            icon={<Icon as={Ionicons} name="trash-outline" />}
            _icon={{ color: Colors.ewmh.foreground }}
            backgroundColor={Colors.ewmh.danger1}
            onPress={() => showDeleteConfirmationDialog(index)}
          />
        </VStack>
      ))}

      {images.length < maxCount && (
        <IconButton
          size="lg"
          icon={<Icon as={Ionicons} name="add-circle-sharp" />}
          _icon={{ color: Colors.ewmh.foreground }}
          style={styles.addButton}
          onPress={goToCaptureScreen}
        />
      )}
      <CustomAlertDialogV2
        isShown={isDeleteModalShown}
        hideModal={() => setIsDeleteModalShown(false)}
        header="Cảnh báo"
        body="Bạn có chắc chắn muốn xóa hình chụp này?"
        proceedText="Có"
        cancelText="Không"
        action={() => removeImage(selectedImageIndex)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  imagePreviewer: {
    flexDirection: "row",
    padding: 10,
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.18,
    marginRight: 10,
  },
  image: {
    flex: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  addButton: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.18,
    backgroundColor: Colors.ewmh.background,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  deleteButton: {
    flex: 2,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: "#fff",
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
