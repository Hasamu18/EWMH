import {
  CalendarFilled,
  EllipsisOutlined,
  EyeOutlined,
  MailFilled,
  PhoneFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps, Modal, Space } from "antd";
import { Avatar } from "../../../components/avatar";
import { Dropdown } from "../../../components/dropdown";
import { Leader } from "../../../models/user";
import { Grid } from "../../../components/grids";
import { formatDateToLocal } from "../../../utils/helpers";
import { useState } from "react";
import { ViewWorkerListModal } from "./WorkerList/ViewWorkerList";

const LeaderManagementDropdown = ({ record }: { record: Leader }) => {
  const [modal, contextHolder] = Modal.useModal();
  const [isViewWorkerListModalOpen, setIsViewWorkerListModalOpen] =
    useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Xem thông tin chi tiết",
      onClick: handleViewDetail,
      icon: <EyeOutlined />,
    },
    {
      key: "2",
      label: "Xem danh sách nhân viên",
      icon: <TeamOutlined />,
      onClick: () => setIsViewWorkerListModalOpen(true),
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
              <div>
                <strong>Chung cư: </strong>
                {record.name ? record.name : "N/A"}
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
      <ViewWorkerListModal
        leaderId={record.accountId}
        isModalVisible={isViewWorkerListModalOpen}
        setIsModalVisible={setIsViewWorkerListModalOpen}
      />
      {contextHolder}
    </>
  );
};

export default LeaderManagementDropdown;
