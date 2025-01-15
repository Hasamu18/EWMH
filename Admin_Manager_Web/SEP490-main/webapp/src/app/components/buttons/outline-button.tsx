import { Button, ButtonProps, ConfigProvider } from "antd";

function OutlineButton({ text, ...rest }: CustomButtonProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            algorithm: true,
            defaultColor: "#FF7A00",
            defaultBorderColor: "#FF7A00",
          },
        },
      }}
    >
      <Button type="default" size="large" {...rest}>
        {text}
      </Button>
    </ConfigProvider>
  );
}

function OutlineButtonBoldText({ text, ...rest }: CustomButtonProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            algorithm: true,
            defaultColor: "#FF7A00",
            defaultBorderColor: "#FF7A00",
          },
        },
      }}
    >
      <Button type="default" size="large" {...rest}>
        <span className="font-bold">{text}</span>
      </Button>
    </ConfigProvider>
  );
}

function IconButton({ icon, ...rest }: CustomIconButtonProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            algorithm: true,
            defaultColor: "#FF7A00",
            defaultBorderColor: "#FF7A00",
          },
        },
      }}
    >
      <Button icon={icon} type="default" size="large" {...rest} />
    </ConfigProvider>
  );
}

OutlineButton.BoldText = OutlineButtonBoldText;
OutlineButton.Icon = IconButton;

export default OutlineButton;

type CustomButtonProps = ButtonProps & {
  text?: string;
};

type CustomIconButtonProps = Omit<ButtonProps, "children"> & {
  icon?: React.ReactNode;
};
