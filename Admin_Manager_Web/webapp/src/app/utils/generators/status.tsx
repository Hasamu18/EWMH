import { Tag } from "antd";

export function statusGenerator(isDisabled?: boolean) {
  switch (isDisabled) {
    case true:
      return <Tag color="volcano">Vô hiệu hóa</Tag>;
    case false:
      return <Tag color="green">Đang hoạt động</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
}
