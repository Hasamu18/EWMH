import { Linking } from "react-native";

export default function PerformPhoneCall(phoneNumber: string) {
  Linking.openURL(`tel:${phoneNumber}`);
}
