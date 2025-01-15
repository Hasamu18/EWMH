import { useEffect } from "react";
import { Modal } from "../../../../components/modals";
import { Space } from "antd";
import {
  CalendarFilled,
  MailFilled,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { useAccount } from "../../../../hooks/useAccount";
import { Grid } from "../../../../components/grids";
import { formatDateToLocal } from "../../../../utils/helpers";
import { PrimaryButton } from "../../../../components/buttons";

export default function CustomerDetailsModal({
  open,
  setOpen,
  customerEmail,
}: CustomerDetailsModalProps) {
  const { state: accountState, handleGetAllAccountPaginated } = useAccount();

  useEffect(() => {
    if (open) {
      handleGetAllAccountPaginated({
        SearchByEmail: customerEmail,
        PageIndex: 1,
        Pagesize: 1,
      });
    }
  }, [customerEmail, handleGetAllAccountPaginated, open]);

  return (
    <Modal
      title={
        <Space className="text-base">
          <UserOutlined />
          <div className="uppercase text-secondary">
            Thông tin của {accountState.currentUserList.users[0]?.fullName}
          </div>
        </Space>
      }
      open={open}
      maskClosable={false}
      footer={[
        <PrimaryButton
          key="accept"
          text="Đóng"
          onClick={() => setOpen(false)}
          size="middle"
        />,
      ]}
      onCancel={() => setOpen(false)}
      loading={accountState.isFetching}
    >
      <Grid
        className="text-sm"
        items={[
          <Space direction="vertical" size={15}>
            <div className="text-lg font-bold uppercase">Thông tin cá nhân</div>
            <Space direction="vertical" size={10}>
              <div>
                <strong>Họ và Tên:</strong>{" "}
                {accountState.currentUserList.users?.[0]?.fullName}
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <PhoneFilled />
                  <strong>SĐT:</strong>
                  <span>
                    {accountState.currentUserList.users[0]?.phoneNumber}
                  </span>
                </Space>
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <CalendarFilled />
                  <strong>Ngày sinh:</strong>
                  <span>
                    {formatDateToLocal(
                      accountState.currentUserList.users[0]?.dateOfBirth,
                    )}
                  </span>
                </Space>
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <MailFilled />
                  <strong>Email:</strong>
                  <span>{accountState.currentUserList.users[0]?.email}</span>
                </Space>
              </div>
            </Space>
          </Space>,
        ]}
      />
    </Modal>
  );
}

type CustomerDetailsModalProps = {
  customerEmail: string;
  open: boolean;
  setOpen: any;
};
