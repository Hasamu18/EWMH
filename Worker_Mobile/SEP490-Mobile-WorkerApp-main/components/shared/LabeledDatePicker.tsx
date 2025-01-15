import Colors from "@/constants/Colors";
import {
  ConvertToOtherDateStringFormat,
  DateToString,
  DateToStringModes,
} from "@/utils/DateUtils";
import { Ionicons } from "@expo/vector-icons";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Icon, Input } from "native-base";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

interface DatePickerProps {
  dateString: string;
  setDateString: (dateString: string) => void;
}
export default function LabeledDatePicker({
  dateString,
  setDateString,
}: DatePickerProps) {
  const [isDatePickerShown, setIsDatePickerShown] = useState(false);
  const MINIMUM_AGE = 18;
  const MAXIMUM_AGE = 60;
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - MAXIMUM_AGE,
    today.getMonth(),
    today.getDate()
  );
  const maxDate = new Date(
    today.getFullYear() - MINIMUM_AGE,
    today.getMonth(),
    today.getDate()
  );
  const [date, setDate] = useState(new Date());
  const toggleDatePicker = () => {
    setIsDatePickerShown(!isDatePickerShown);
  };
  const onChange = (
    { type }: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (type == "set") {
      setDate(selectedDate as Date);
      const dateStr = DateToString(selectedDate as Date, DateToStringModes.YMD);
      setDateString(dateStr);
      if (Platform.OS === "android") toggleDatePicker();
    } else {
      toggleDatePicker();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleDatePicker}>
        <Input
          style={styles.dateTextInput}
          size="lg"
          value={ConvertToOtherDateStringFormat(
            dateString,
            DateToStringModes.DMY
          )}
          placeholder="Vui lòng chọn"
          placeholderTextColor={Colors.ewmh.foreground2}
          editable={false}
          rightElement={
            <Icon
              as={Ionicons}
              name="calendar-outline"
              style={{ marginRight: 10 }}
            />
          }
        />
      </Pressable>

      {isDatePickerShown ? (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },
  label: {
    marginBottom: 2,
  },
  dateTextInput: {
    color: Colors.ewmh.foreground2,
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  textInputHStack: {},
});
