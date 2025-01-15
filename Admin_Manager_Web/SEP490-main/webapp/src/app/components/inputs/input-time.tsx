import { TimePicker, TimePickerProps } from "antd";

function CustomTimePicker(props: CustomTimePickerProps) {
    const format = 'HH:mm';

    return <TimePicker {...props} size="large" format={format}/>;
}

export default CustomTimePicker;

type CustomTimePickerProps = Omit<TimePickerProps, "style">

