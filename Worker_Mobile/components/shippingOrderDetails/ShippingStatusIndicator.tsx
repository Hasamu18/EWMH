import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  SHIPPING_ORDER_STATUSES,
  ShippingOrderStatus,
} from "@/constants/Shipping";
import { Box } from "native-base";

interface ShippingStatusIndicatorProps {
  status: number;
}

export default function ShippingStatusIndicator({
  status,
}: ShippingStatusIndicatorProps) {
  const [statusBoxValue, setStatusBoxValue] = useState<ShippingOrderStatus>();
  useEffect(() => {
    const selectedStatus = getSelectedStatus();
    setStatusBoxValue(selectedStatus);
  }, [status]);

  const getSelectedStatus = () => {
    return SHIPPING_ORDER_STATUSES.find(
      (orderStatus) => orderStatus.key === status
    );
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
