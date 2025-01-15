import Colors from "@/constants/Colors";
import { Box } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface IsRequestPaidIndicatorProps {
  isRequestPaid: boolean;
}
export const FREE = 0;
export const PAID = 1;

export default function IsRequestPaidIndicator({
  isRequestPaid,
}: IsRequestPaidIndicatorProps) {
  const [indicatorValue, setIndicatorValue] = useState<IsRequestPaidValue>(
    indicatorValues[0]
  );
  useEffect(() => {
    if (isRequestPaid) setIndicatorValue(indicatorValues[1]);
    else setIndicatorValue(indicatorValues[0]);
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

export type IsRequestPaidValue = {
  key: number;
  value: string;
  color: string;
  textColor: string;
};
const indicatorValues: IsRequestPaidValue[] = [
  {
    key: FREE,
    value: "Miễn phí",
    color: Colors.ewmh.requestPaymentStatus.free,
    textColor: Colors.ewmh.requestPaymentStatus.freeText,
  },
  {
    key: PAID,
    value: "Tính phí",
    color: Colors.ewmh.requestPaymentStatus.paid,
    textColor: Colors.ewmh.requestPaymentStatus.paidText,
  },
];
