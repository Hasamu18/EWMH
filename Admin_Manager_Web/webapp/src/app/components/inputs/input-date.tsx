import { DatePicker, DatePickerProps } from "antd";
import dayjs from "dayjs";

function CustomDatePicker(props: CustomDatePickerProps) {
  let { value } = props;
  if (value && typeof value === "number") {
    value = dayjs(value);
  }
  const dateFormat = "DD/MM/YYYY";

  return (
    <DatePicker
      {...props}
      allowClear={false}
      value={value}
      format={dateFormat}
    />
  );
}

CustomDatePicker.RangePicker = DatePicker.RangePicker;

export default CustomDatePicker;

type CustomDatePickerProps = Omit<DatePickerProps, "style">;
