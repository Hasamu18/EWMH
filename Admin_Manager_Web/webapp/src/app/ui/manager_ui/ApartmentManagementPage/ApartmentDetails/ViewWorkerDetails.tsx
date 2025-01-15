import { useState } from "react";
import {
  CalendarFilled,
  EyeOutlined,
  MailFilled,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Modal } from "../../../../components/modals";
import { Space } from "antd";
import { Grid } from "../../../../components/grids";
import { PrimaryButton } from "../../../../components/buttons";
import { User } from "../../../../models/user";
import { Avatar } from "../../../../components/avatar";
import { formatDateToLocal } from "../../../../utils/helpers";

export function ViewWorkerDetailButton({ worker }: { worker: User }) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <>
      <EyeOutlined onClick={() => setIsModalVisible(true)} />
      <Modal
        title={
          <Space className="text-base">
            <UserOutlined />
            <div className="uppercase text-secondary">
              Thông tin của {worker.fullName}
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
        width={750}
      >
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={10}>
              <Avatar src={worker.avatarUrl} size={150} />
              <div>
                <strong>Họ và Tên:</strong> {worker.fullName}
              </div>
              {/* <div>
                <strong>Trưởng nhóm:</strong>{" "}
                {record.getLeaderInfo?.accountId
                  ? record.getLeaderInfo?.fullName
                  : "N/A"}
              </div> */}
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
                    <span>{worker.phoneNumber}</span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <CalendarFilled />
                    <strong>Ngày sinh:</strong>
                    <span>{formatDateToLocal(worker.dateOfBirth)}</span>
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
                    <span className="break-all">{worker.email}</span>
                  </Space>
                </div>
              </Space>
            </Space>,
          ]}
        />
      </Modal>
    </>
  );
}
