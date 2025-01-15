import { Tag } from "antd";
import { isNonValue } from "../helpers";

function leaderNameGenerator(leaderName?: string) {
  if (isNonValue(leaderName)) {
    return <Tag color="volcano">Chưa có</Tag>;
  } else {
    return <Tag color="green">{leaderName}</Tag>;
  }
}

function customerNameGenerator(customerName?: string) {
  if (isNonValue(customerName)) {
    return <Tag color="volcano">Chưa có</Tag>;
  } else {
    return <Tag color="green">{customerName}</Tag>;
  }
}

export { leaderNameGenerator, customerNameGenerator };
