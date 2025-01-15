import { useState } from "react";
import {
  CalendarFilled,
  EyeOutlined,
  MailFilled,
  PhoneFilled,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Modal } from "../../../components/modals";
import { Space } from "antd";
import { OutlineButton, PrimaryButton } from "../../../components/buttons";
import { Grid } from "../../../components/grids";
import { PendingCustomer } from "../../../models/user";
import { useAccount } from "../../../hooks/useAccount";
import { formatDateToLocal } from "../../../utils/helpers";
import { Form } from "../../../components/form";
import { Input } from "../../../components/inputs";

export default function VerifyCustomerModalButton({
  customer,
  fetchPendingAccountsPaginated,
}: VerifyCustomerModalProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modal, contextHolder] = Modal.useModal();
  const [disableReasonForm] = Form.useForm();
  const { state: accountState, handleApproveCustomerAccount } = useAccount();

  function handleApprove() {
    handleApproveCustomerAccount({
      values: {
        pendingAccountId: customer.get.pendingAccountId,
        isApproval: true,
        roomIds: customer.get.roomIds,
        reason: null,
      },
      callBackFn: () => {
        setIsModalVisible(false);
        if (fetchPendingAccountsPaginated) {
          fetchPendingAccountsPaginated();
        }
      },
    });
  }

  function handleDisapprove() {
    const initialValuesDisableReason = {
      disableReason: "",
    };

    modal.confirm({
      icon: <WarningOutlined />,
      afterClose: () => {
        disableReasonForm.resetFields();
      },
      title: (
        <div className="flex items-center whitespace-nowrap text-sm">
          <span>Vui lòng nhập lý do từ chối</span>
        </div>
      ),
      content: (
        <Space direction="vertical" className="w-full">
          <Form
            form={disableReasonForm}
            initialValues={initialValuesDisableReason}
            name="DisableReasonForm"
          >
            <Form.Item
              noStyle
              name="disableReason"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "Vui lòng nhập lý do từ chối",
                },
              ]}
            >
              <Input.TextArea placeholder="Nhập ghi chú" />
            </Form.Item>
          </Form>
        </Space>
      ),
      onOk: async () => {
        await disableReasonForm.validateFields().then(async () => {
          const values = disableReasonForm.getFieldsValue(true);

          await handleApproveCustomerAccount({
            values: {
              pendingAccountId: customer.get.pendingAccountId,
              isApproval: false,
              roomIds: customer.get.roomIds,
              reason: values.disableReason,
            },
            callBackFn: () => {
              setIsModalVisible(false);
              if (fetchPendingAccountsPaginated) {
                fetchPendingAccountsPaginated();
              }
            },
          });
        });
      },
    });
  }

  return (
    <>
      <EyeOutlined onClick={() => setIsModalVisible(true)} />
      <Modal
        title={
          <Space className="text-base">
            <UserOutlined />
            <div className="uppercase text-secondary">
              Thông tin của {customer.get.fullName}
            </div>
          </Space>
        }
        open={isModalVisible}
        maskClosable={false}
        footer={[
          <OutlineButton
            key="decline"
            text="Từ chối"
            onClick={() => handleDisapprove()}
            size="middle"
            disabled={accountState.isSending}
          />,
          <PrimaryButton
            key="accept"
            text="Duyệt tài khoản"
            onClick={() => handleApprove()}
            size="middle"
            loading={accountState.isSending}
          />,
        ]}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={15}>
              <div className="text-lg font-bold uppercase">
                Thông tin cá nhân
              </div>
              <Space direction="vertical" size={10}>
                <div>
                  <strong>Họ và Tên:</strong> {customer.get.fullName}
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <strong>Cmt/cccd:</strong>
                    <span>{customer.get.cmT_CCCD}</span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <PhoneFilled />
                    <strong>SĐT:</strong>
                    <span>{customer.get.phoneNumber}</span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <CalendarFilled />
                    <strong>Ngày sinh:</strong>
                    <span>{formatDateToLocal(customer.get.dateOfBirth)}</span>
                  </Space>
                </div>
                <div>
                  <Space direction="horizontal" size={3}>
                    <MailFilled />
                    <strong>Email:</strong>
                    <span>{customer.get.email}</span>
                  </Space>
                </div>
              </Space>
            </Space>,
            <Space direction="vertical" size={15} className="w-full">
              <div className="text-lg font-bold uppercase">
                Thông tin đăng ký
              </div>
              <Space direction="vertical" size={10}>
                <div>
                  <strong>Tên chung cư:</strong> {customer.apartment[0]?.name}
                </div>
                <div>
                  <strong>Căn hộ: </strong>
                  <span>
                    {customer.get.roomIds.map((room) => room).join(", ")}
                  </span>
                </div>
              </Space>
            </Space>,
          ]}
        />
      </Modal>
      {contextHolder}
    </>
  );
}

type VerifyCustomerModalProps = {
  customer: PendingCustomer;
  fetchPendingAccountsPaginated?: () => void;
};
