import { MaterialIcons } from "@expo/vector-icons";
import { Badge, Box, Icon, Text } from "native-base";
import { Image, StyleSheet, View } from "react-native";

export default function UserInfo() {
  const notificationsCount = 2;
  return (
    <Box style={styles.infoContainer}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>Đào Việt Anh</Text>
      </View>
      <View style={styles.notificationIconContainer}>
        <Icon
          as={MaterialIcons}
          name="notifications"
          size="8"
          color="#3F72AF"
        />
        {notificationsCount > 0 && (
          <Badge
            colorScheme="danger"
            rounded="full"
            position="absolute"
            top={-5}
            right={-5}
            zIndex={1}
            variant="solid"
          >
            {notificationsCount}
          </Badge>
        )}
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationIconContainer: {
    position: "relative",
  },
  homeImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#DBE2EF",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
});
