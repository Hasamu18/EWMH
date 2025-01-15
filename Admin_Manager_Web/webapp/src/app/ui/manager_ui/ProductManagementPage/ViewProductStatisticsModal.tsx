import { Empty, Space } from "antd";
import { Modal } from "../../../components/modals";
import { useEffect, useState } from "react";
import { Product } from "../../../models/product";
import { useProduct } from "../../../hooks/useProduct";
import { useSpecialUI } from "../../../hooks/useSpecialUI";
import { Avatar } from "../../../components/avatar";
import {
  HistoryOutlined,
  MailFilled,
  PhoneFilled,
  RightOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { formatCurrency, formatDateToLocal } from "../../../utils/helpers";
import { PrimaryButton } from "../../../components/buttons";
import RequestDetails from "./RequestDetails/RequestDetails";
import { useRequest } from "../../../hooks/useRequest";
import { Grid } from "../../../components/grids";
import { useOrder } from "../../../hooks/useOrder";
import { List } from "../../../components/list";

export default function ViewProductStatisticsModal({
  open = false,
  setIsModalOpen,
  product,
}: ViewProductModalProps) {
  const { state: productState, handleGetRevenueAndNumberOfPurchaseOfProduct } =
    useProduct();
  const { state: specialUIState } = useSpecialUI();
  const { state: requestState, handleGetDetailsOfRequest } = useRequest();
  const { state: orderState, handleGetOrder } = useOrder();
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isRequestDetailsModalOpen, setIsRequestDetailsModalOpen] =
    useState(false);

  useEffect(() => {
    if (open) {
      handleGetRevenueAndNumberOfPurchaseOfProduct({
        ProductId: product.productId,
        NumOfTop: 1,
      });
    }
  }, [handleGetRevenueAndNumberOfPurchaseOfProduct, product.productId, open]);

  const topProduct = productState.topProductList[0] || {};

  function handleViewOrderDetails(orderId: string) {
    handleGetOrder({ OrderId: orderId });
    setIsOrderDetailsModalOpen(true);
  }

  function handleViewRequestDetails(requestId: string) {
    handleGetDetailsOfRequest({ RequestId: requestId });
    setIsRequestDetailsModalOpen(true);
  }

  return (
    <>
      {/* Model order/request list */}
      <Modal
        title={
          <Space className="text-base">
            <ToolOutlined />
            <div className="uppercase text-secondary">Thống kê sản phẩm</div>
          </Space>
        }
        open={open}
        footer={[
          <PrimaryButton
            key="close"
            text="Đóng"
            onClick={() => setIsModalOpen(false)}
            size="middle"
          />,
        ]}
        closeIcon={null}
        maskClosable={false}
        loading={
          specialUIState.isLoading &&
          !isOrderDetailsModalOpen &&
          !isRequestDetailsModalOpen
        }
      >
        <div>
          <Space direction="vertical" className="w-full text-sm">
            <div className="flex gap-5">
              <div>
                <Avatar src={product.imageUrl} size={200} shape="square" />
              </div>
              <div>
                <div>
                  <span className="font-bold">Tên sản phẩm: </span>
                  {product.name}
                </div>
                <div>
                  <span className="font-bold">Giá hiện tại: </span>
                  {formatCurrency(product.priceByDate)}
                </div>
                <div>
                  <span className="font-bold">Số lượng trong kho: </span>
                  {product.inOfStock}
                </div>
                <div>
                  <span className="font-bold">Số lượng đã bán: </span>
                  {topProduct.totalPurchasedQuantity || 0}
                </div>
                <div>
                  <span className="font-bold">Tổng doanh thu: </span>
                  {formatCurrency(topProduct.totalRevenue)}
                </div>
              </div>
            </div>
          </Space>
          <Space direction="vertical" className="w-full">
            <div className="text-lg font-bold uppercase">
              Danh sách đơn hàng sản phẩm
            </div>
            {topProduct?.orderIdList?.length ||
            topProduct?.doneRequestIdList?.length ? (
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              >
                <Space direction="vertical" className="w-full text-sm">
                  {topProduct.orderIdList.map((order, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer justify-between rounded-lg p-3 hover:bg-gray-100"
                      onClick={() => handleViewOrderDetails(order.orderId)}
                    >
                      <div className="w-full">
                        <div>Đơn hàng {order.orderId}</div>
                        <div>{formatDateToLocal(order.purchaseTime)}</div>
                      </div>
                      <RightOutlined />
                    </div>
                  ))}
                </Space>
                <Space direction="vertical" className="w-full text-sm">
                  {topProduct.doneRequestIdList.map((request, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer justify-between rounded-lg p-3 hover:bg-gray-100"
                      onClick={() =>
                        handleViewRequestDetails(request.requestId)
                      }
                    >
                      <div className="w-full">
                        <div>Yêu cầu {request.requestId}</div>
                        <div>{formatDateToLocal(request.purchaseTime)}</div>
                      </div>
                      <RightOutlined />
                    </div>
                  ))}
                </Space>
              </div>
            ) : (
              <Empty />
            )}
          </Space>
        </div>
      </Modal>
      {/* Modal request details */}
      <Modal
        title={
          <Space className="text-base">
            <HistoryOutlined />
            <div className="uppercase text-secondary">Thông tin yêu cầu</div>
          </Space>
        }
        open={isRequestDetailsModalOpen}
        footer={[
          <PrimaryButton
            key="close"
            text="Đóng"
            onClick={() => setIsRequestDetailsModalOpen(false)}
            size="middle"
          />,
        ]}
        closeIcon={null}
        maskClosable={false}
        width={"fit-content"}
      >
        <RequestDetails
          request={requestState.currentRequest}
          loading={specialUIState.isLoading}
        />
      </Modal>
      {/* Modal order details */}
      <Modal
        title={
          <Space className="text-base">
            <ShoppingCartOutlined />
            <div className="uppercase text-secondary">Chi tiết đơn hàng</div>
          </Space>
        }
        maskClosable={false}
        open={isOrderDetailsModalOpen}
        loading={specialUIState.isLoading}
        footer={[
          <PrimaryButton
            key="close"
            text="Đóng"
            onClick={() => setIsOrderDetailsModalOpen(false)}
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
                <div className="text-xs text-gray-400">
                  #
                  {orderState.currentOrder.order?.result[0].orderDetail.orderId}
                </div>
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

type ViewProductModalProps = {
  open?: boolean;
  setIsModalOpen?: any;
  product: Product;
};
