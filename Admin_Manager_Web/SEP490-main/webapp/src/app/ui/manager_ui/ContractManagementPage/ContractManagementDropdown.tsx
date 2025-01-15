import {
  CalendarFilled,
  DownloadOutlined,
  EllipsisOutlined,
  EyeOutlined,
  HistoryOutlined,
  MailFilled,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps, Modal, Space } from "antd";
import { Avatar } from "../../../components/avatar";
import { Dropdown } from "../../../components/dropdown";
import { Contract } from "../../../models/contract";
import { Grid } from "../../../components/grids";
import { formatDateToLocal } from "../../../utils/helpers";
import ViewRequestHistoryModal from "./RequestHistory/ViewRequestHistory";
import { useState } from "react";

const ContractManagementDropdown = ({ record }: { record: Contract }) => {
  const [modal, contextHolder] = Modal.useModal();
  const [isViewRequestHistoryModalOpen, setIsViewRequestHistoryModalOpen] =
    useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Xem chi tiết khách hàng",
      onClick: handleViewDetail,
      icon: <EyeOutlined />,
    },
    {
      key: "2",
      label: "Tải hợp đồng",
      onClick: () => {
        window.open(record.item.fileUrl);
      },
      icon: <DownloadOutlined />,
    },
    {
      key: "3",
      label: "Lịch sử yêu cầu",
      onClick: () => setIsViewRequestHistoryModalOpen(true),
      icon: <HistoryOutlined />,
    },
  ];

  function handleViewDetail() {
    modal.info({
      icon: <UserOutlined />,
      width: 750,
      title: (
        <div className="text-sm uppercase text-secondary">
          Thông tin của {record.getCusInfo.fullName}
        </div>
      ),
      content: (
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={10}>
              <Avatar src={record.getCusInfo.avatarUrl} size={150} />
              <div>
                <strong>Họ và Tên:</strong> {record.getCusInfo.fullName}
              </div>
              <div>
                <strong>CCCD: </strong>
                {record.getCusInfo.cmT_CCCD}
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
                    <span>{record.getCusInfo.phoneNumber}</span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <CalendarFilled />
                    <strong>Ngày sinh:</strong>
                    <span>
                      {formatDateToLocal(record.getCusInfo.dateOfBirth)}
                    </span>
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
                    <span className="break-all">{record.getCusInfo.email}</span>
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
      <ViewRequestHistoryModal
        contract={record}
        open={isViewRequestHistoryModalOpen}
        setIsModalOpen={setIsViewRequestHistoryModalOpen}
      />
      {contextHolder}
    </>
  );
};

export default ContractManagementDropdown;
