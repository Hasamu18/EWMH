import { ConfigProvider, Dropdown, DropDownProps } from "antd";

function CustomDropdown({ ...rest }: DropDownProps) {
  return (
    <ConfigProvider theme={{}}>
      <Dropdown {...rest} />
    </ConfigProvider>
  );
}

export default CustomDropdown;
