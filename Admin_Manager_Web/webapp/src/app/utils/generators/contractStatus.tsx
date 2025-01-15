import { Tag } from "antd";
import { isNonValue } from "../helpers";

export function contractStatusGenerator(props: contractStatus) {
  const purchaseDate = new Date(props.purchaseTime || "");
  const expiryDate = new Date(props.expireDate || "");

  if (isNonValue(props.remaining)) {
    return <Tag>Unknown</Tag>;
  }

  if (props.remaining === 0) {
    return <Tag color="volcano">Hết lần sử dụng</Tag>;
  }

  if (purchaseDate > expiryDate) {
    return <Tag color="volcano">Hết hạn</Tag>;
  }

  return <Tag color="green">Đang hoạt động</Tag>;
}

type contractStatus = {
  remaining?: number;
  purchaseTime?: string;
  expireDate?: string;
};
