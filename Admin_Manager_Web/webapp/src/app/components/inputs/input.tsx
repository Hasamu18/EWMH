import { SearchOutlined } from "@ant-design/icons";
import { ConfigProvider, Input, InputProps, theme } from "antd";
import { SearchProps, TextAreaProps } from "antd/es/input";
function CustomInput({
  colorBgContainer,
  colorTextPlaceholder,
  ...rest
}: TCustomInputProps) {
  const { token } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: colorBgContainer ?? token.colorBgContainer,
          colorTextPlaceholder:
            colorTextPlaceholder ?? token.colorTextPlaceholder,
        },
      }}
    >
      <Input {...rest} />
    </ConfigProvider>
  );
}

function CustomInputPassword(props: TCustomInputProps) {
  return <Input.Password {...props} />;
}

function CustomInputTextArea(props: TCustomTextAreaProps) {
  return <Input.TextArea {...props} style={{ height: 120, resize: "none" }} />;
}

function SearchInput(props: TCustomSearchProps) {
  return (
    <Input.Search
      size="large"
      allowClear
      enterButton={<SearchOutlined />}
      {...props}
    />
  );
}

CustomInput.Password = CustomInputPassword;
CustomInput.OTP = Input.OTP;
CustomInput.TextArea = CustomInputTextArea;
CustomInput.Search = SearchInput;

export default CustomInput;

type TCustomInputProps = Omit<InputProps, "style"> & {
  colorBgContainer?: string;
  colorTextPlaceholder?: string;
};

type TCustomTextAreaProps = Omit<TextAreaProps, "style">;

type TCustomSearchProps = Omit<SearchProps, "style">;
