import { Space, TableColumnsType } from "antd";
import { StarFilled } from "@ant-design/icons";
import { Avatar } from "../../../../components/avatar";
import { Table } from "../../../../components/table";
import { Request } from "../../../../models/request";
import { User } from "../../../../models/user";
import { formatDateToLocal } from "../../../../utils/helpers";

export default function WorkerTable({
  workers,
}: {
  workers?: Request["workerList"];
}) {
  const contractListColumns: TableColumnsType<{
    getWokerInfo: User;
    isLead: boolean;
  }> = [
    {
      title: "Mã nhân viên",
      dataIndex: ["getWokerInfo", "accountId"],
    },
    {
      title: "Thông tin nhân viên",
      dataIndex: ["getWokerInfo", "fullName"],
      render: (_, { getWokerInfo }) => (
        <Space direction="horizontal" size={15}>
          <Avatar src={getWokerInfo.avatarUrl} size={60} />
          <Space direction="vertical">
            <div className="text-base font-bold">{getWokerInfo.fullName}</div>
            <div>{getWokerInfo.email}</div>
          </Space>
        </Space>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: ["getWokerInfo", "dateOfBirth"],
      render: (_, { getWokerInfo }) => {
        return <div>{formatDateToLocal(getWokerInfo.dateOfBirth)}</div>;
      },
    },
    {
      title: "SĐT",
      dataIndex: ["getWokerInfo", "phoneNumber"],
    },
    {
      title: "",
      key: "actions",
      render: (_, { isLead }) => (isLead ? <StarFilled /> : null),
    },
  ];
  return (
    <Table
      columns={contractListColumns}
      dataSource={workers}
      rowKey={(record) => record.getWokerInfo.accountId}
      pagination={false}
    />
  );
}
