import { Empty } from "antd";

export default function NotFound() {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_DEFAULT}
      imageStyle={{ height: 60 }}
      description={<span>Nothing found</span>}
    />
  );
}
