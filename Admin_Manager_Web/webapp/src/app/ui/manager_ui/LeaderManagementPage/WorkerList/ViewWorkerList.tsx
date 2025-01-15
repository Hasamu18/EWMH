import { TeamOutlined } from "@ant-design/icons";
import { Space, TableColumnsType } from "antd";
import { useCallback, useEffect } from "react";
import { useSpecialUI } from "../../../../hooks/useSpecialUI";
import { Modal } from "../../../../components/modals";
import { PrimaryButton } from "../../../../components/buttons";
import { Table } from "../../../../components/table";
import { useAccount } from "../../../../hooks/useAccount";
import { User } from "../../../../models/user";
import { Avatar } from "../../../../components/avatar";
import { ViewWorkerDetailButton } from "./ViewWorkerDetails";

export function ViewWorkerListModal({
  leaderId,
  isModalVisible,
  setIsModalVisible,
}: {
  leaderId: string;
  isModalVisible: boolean;
  setIsModalVisible: any;
}) {
  const { state: accountState, handleGetAllWorkerFromLeader } = useAccount();
  const { state: specialUIState } = useSpecialUI();

  const fetchRooms = useCallback(() => {
    handleGetAllWorkerFromLeader({ LeaderId: leaderId });
  }, [handleGetAllWorkerFromLeader, leaderId]);

  useEffect(() => {
    if (isModalVisible) {
      fetchRooms();
    }
  }, [fetchRooms, isModalVisible]);

  const roomListColumns: TableColumnsType<User> = [
    {
      title: "Mã nhân viên",
      dataIndex: "accountId",
    },
    {
      title: "Thông tin nhân viên",
      dataIndex: "fullName",
      render: (_, { avatarUrl, email, fullName }) => (
        <Space direction="horizontal" size={15}>
          <Avatar src={avatarUrl} size={60} />
          <Space direction="vertical">
            <div className="text-base font-bold">{fullName}</div>
            <div>{email}</div>
          </Space>
        </Space>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => <ViewWorkerDetailButton worker={record} />,
    },
  ];

  return (
    <>
      <Modal
        title={
          <Space className="text-base">
            <TeamOutlined />
            <div className="uppercase text-secondary">Danh sách nhân viên</div>
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
        width={"fit-content"}
      >
        <Table
          columns={roomListColumns}
          dataSource={accountState.workerOfLeaderList.users}
          rowKey={(record) => record.accountId}
          loading={specialUIState.isLoading}
          pagination={{ hideOnSinglePage: true }}
        />
      </Modal>
    </>
  );
}
