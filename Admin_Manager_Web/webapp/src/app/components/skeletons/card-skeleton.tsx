import { Card, Skeleton } from "antd";

function CardSkeleton() {
  return (
    <Card>
      <Skeleton active={true} />
    </Card>
  );
}

function CardImageSkeleton() {
  return (
    <Card
      cover={
        <Skeleton.Node
          active={true}
          style={{ width: "100%", height: "100%" }}
          fullSize={true}
          rootClassName="!w-full"
        >
          <div style={{ width: "100%", height: "200px" }} />
        </Skeleton.Node>
      }
    >
      <Skeleton active={true} />
    </Card>
  );
}

function CardHorizontalSkeleton() {
  return (
    <Card
      cover={
        <Skeleton.Node
          active={true}
          style={{ width: "100%", height: "100%" }}
          fullSize={true}
          rootClassName="!w-full"
        >
          <div style={{ width: "100%", height: "200px" }} />
        </Skeleton.Node>
      }
    >
      <Skeleton active={true} />
    </Card>
  );
}

CardSkeleton.ImageVertical = CardImageSkeleton;
CardSkeleton.HorizontalVertical = CardHorizontalSkeleton;

export default CardSkeleton;
