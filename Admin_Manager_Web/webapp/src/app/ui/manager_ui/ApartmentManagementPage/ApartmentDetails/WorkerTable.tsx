import { Space, TableColumnsType } from "antd";
import { Avatar } from "../../../../components/avatar";
import { Table } from "../../../../components/table";
import { User } from "../../../../models/user";
import { ViewWorkerDetailButton } from "./ViewWorkerDetails";

export default function WorkerTable({
  workers,
  leader,
}: {
  leader: User;
  workers: User[];
}) {
  const data = [leader].concat(workers);

  const contractListColumns: TableColumnsType<User> = [
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      render: (_, { avatarUrl, fullName, email }) => (
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
      title: "Chức vụ",
      dataIndex: "role",
      render: (_, record) => {
        if (record.accountId === leader.accountId) {
          return "Trưởng nhóm";
        }
        return "Nhân viên";
      },
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
    <Table
      columns={contractListColumns}
      dataSource={data}
      rowKey={(record) => record.accountId}
      pagination={false}
    />
  );
}
