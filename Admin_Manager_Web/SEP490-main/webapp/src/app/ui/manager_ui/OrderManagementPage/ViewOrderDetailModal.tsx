import { useEffect, useState } from "react";
import {
  EyeOutlined,
  MailFilled,
  PhoneFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Modal } from "../../../components/modals";
import { Space } from "antd";
import { Avatar } from "../../../components/avatar";
import { formatCurrency, formatDateToLocal } from "../../../utils/helpers";
import { Grid } from "../../../components/grids";
import { List } from "../../../components/list";
import { PrimaryButton } from "../../../components/buttons";
import { useOrder } from "../../../hooks/useOrder";
import { useSpecialUI } from "../../../hooks/useSpecialUI";

export function ViewDetailButton({ orderId }: { orderId: string }) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { state: orderState, handleGetOrder } = useOrder();
  const { state: specialUIState } = useSpecialUI();

  useEffect(() => {
    if (isModalVisible) {
      handleGetOrder({ OrderId: orderId });
    }
  }, [handleGetOrder, isModalVisible, orderId]);

  return (
    <>
      <EyeOutlined onClick={() => setIsModalVisible(true)} />
      <Modal
        title={
          <Space className="text-base">
            <ShoppingCartOutlined />
            <div className="uppercase text-secondary">Chi tiết đơn hàng</div>
          </Space>
        }
        maskClosable={false}
        open={isModalVisible}
        loading={specialUIState.isLoading}
        footer={[
          <PrimaryButton
            key="close"
            text="Đóng"
            onClick={() => setIsModalVisible(false)}
            size="middle"
          />,
        ]}
        closeIcon={null}
        width={1000}
      >
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={10} className="w-full">
              <div>
                <strong>Họ và Tên:</strong>{" "}
                {orderState.currentOrder.customer?.fullName}
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <PhoneFilled />
                  <strong>SĐT:</strong>
                  <span>{orderState.currentOrder.customer?.phoneNumber}</span>
                </Space>
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <MailFilled />
                  <strong>Email:</strong>
                  <span>{orderState.currentOrder.customer?.email}</span>
                </Space>
              </div>
              <div>
                <strong>Chung cư:</strong>{" "}
                {orderState.currentOrder.apartment?.name}
              </div>
              <div>
                <strong>Leader:</strong>{" "}
                {orderState.currentOrder.leader?.fullName}
              </div>
            </Space>,
            <Space direction="vertical" size={15} className="w-full">
              <div>
                <div className="text-2xl font-bold">Đơn hàng</div>
                <div className="text-xs text-gray-400">#{orderId}</div>
              </div>
              <div>
                <strong>Ngày đặt:</strong>{" "}
                {formatDateToLocal(orderState.currentOrder.order?.purchaseTime)}
              </div>
              <List
                fontSize={16}
                itemLayout="vertical"
                dataSource={orderState.currentOrder.order?.result}
                footer={
                  <div className="flex justify-between text-base">
                    <div className="font-bold uppercase">Tổng tiền</div>
                    <div className="font-bold">
                      {formatCurrency(orderState.currentOrder.order?.sum)}
                    </div>
                  </div>
                }
                renderItem={(item) => {
                  return (
                    <List.Item
                      key={item.product.productId}
                      extra={
                        <Space size={20}>
                          <div>
                            <div>
                              <span>Giá gốc: </span>
                              {formatCurrency(item.orderDetail.price)}
                            </div>
                            <div className="font-bold">
                              <span>Tổng: </span>
                              {formatCurrency(item.orderDetail.totalPrice)}
                            </div>
                          </div>
                        </Space>
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={50}
                            src={item.product.imageUrl}
                            shape="square"
                          />
                        }
                        title={
                          <div className="font-normal">
                            <Space>
                              <div>{item.product.name}</div>
                            </Space>
                            <div>Số lượng: {item.orderDetail.quantity}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Space>,
          ]}
        />
      </Modal>
    </>
  );
}
