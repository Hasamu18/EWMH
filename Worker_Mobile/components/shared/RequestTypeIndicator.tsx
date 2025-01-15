import Colors from "@/constants/Colors";
import { REPAIR_REQUEST, WARRANTY_REQUEST } from "@/constants/Request";
import { Box } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface RequestTypeIndicatorProps {
  requestType: number;
}

export default function RequestTypeIndicator({
  requestType,
}: RequestTypeIndicatorProps) {
  const [indicatorValue, setIndicatorValue] = useState<RequestTypeValue>(
    indicatorValues[0]
  );
  useEffect(() => {
    if (requestType == WARRANTY_REQUEST) setIndicatorValue(indicatorValues[0]);
    else if (requestType == REPAIR_REQUEST)
      setIndicatorValue(indicatorValues[1]);
  }, []);

  return (
    <Box>
      <Box
        style={styles.container}
        alignSelf="center"
        _text={{
          fontSize: "md",
          fontWeight: "extrabold",
          color: indicatorValue.textColor,
          letterSpacing: "lg",
        }}
        bg={indicatorValue?.color}
      >
        {indicatorValue?.value}
      </Box>
    </Box>
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

export type RequestTypeValue = {
  key: number;
  value: string;
  color: string;
  textColor: string;
};
const indicatorValues: RequestTypeValue[] = [
  {
    key: WARRANTY_REQUEST,
    value: "Bảo hành",
    color: Colors.ewmh.requestStatus.warrantyRequest,
    textColor: Colors.ewmh.requestStatus.warrantyRequestText,
  },
  {
    key: REPAIR_REQUEST,
    value: "Sửa chữa",
    color: Colors.ewmh.requestStatus.repairRequest,
    textColor: Colors.ewmh.requestStatus.repairRequestText,
  },
];
