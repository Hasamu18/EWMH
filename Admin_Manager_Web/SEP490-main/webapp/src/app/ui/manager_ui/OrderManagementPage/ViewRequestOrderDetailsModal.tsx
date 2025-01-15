import {
  CheckCircleTwoTone,
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
import { RequestOrder } from "../../../models/order";
import { useRequest } from "../../../hooks/useRequest";
import { useEffect } from "react";

export function ViewRequestOrderDetailsModal({
  requestOrder,
  isModalVisible,
  setIsModalVisible,
}: {
  requestOrder: RequestOrder;
  isModalVisible: boolean;
  setIsModalVisible: any;
}) {
  const { state: requestState, handleGetDetailsOfRequest } = useRequest();

  useEffect(() => {
    if (isModalVisible) {
      handleGetDetailsOfRequest({ RequestId: requestOrder.order.requestId });
    }
  }, [handleGetDetailsOfRequest, isModalVisible, requestOrder.order.requestId]);

  return (
    <>
      <Modal
        title={
          <Space className="text-base">
            <ShoppingCartOutlined />
            <div className="uppercase text-secondary">Chi tiết đơn hàng</div>
          </Space>
        }
        maskClosable={false}
        open={isModalVisible}
        footer={[
          <PrimaryButton
            key="close"
            text="Đóng"
            onClick={() => setIsModalVisible(false)}
            size="middle"
          />,
        ]}
        loading={requestState.isFetching}
        closeIcon={null}
        width={1000}
      >
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={10} className="w-full">
              <Avatar
                src={requestOrder.customer_Leader[0].avatarUrl}
                size={150}
              />
              <div>
                <strong>Họ và Tên:</strong>{" "}
                {requestOrder.customer_Leader[0].fullName}
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <PhoneFilled />
                  <strong>SĐT:</strong>
                  <span>{requestOrder.customer_Leader[0].phoneNumber}</span>
                </Space>
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <MailFilled />
                  <strong>email:</strong>
                  <span>{requestOrder.customer_Leader[0].email}</span>
                </Space>
              </div>
              <div>
                <strong>Leader:</strong>{" "}
                {requestOrder.customer_Leader[1].fullName}
              </div>
            </Space>,
            <Space direction="vertical" size={15} className="w-full">
              <div className="text-2xl font-bold">Đơn hàng</div>
              <div>
                <strong>Ngày đặt:</strong>{" "}
                {formatDateToLocal(requestOrder.order.purchaseTime)}
              </div>
              <List
                fontSize={16}
                itemLayout="vertical"
                dataSource={requestState.currentRequest.productList}
                footer={
                  <div className="flex justify-between text-base">
                    <div className="font-bold uppercase">Tổng tiền</div>
                    <div className="font-bold">
                      {formatCurrency(requestOrder.order.totalPrice)}
                    </div>
                  </div>
                }
                renderItem={(item, index) => {
                  return (
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
                        avatar={
                          <Avatar
                            size={50}
                            src={item.imageUrl}
                            shape="square"
                          />
                        }
                        title={
                          <div className="font-normal">
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
