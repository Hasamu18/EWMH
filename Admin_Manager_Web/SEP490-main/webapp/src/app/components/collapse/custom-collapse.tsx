import { Collapse, CollapseProps, ConfigProvider, theme } from "antd";

function CustomCollapse({
  colorBorder,
  fontSize,
  ...rest
}: CustomCollapseProp) {
  const { token } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: fontSize ?? token.fontSize,
          colorBorder: colorBorder ?? token.colorBorder,
          fontSizeIcon: fontSize ? fontSize - 2 : token.fontSize,
        },
      }}
    >
      <Collapse {...rest} />
    </ConfigProvider>
  );
}

export default CustomCollapse;

type CustomCollapseProp = Omit<CollapseProps, "style"> & {
  fontSize?: number;
  colorBorder?: string;
};
