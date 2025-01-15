import { ConfigProvider, Divider, DividerProps, theme } from "antd";

const CustomDivider = ({ splitColor, ...rest }: CustomDividerProps) => {
  const { token } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorSplit: splitColor ?? token.colorSplit,
        },
      }}
    >
      <Divider {...rest} />
    </ConfigProvider>
  );
};

type CustomDividerProps = DividerProps & {
  splitColor?: string;
};

export default CustomDivider;
