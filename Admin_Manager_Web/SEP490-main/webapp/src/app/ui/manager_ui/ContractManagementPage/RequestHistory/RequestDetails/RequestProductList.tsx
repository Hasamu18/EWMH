import { Space } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { List } from "../../../../../components/list";
import { Request } from "../../../../../models/request";
import { formatCurrency } from "../../../../../utils/helpers";
import { Avatar } from "../../../../../components/avatar";

export default function RequestProductList({
  products,
}: {
  products?: Request["productList"];
}) {
  return (
    <List
      fontSize={18}
      itemLayout="vertical"
      dataSource={products}
      renderItem={(item, index) => (
        <List.Item
          key={index}
          extra={
            <Space size={20}>
              <div>
                <div>
                  <span>Giá gốc: </span>
                  {formatCurrency(item.price)}
                </div>
                <div className="font-bold">
                  <span>Tổng: </span>
                  {formatCurrency(item.totalPrice)}
                </div>
              </div>
            </Space>
          }
        >
          <List.Item.Meta
            avatar={<Avatar size={50} src={item.imageUrl} shape="square" />}
            title={
              <div>
                <Space>
                  <div>{item.name}</div>
                  <div>
                    {item.isCustomerPaying ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                      <></>
                    )}
                  </div>
                </Space>
                <div>Số lượng: {item.quantity}</div>
              </div>
            }
          />
          <div>
            <span className="font-semibold">Lý do: </span>
            {item.description}
          </div>
        </List.Item>
      )}
    />
  );
}
