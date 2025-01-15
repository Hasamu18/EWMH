import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Box } from "native-base";
import {
  RepairRequestStatus,
  REPAIR_REQUEST_STATUSES,
} from "@/constants/Request";

interface RequestStatusIndicatorProps {
  status: number;
}

export default function RequestStatusIndicator({
  status,
}: RequestStatusIndicatorProps) {
  const [statusBoxValue, setStatusBoxValue] = useState<RepairRequestStatus>();
  useEffect(() => {
    const selectedStatus = getSelectedStatus();
    setStatusBoxValue(selectedStatus);
  }, []);

  const getSelectedStatus = () => {
    return REPAIR_REQUEST_STATUSES[status];
  };
  return (
    <View>
      {statusBoxValue === undefined ? null : (
        <Box>
          <Box
            style={styles.container}
            alignSelf="center"
            _text={{
              fontSize: "md",
              fontWeight: "extrabold",
              color: statusBoxValue?.textColor,
              letterSpacing: "lg",
            }}
            bg={statusBoxValue?.color}
          >
            {statusBoxValue?.value}
          </Box>
        </Box>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
  },
});
