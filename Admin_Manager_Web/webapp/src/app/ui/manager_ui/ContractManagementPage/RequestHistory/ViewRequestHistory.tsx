import { Empty, Space } from "antd";
import { Modal } from "../../../../components/modals";
import { Contract } from "../../../../models/contract";
import { HistoryOutlined, RightOutlined } from "@ant-design/icons";
import { PrimaryButton } from "../../../../components/buttons";
import { formatDateToLocal } from "../../../../utils/helpers";
import { useRequest } from "../../../../hooks/useRequest";
import RequestDetails from "./RequestDetails/RequestDetails";
import { useSpecialUI } from "../../../../hooks/useSpecialUI";
import { useState } from "react";

export default function ViewRequestHistoryModal({
  open = false,
  setIsModalOpen,
  contract,
}: ViewContractModalProps) {
  const { state: requestState, handleGetDetailsOfRequest } = useRequest();
  const { state: specialUIState } = useSpecialUI();
  const [isRequestDetailsModalOpen, setIsRequestDetailsModalOpen] =
    useState(false);

  function handleViewDetail(requestId: string) {
    handleGetDetailsOfRequest({ RequestId: requestId });
    setIsRequestDetailsModalOpen(true);
  }

  return (
    <>
      {/* Model request list */}
      <Modal
        title={
          <Space className="text-base">
            <HistoryOutlined />
            <div className="uppercase text-secondary">Lịch sử yêu cầu</div>
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
      >
        {contract.requestIdList.length ? (
          <Space direction="vertical" className="w-full text-sm">
            {contract.requestIdList.map((request, index) => (
              <div
                key={index}
                className="flex cursor-pointer justify-between rounded-lg p-3 hover:bg-gray-100"
                onClick={() => handleViewDetail(request.requestId)}
              >
                <div className="w-full">
                  <div>Yêu cầu {contract.requestIdList.length - index}</div>
                  <div>{formatDateToLocal(request.start)}</div>
                </div>
                <RightOutlined />
              </div>
            ))}
          </Space>
        ) : (
          <Empty />
        )}
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
    </>
  );
}

type ViewContractModalProps = {
  open?: boolean;
  setIsModalOpen?: any;
  contract: Contract;
};
