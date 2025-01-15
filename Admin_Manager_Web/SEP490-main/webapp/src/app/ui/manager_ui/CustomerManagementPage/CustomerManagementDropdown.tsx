import {
  CalendarFilled,
  EllipsisOutlined,
  EyeOutlined,
  MailFilled,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps, Modal, Space } from "antd";
import { Avatar } from "../../../components/avatar";
import { Dropdown } from "../../../components/dropdown";
import { User } from "../../../models/user";
import { Grid } from "../../../components/grids";
import { formatDateToLocal } from "../../../utils/helpers";

const CustomerManagementDropdown = ({ record }: { record: User }) => {
  const [modal, contextHolder] = Modal.useModal();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Xem thông tin chi tiết",
      onClick: handleViewDetail,
      icon: <EyeOutlined />,
    },
  ];

  function handleViewDetail() {
    modal.info({
      icon: <UserOutlined />,
      width: 800,
      title: (
        <div className="text-sm uppercase text-secondary">
          Thông tin của {record.fullName}
        </div>
      ),
      content: (
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={10}>
              <Avatar src={record.avatarUrl} size={150} />
              <div>
                <strong>Họ và Tên: </strong> {record.fullName}
              </div>
            </Space>,
            <Space direction="vertical" size={15}>
              <div className="text-lg font-bold uppercase">
                Thông tin cá nhân
              </div>
              <Space direction="vertical" size={10}>
                <div>
                  <Space direction="horizontal" size={3}>
                    <PhoneFilled />
                    <strong>SĐT:</strong>
                    <span>{record.phoneNumber}</span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <CalendarFilled />
                    <strong>Ngày sinh:</strong>
                    <span>{formatDateToLocal(record.dateOfBirth)}</span>
                  </Space>
                </div>
                <div>
                  <Space
                    direction="horizontal"
                    size={3}
                    className="flex items-start"
                  >
                    <MailFilled />
                    <strong>Email:</strong>
                    <span className="break-all">{record.email}</span>
                  </Space>
                </div>
              </Space>
            </Space>,
          ]}
        />
      ),
      onOk() {},
    });
  }

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <EllipsisOutlined className="text-lg" />
      </Dropdown>
      {contextHolder}
    </>
  );
};

export default CustomerManagementDropdown;
