import { Button, ButtonProps, ConfigProvider, theme } from "antd";

function PrimaryButton({ text, bgColor, ...rest }: CustomButtonProps) {
  const { token } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: bgColor ?? token.colorPrimary,
            algorithm: true,
          },
        },
      }}
    >
      <Button type="primary" size="large" {...rest}>
        {text}
      </Button>
    </ConfigProvider>
  );
}

function PrimaryButtonBoldText({ text, bgColor, ...rest }: CustomButtonProps) {
  const { token } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: bgColor ?? token.colorPrimary,
          },
        },
      }}
    >
      <Button type="primary" size="large" {...rest}>
        <span className="font-bold">{text}</span>
      </Button>
    </ConfigProvider>
  );
}

function IconButton({ bgColor, icon, ...rest }: CustomIconButtonProps) {
  const { token } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary:
              bgColor === "transparent"
                ? token.colorPrimary
                : (bgColor ?? token.colorPrimary),
            algorithm: true,
          },
        },
      }}
    >
      <Button
        icon={icon}
        type={bgColor === "transparent" ? "text" : "primary"}
        size="large"
        {...rest}
      />
    </ConfigProvider>
  );
}

PrimaryButton.BoldText = PrimaryButtonBoldText;
PrimaryButton.Icon = IconButton;

export default PrimaryButton;

type CustomButtonProps = Omit<ButtonProps, "children"> & {
  text?: string;
  bgColor?: string;
};

type CustomIconButtonProps = Omit<ButtonProps, "children"> & {
  icon?: React.ReactNode;
  bgColor?: "transparent" | string;
};
