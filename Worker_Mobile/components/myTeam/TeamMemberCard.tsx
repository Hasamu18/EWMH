import Colors from "@/constants/Colors";
import { Worker } from "@/models/Worker";
import { Avatar, Box, HStack, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";

interface TeamMemberCardProps {
  member: Worker;
}
export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <HStack
      style={styles.container}
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
    >
      <Box style={styles.productImage}>
        <Avatar
          source={{
            uri: `${member?.avatar}&timestamp=${new Date().getTime()}`,
          }}
          size="xl"
        />
      </Box>

      <VStack space={3} style={styles.productDetails}>
        <Text fontSize="md" fontWeight="bold">
          {member.name}
        </Text>

        <Text fontSize="md" fontWeight="bold">
          {member.phoneNumber}
        </Text>
      </VStack>
    </HStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: Colors.ewmh.background2,
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  productDetails: {
    flexDirection: "column",
    padding: 10,
    flex: 2,
  },
  productImage: {
    width: 20,
    flex: 1,
  },
});
