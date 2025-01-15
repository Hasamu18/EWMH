import { Modal } from "../../../../components/modals";
import { Space, TableColumnsType } from "antd";
import { PrimaryButton } from "../../../../components/buttons";
import { Table } from "../../../../components/table";
import UpdatePriceModalButton from "./UpdateRequestPriceModalButton";
import { useCallback, useEffect } from "react";
import { useSpecialUI } from "../../../../hooks/useSpecialUI";
import { useRequest } from "../../../../hooks/useRequest";
import { formatCurrency } from "../../../../utils/helpers";
import { DollarCircleOutlined } from "@ant-design/icons";
import { requestValuesGenerator } from "../../../../utils/generators/requestValues";
import { useTranslation } from "react-i18next";

export function ViewRequestValuesModal({
  isModalVisible,
  setIsModalVisible,
}: {
  isModalVisible: boolean;
  setIsModalVisible: any;
}) {
  const { t } = useTranslation("requests");
  const { state: requestState, handleGetCurrentPriceOfRequest } = useRequest();
  const { state: specialUIState } = useSpecialUI();

  const fetchRooms = useCallback(() => {
    handleGetCurrentPriceOfRequest();
  }, [handleGetCurrentPriceOfRequest]);

  useEffect(() => {
    if (isModalVisible) {
      fetchRooms();
    }
  }, [fetchRooms, isModalVisible]);

  const roomListColumns: TableColumnsType = [
    {
      title: t("request_price_table.name"),
      dataIndex: "name",
      render: (_, { name }) => <div>{requestValuesGenerator(name).name}</div>,
    },
    {
      title: t("request_price_table.description"),
      render: (_, { name }) => (
        <div>{requestValuesGenerator(name).description}</div>
      ),
    },
    {
      title: t("request_price_table.current_price"),
      dataIndex: "value",
      render: (_, { value }) => <div>{formatCurrency(value)}</div>,
    },
    {
      title: "",
      key: "actions",
      render: (_, { value }) => <UpdatePriceModalButton oldPrice={value} />,
    },
  ];

  return (
    <>
      <Modal
        title={
          <Space className="text-base">
            <DollarCircleOutlined />
            <div className="uppercase text-secondary">
              {t("request_price_table.request_price_table")}
            </div>
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
        closeIcon={null}
        width={800}
      >
        <Space direction="vertical" size={20} className="w-full">
          <Table
            columns={roomListColumns}
            dataSource={Object.keys(requestState.requestValues).map((key) => ({
              name: key,
              value: requestState.requestValues[key],
            }))}
            rowKey={(record) => record.key}
            loading={specialUIState.isLoading}
            pagination={{ hideOnSinglePage: true }}
          />
        </Space>
      </Modal>
    </>
  );
}
