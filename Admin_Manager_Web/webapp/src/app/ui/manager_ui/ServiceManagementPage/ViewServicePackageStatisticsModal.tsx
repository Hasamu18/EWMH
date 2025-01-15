import { Empty, Space } from "antd";
import { Modal } from "../../../components/modals";
import { useEffect, useState } from "react";
import { ServicePackage } from "../../../models/service";
import { useServicePackage } from "../../../hooks/useServicePackage";
import { useSpecialUI } from "../../../hooks/useSpecialUI";
import { Avatar } from "../../../components/avatar";
import {
  BookOutlined,
  CalendarFilled,
  HistoryOutlined,
  MailFilled,
  PhoneFilled,
  RightOutlined,
} from "@ant-design/icons";
import { formatCurrency, formatDateToLocal } from "../../../utils/helpers";
import { PrimaryButton } from "../../../components/buttons";
import { useContract } from "../../../hooks/useContract";
import { Grid } from "../../../components/grids";

export default function ViewServicePackageStatisticsModal({
  open = false,
  setIsModalOpen,
  servicePackage,
}: ViewServicePackageModalProps) {
  const {
    state: servicePackageState,
    handleGetRevenueAndNumberOfPurchaseOfServicePackage,
  } = useServicePackage();
  const { state: contractState, handleGetContractDetails } = useContract();
  const { state: specialUIState } = useSpecialUI();
  const [isContractDetailsModalOpen, setIsContractDetailsModalOpen] =
    useState(false);

  useEffect(() => {
    if (open) {
      handleGetRevenueAndNumberOfPurchaseOfServicePackage({
        NumOfTop: 1,
        ServicePackageId: servicePackage.servicePackageId,
      });
    }
  }, [
    handleGetRevenueAndNumberOfPurchaseOfServicePackage,
    open,
    servicePackage.servicePackageId,
  ]);

  const topServicePackage = servicePackageState.topServicePackageList[0] || {};

  function handleViewDetail(orderId: string) {
    handleGetContractDetails({ ContractId: orderId });
    setIsContractDetailsModalOpen(true);
  }

  return (
    <>
      {/* Model contract list */}
      <Modal
        title={
          <Space className="text-base">
            <BookOutlined />
            <div className="uppercase text-secondary">Thống kê gói dịch vụ</div>
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
        loading={specialUIState.isLoading}
      >
        <Space direction="vertical" className="w-full">
          <Space direction="vertical" className="w-full text-sm">
            <div className="text-xs text-gray-400">
              #{servicePackage.servicePackageId}
            </div>
            <div className="flex gap-5">
              <div>
                <Avatar
                  src={servicePackage.imageUrl}
                  size={200}
                  shape="square"
                />
              </div>
              <div>
                <div>
                  <span className="font-bold">Tên gói: </span>
                  <span>{servicePackage.name}</span>
                </div>
                <div>
                  <span className="font-bold">Số lần sửa: </span>
                  <span>{servicePackage.numOfRequest} lần sửa</span>
                </div>
                <div>
                  <span className="font-bold">Giá gói: </span>
                  {formatCurrency(servicePackage.priceByDate)}
                </div>
                <div>
                  <span className="font-bold">Tổng lượt mua: </span>
                  {topServicePackage.totalPurchasedQuantity || 0}
                </div>
                <div>
                  <span className="font-bold">Tổng doanh thu: </span>
                  {formatCurrency(topServicePackage.totalRevenue)}
                </div>
              </div>
            </div>
          </Space>
          <Space direction="vertical" className="w-full">
            <div className="text-lg font-bold uppercase">
              Danh sách hợp đồng mua gói
            </div>
            {topServicePackage?.contractIdList?.length ? (
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              >
                <Space direction="vertical" className="w-full text-sm">
                  {topServicePackage.contractIdList.map((contract, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer justify-between rounded-lg p-3 hover:bg-gray-100"
                      onClick={() => handleViewDetail(contract.contractId)}
                    >
                      <div className="w-full">
                        <div>Hợp đồng {contract.contractId}</div>
                        <div>{formatDateToLocal(contract.purchaseTime)}</div>
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
        </Space>
      </Modal>
      {/* Modal contract details */}
      <Modal
        title={
          <Space className="text-base">
            <HistoryOutlined />
            <div className="uppercase text-secondary">Thông tin chi tiết</div>
          </Space>
        }
        open={isContractDetailsModalOpen}
        footer={[
          <PrimaryButton
            key="close"
            text="Đóng"
            onClick={() => setIsContractDetailsModalOpen(false)}
            size="middle"
          />,
        ]}
        closeIcon={null}
        maskClosable={false}
        width={900}
        loading={contractState.isFetching}
      >
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={15}>
              <div className="text-lg font-bold uppercase">
                Thông tin khách hàng
              </div>
              <Space direction="vertical" size={10}>
                <div>
                  <strong>Họ và Tên:</strong>{" "}
                  {contractState.currentContract.customerInfo.fullName}
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <strong>Cmt/cccd:</strong>
                    <span>
                      {contractState.currentContract.customerInfo.cmT_CCCD}
                    </span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <PhoneFilled />
                    <strong>SĐT:</strong>
                    <span>
                      {contractState.currentContract.customerInfo.phoneNumber}
                    </span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <CalendarFilled />
                    <strong>Ngày sinh:</strong>
                    <span>
                      {formatDateToLocal(
                        contractState.currentContract.customerInfo.dateOfBirth,
                      )}
                    </span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <MailFilled />
                    <strong>Email:</strong>
                    <span>
                      {contractState.currentContract.customerInfo.email}
                    </span>
                  </Space>
                </div>
              </Space>
            </Space>,
            <Space direction="vertical" size={15}>
              <div className="text-lg font-bold uppercase">
                Thông tin hợp đồng
              </div>
              <Space direction="vertical" size={10}>
                <div>
                  <strong>Mã hợp đồng:</strong>{" "}
                  {contractState.currentContract.contract.contractId}
                </div>
                <div>
                  <strong>Thời gian mua:</strong>{" "}
                  {formatDateToLocal(
                    contractState.currentContract.contract.purchaseTime,
                    true,
                  )}
                </div>
                <div>
                  <strong>Số tiền đã trả: </strong>
                  <span>
                    {formatCurrency(
                      contractState.currentContract.contract.totalPrice,
                    )}
                  </span>
                </div>
                <div>
                  <strong>Hình thức trả tiền: </strong>
                  <span>
                    {contractState.currentContract.contract.isOnlinePayment
                      ? "Online"
                      : "Tiền mặt"}
                  </span>
                </div>
              </Space>
            </Space>,
          ]}
        />
      </Modal>
    </>
  );
}

type ViewServicePackageModalProps = {
  open?: boolean;
  setIsModalOpen?: any;
  servicePackage: ServicePackage;
};
