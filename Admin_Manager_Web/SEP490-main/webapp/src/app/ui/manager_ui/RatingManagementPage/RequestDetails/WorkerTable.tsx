import { Space, TableColumnsType } from "antd";
import { StarFilled } from "@ant-design/icons";
import { Avatar } from "../../../../components/avatar";
import { Table } from "../../../../components/table";
import { Request } from "../../../../models/request";
import { User } from "../../../../models/user";

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
      title: "Họ và Tên",
      dataIndex: "fullName",
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
