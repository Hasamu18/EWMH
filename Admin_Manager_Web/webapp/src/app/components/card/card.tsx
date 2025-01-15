import { Card, CardProps, Typography } from "antd";

const { Title, Paragraph } = Typography;

const CustomCard = (props: CardProps) => {
  return <Card {...props} />;
};

const CustomCardText = ({
  title,
  description,
  ...rest
}: CustomCardTextProps) => {
  return (
    <Card {...rest}>
      <Title level={2} className="mt-0" ellipsis={{ rows: 2 }}>
        {title}
      </Title>
      <Paragraph ellipsis={{ rows: 3, expandable: false }}>
        {description}
      </Paragraph>
    </Card>
  );
};

CustomCard.Text = CustomCardText;

export default CustomCard;

type CustomCardTextProps = CardProps & {
  title?: string;
  description?: string;
};
