import { Tag } from "antd";

export function feedbackStatusGenerator(status?: boolean) {
  switch (status) {
    case true:
      return <Tag color="green">Đã duyệt</Tag>;
    case false:
      return <Tag color="volcano">Chưa duyệt</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
}
