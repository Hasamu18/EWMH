import { Space } from "antd";
import { Modal } from "../../../components/modals";
import { useEffect } from "react";
import { ServicePackage } from "../../../models/service";
import { useServicePackage } from "../../../hooks/useServicePackage";
import { useSpecialUI } from "../../../hooks/useSpecialUI";
import { Avatar } from "../../../components/avatar";
import { BookOutlined } from "@ant-design/icons";
import { formatCurrency } from "../../../utils/helpers";
import { PrimaryButton } from "../../../components/buttons";
import { Divider } from "../../../components/divider";
import { formatPolicy } from "../../../utils/generators/policy";

export default function ViewServicePackageDetailsModal({
  open = false,
  setIsModalOpen,
  servicePackage,
}: ViewServicePackageModalProps) {
  const { state, handleGetServicePackage } = useServicePackage();
  const { state: specialUIState } = useSpecialUI();

  useEffect(() => {
    if (open) {
      handleGetServicePackage({
        ServicePackageId: servicePackage.servicePackageId,
      });
    }
  }, [handleGetServicePackage, servicePackage.servicePackageId, open]);

  return (
    <Modal
      title={
        <Space className="text-base">
          <BookOutlined />
          <div className="uppercase text-secondary">
            Thông tin {servicePackage.name}
          </div>
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
      width={700}
    >
      <Space direction="vertical" className="w-full text-sm">
        <div className="text-xs text-gray-400">
          #{state.currentServicePackage.servicePackageId}
        </div>
        <Space direction="vertical" size={5} className="w-full">
          <Avatar
            src={state.currentServicePackage.imageUrl}
            size={200}
            shape="square"
          />
          <div className="text-lg font-bold">
            {state.currentServicePackage.name}
          </div>
          <Space className="flex w-full justify-between">
            <div>
              <span className="font-bold">Số lần sửa: </span>
              <span>{state.currentServicePackage.numOfRequest} lần sửa</span>
            </div>
            <div>
              <span className="font-bold">Giá gói: </span>
              {formatCurrency(state.currentServicePackage.priceByDate)}
            </div>
          </Space>
        </Space>
        <Divider type="horizontal" className="bg-black" />
        <Space direction="vertical" size={5}>
          <div className="text-lg font-bold uppercase">Chính sách</div>
          <div>
            {formatPolicy(state.currentServicePackage.policy).general.map(
              (value, index) => (
                <div key={index}>{`- ${value}`}</div>
              ),
            )}
            <div className="py-3 font-bold uppercase">Sửa chữa điện</div>
            {formatPolicy(
              state.currentServicePackage.policy,
            ).repairs.electricity.map((value, index) => (
              <div key={index}>{`+ ${value}`}</div>
            ))}
            <div className="py-3 font-bold uppercase">Sửa chữa nước</div>
            {formatPolicy(state.currentServicePackage.policy).repairs.water.map(
              (value, index) => (
                <div key={index}>{`+ ${value}`}</div>
              ),
            )}
          </div>
        </Space>
      </Space>
    </Modal>
  );
}

type ViewServicePackageModalProps = {
  open?: boolean;
  setIsModalOpen?: any;
  servicePackage: ServicePackage;
};
