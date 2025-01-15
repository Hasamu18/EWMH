import { Tag } from "antd";

export function requestStatusGenerator(status?: number) {
  switch (status) {
    case 0:
      return <Tag color="orange">Yêu cầu mới</Tag>;
    case 1:
      return <Tag color="lime">Đang xử lý</Tag>;
    case 2:
      return <Tag color="green">Đã hoàn thành</Tag>;
    case 3:
      return <Tag color="volcano">Đã hủy</Tag>;
    default:
      return <Tag>Unknown</Tag>;
  }
}

export function requestTypeGenerator(categoryRequest?: number) {
  switch (categoryRequest) {
    case 0:
      return <Tag color="volcano">Bảo hành</Tag>;
    case 1:
      return <Tag color="green">Sửa chữa</Tag>;
    default:
      return "Unknown";
  }
}
