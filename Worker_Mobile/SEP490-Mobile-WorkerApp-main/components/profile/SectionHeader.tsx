import Colors from "@/constants/Colors";
import { Box } from "native-base";

interface SectionHeaderProps {
  title: string;
}
export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Box
      _text={{
        fontSize: "lg",
        fontWeight: "medium",
        color: Colors.ewmh.background,
        letterSpacing: "lg",
      }}
      bg={Colors.ewmh.background2}
      paddingLeft="5"
      paddingTop="2"
      paddingBottom="2"
    >
      {title}
    </Box>
  );
}
