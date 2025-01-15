import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT } from "@/constants/Device";
import { REQUEST_STATUS_TIMELINE_ITEMS } from "@/constants/RequestStatus";
import { Actionsheet, Box, Text } from "native-base";
import { StyleSheet } from "react-native";
import Timeline from "react-native-timeline-flatlist";

interface RequestStatusActionSheetProps {
  isOpen: boolean;
  closeActionSheet: () => void;
}
export default function RequestStatusActionSheet({
  isOpen,
  closeActionSheet,
}: RequestStatusActionSheetProps) {
  return (
    <Actionsheet isOpen={isOpen} onClose={closeActionSheet}>
      <Actionsheet.Content>
        <Box style={styles.container}>
          <Text style={styles.title}>Trạng thái yêu cầu</Text>
          <Timeline
            style={styles.timeline}
            data={REQUEST_STATUS_TIMELINE_ITEMS}
          />
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  timeline: {
    marginVertical: 10,
    flexGrow: 1,
    height: "50%",
  },
  image: {
    flex: 3,
    width: "100%",
  },
  details: {
    flex: 5,
    marginVertical: 20,
  },
  descriptionContainer: {
    flex: 1,
    marginVertical: 20,
  },

  addToCart: {
    backgroundColor: Colors.ewmh.background,
    height: SCREEN_HEIGHT * 0.06,
    width: "100%",
  },
});
