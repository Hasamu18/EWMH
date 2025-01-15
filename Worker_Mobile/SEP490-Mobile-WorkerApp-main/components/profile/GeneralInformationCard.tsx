import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { HStack, Icon, Text } from "native-base";
import { Pressable, StyleSheet } from "react-native";
import { GeneralInformationOption } from "../../constants/GeneralInformationOptions";
interface GeneralInformationCardProps {
  option: GeneralInformationOption;
}
export default function GeneralInformationCard({
  option,
}: GeneralInformationCardProps) {
  const goToScreen = () => {
    router.push(option.targetScreen as Href);
  };
  return (
    <Pressable onPress={goToScreen}>
      {option.icon === undefined ? null : (
        <HStack
          paddingLeft="5"
          paddingRight="5"
          paddingTop="3"
          paddingBottom="3"
          style={styles.container}
        >
          <HStack style={styles.descriptionContainer}>
            <Icon as={Ionicons} name={option.icon} size="2xl" />
            <Text style={styles.text} fontSize="lg" fontWeight="bold">
              {option.title}
            </Text>
          </HStack>
          <Icon as={Ionicons} name="chevron-forward-outline" size="2xl" />
        </HStack>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    marginLeft: 12,
  },
  descriptionContainer: {
    alignItems: "center",
  },
});
