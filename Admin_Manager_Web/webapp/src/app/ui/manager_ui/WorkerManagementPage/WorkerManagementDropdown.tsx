import {
  CalendarFilled,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  MailFilled,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps, Modal, Space } from "antd";
import { Avatar } from "../../../components/avatar";
import { Dropdown } from "../../../components/dropdown";
import { Worker } from "../../../models/user";
import { useState } from "react";
import ChangeLeaderModal from "./ChangeLeaderModal";
import { Grid } from "../../../components/grids";

const WorkerManagementDropdown = ({
  record,
  callbackFn,
}: {
  record: Worker;
  callbackFn: () => void;
}) => {
  const [modal, contextHolder] = Modal.useModal();
  const [isChangeLeaderModalOpen, setIsChangeLeaderModalOpen] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Xem chi tiết",
      onClick: handleViewDetail,
      icon: <EyeOutlined />,
    },
    {
      key: "2",
      label: "Chọn Trưởng nhóm",
      onClick: () => setIsChangeLeaderModalOpen(true),
      icon: <EditOutlined />,
    },
  ];

  function handleViewDetail() {
    modal.info({
      icon: <UserOutlined />,
      width: 800,
      title: (
        <div className="text-sm uppercase text-secondary">
          Thông tin của {record.item?.fullName}
        </div>
      ),
      content: (
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={10}>
              <Avatar src={record.item?.avatarUrl} size={150} />
              <div>
                <strong>Họ và Tên:</strong> {record.item?.fullName}
              </div>
              <div>
                <strong>Trưởng nhóm:</strong>{" "}
                {record.getLeaderInfo?.accountId
                  ? record.getLeaderInfo?.fullName
                  : "N/A"}
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
                    <span>{record.item?.phoneNumber}</span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <CalendarFilled />
                    <strong>Ngày sinh:</strong>
                    <span>{record.item?.dateOfBirth}</span>
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
                    <span className="break-all">{record.item.email}</span>
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
      <ChangeLeaderModal
        open={isChangeLeaderModalOpen}
        setIsModalOpen={setIsChangeLeaderModalOpen}
        workerId={record.item?.accountId}
        leaderId={record.getLeaderInfo?.accountId}
        callbackFn={callbackFn}
      />
      {contextHolder}
    </>
  );
};

export default WorkerManagementDropdown;
