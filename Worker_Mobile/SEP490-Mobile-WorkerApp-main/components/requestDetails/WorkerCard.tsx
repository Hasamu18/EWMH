import Colors from "@/constants/Colors";
import { SCREEN_WIDTH } from "@/constants/Device";
import { RequestDetailsWorker } from "@/models/RequestDetails";
import PerformPhoneCall from "@/utils/PhoneUtils";
import { Ionicons } from "@expo/vector-icons";
import {
  AspectRatio,
  Box,
  Icon,
  IconButton,
  Image,
  Text,
  VStack,
} from "native-base";
import { StyleSheet } from "react-native";

interface WorkerCardProps {
  worker: RequestDetailsWorker;
}
export default function WorkerCard({ worker }: WorkerCardProps) {
  const callWorker = () => {
    PerformPhoneCall(worker.workerPhoneNumber);
  };
  return (
    <Box alignItems="center">
      <Box
        width={SCREEN_WIDTH * 0.435}
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        backgroundColor={Colors.ewmh.background2}
        marginRight={2}
      >
        <Box>
          <AspectRatio w="100%">
            <Image
              source={{
                uri: worker.workerAvatar,
              }}
              alt="image"
            />
          </AspectRatio>
        </Box>

        <VStack space={2} style={styles.workerDetails}>
          <Text fontSize="md" fontWeight="bold" alignSelf="center">
            {worker.workerName}
          </Text>
          <IconButton
            size="lg"
            icon={<Icon as={Ionicons} name="call" />}
            colorScheme="primary"
            onPress={callWorker}
          />
        </VStack>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  workerDetails: {
    width: "100%",
    flexDirection: "column",
    padding: 10,
  },
});
