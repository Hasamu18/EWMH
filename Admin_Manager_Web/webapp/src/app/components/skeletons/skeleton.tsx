import { Skeleton, SkeletonProps } from "antd";
import { AvatarProps } from "antd/es/skeleton/Avatar";
import { SkeletonButtonProps } from "antd/es/skeleton/Button";
import { SkeletonInputProps } from "antd/es/skeleton/Input";

function CustomSkeleton(props: SkeletonProps) {
  return <Skeleton {...props} active={true} />;
}

function ImageSkeleton(props: ImageSkeletonProps) {
  return (
    <Skeleton.Node
      active={true}
      style={{ width: "100%", height: "100%" }}
      fullSize={true}
      rootClassName="!w-full"
    >
      <div style={{ width: "100%", height: `${props.height}px` }} />
    </Skeleton.Node>
  );
}

function AvatarSkeleton(props: AvatarProps) {
  return <Skeleton.Avatar {...props} active={true} />;
}

function ParagraphSkeleton(props: ParagraphSkeletonProps) {
  return (
    <Skeleton active={true} paragraph={props.paragraph} title={props.title} />
  );
}

function ButtonSkleton(props: SkeletonButtonProps) {
  return <Skeleton.Button {...props} active={true} />;
}

function InputSkeleton(props: SkeletonInputProps) {
  return <Skeleton.Input {...props} active={true} />;
}

CustomSkeleton.Avatar = AvatarSkeleton;
CustomSkeleton.Image = ImageSkeleton;
CustomSkeleton.Input = InputSkeleton;
CustomSkeleton.Button = ButtonSkleton;
CustomSkeleton.Paragraph = ParagraphSkeleton;

export default CustomSkeleton;

type ParagraphSkeletonProps = {
  title?: SkeletonProps["title"];
  paragraph?: SkeletonProps["paragraph"];
};

type ImageSkeletonProps = {
  height: number;
};
