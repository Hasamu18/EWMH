import {
  CalendarFilled,
  EllipsisOutlined,
  EyeOutlined,
  MailFilled,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps, Modal, Space } from "antd";
import { User } from "../../../models/user";
import { Avatar } from "../../../components/avatar";
import { roleNameGenerator } from "../../../utils/generators/roleName";
import { Dropdown } from "../../../components/dropdown";
import { formatDateToLocal } from "../../../utils/helpers";
import { Grid } from "../../../components/grids";

const UserManagementDropdown = ({ record }: { record: User }) => {
  const [modal, contextHolder] = Modal.useModal();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Xem thông tin tài khoản",
      onClick: handleViewDetail,
      icon: <EyeOutlined />,
    },
  ];

  function handleViewDetail() {
    modal.info({
      icon: <UserOutlined />,
      width: 700,
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
                <strong>Họ và Tên:</strong> {record.fullName}
              </div>
              <div>
                <strong>Vai trò:</strong> {roleNameGenerator(record.role)}
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

export default UserManagementDropdown;
