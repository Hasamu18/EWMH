import { Card, CardProps, ConfigProvider, theme, Typography } from "antd";

const { useToken } = theme;

const CustomScreenCard = ({ cardTitle, ...rest }: CustomScreenCardProps) => {
  const { token } = useToken();
  const { Title } = Typography;

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: "#4CC9C7",
            // colorBgContainer: "#4CC9C7",
          },
        },
      }}
    >
      <Card
        title={
          <Title
            level={3}
            style={{
              color: token.colorTextLightSolid,
              margin: 0,
              textTransform: "uppercase",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {cardTitle}
          </Title>
        }
        {...rest}
      />
    </ConfigProvider>
  );
};

type CustomScreenCardProps = Omit<CardProps, "title"> & {
  cardTitle: string;
};

export default CustomScreenCard;
