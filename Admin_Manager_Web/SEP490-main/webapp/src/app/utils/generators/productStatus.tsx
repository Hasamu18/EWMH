import { Tag } from "antd";
import { isNonValue } from "../helpers";

export function productStatusGenerator(remaining?: number) {
  if (isNonValue(remaining)) {
    return <Tag>Unknown</Tag>;
  }

  if (remaining === 0) {
    return <Tag color="volcano">Hết hàng</Tag>;
  } else if (remaining > 0) {
    return <Tag color="green">Còn hàng</Tag>;
  }
}
