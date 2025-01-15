import { Input, Space } from "antd";
import { Form } from "../../../components/form";
import { Modal } from "../../../components/modals";
import { InputDate } from "../../../components/inputs";
import { PrimaryButton } from "../../../components/buttons";
import {
  EditOutlined,
  PlusCircleOutlined,
  SolutionOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Radio from "../../../components/radio/Radio";
// import { Avatar } from "../../components/avatar";
import { roleNameGenerator } from "../../../utils/generators/roleName";
import { formatDateToLocal } from "../../../utils/helpers";
import { User } from "../../../models/user";
import { useAccount } from "../../../hooks/useAccount";
import { ROLE } from "../../../../constants/role";
import { CreatePersonnelAccountParams } from "../../../redux/slice/accountSlice";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function CreateNewAccountModalButton() {
  const { t } = useTranslation("userManagement");
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { handleCreatePersonnelAccount, handleGetAllAccountPaginated } =
    useAccount();

  const initialValues: CreatePersonnelAccountParams = {
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    role: ROLE.leader,
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateAccountModalOk = async () => {
    form.submit();
  };

  const handlePreviewDetail = (values: User) => {
    modal.confirm({
      icon: <WarningOutlined />,
      width: "fit-content",
      title: <div className="text-sm">Bạn có muốn tạo tài khoản</div>,
      content: (
        <Space direction="vertical">
          <div className="text-lg font-bold">{values.fullName}</div>
          <Space direction="horizontal" size={30} className="flex w-full">
            <Space direction="vertical" size={5}>
              <div>
                <strong>Email:</strong> {values.email}
              </div>
              <div>
                <strong>SĐT:</strong> {values.phoneNumber}
              </div>
            </Space>
            <Space direction="vertical" size={5}>
              <div>
                <strong>Vai trò:</strong> {roleNameGenerator(values.role)}
              </div>
              <div>
                <strong>Ngày sinh:</strong>{" "}
                {formatDateToLocal(values.dateOfBirth)}
              </div>
            </Space>
          </Space>
        </Space>
      ),
      onOk: async () => {
        await handleCreatePersonnelAccount({
          values: values,
          callBackFn: () => {
            setIsModalVisible(false);
            handleGetAllAccountPaginated({
              PageIndex: 1,
              Pagesize: 8,
              Role: values.role,
            });
          },
        });
      },
    });
  };

  return (
    <>
      <PrimaryButton
        text={t("create_new_user.title")}
        icon={<PlusCircleOutlined />}
        onClick={showModal}
      />
      <Modal
        title={
          <Space>
            <EditOutlined className="text-sm" />
            <div className="text-sm uppercase text-secondary">
              {t("create_new_user.title")}
            </div>
          </Space>
        }
        maskClosable={false}
        open={isModalVisible}
        afterClose={() => {
          form.resetFields();
        }}
        onOk={handleCreateAccountModalOk}
        onCancel={() => setIsModalVisible(false)}
        closeIcon={null}
        // confirmLoading={state.isSending}
        modalRender={(dom) => (
          <Form
            form={form}
            initialValues={initialValues}
            name="CreateAccountForm"
            onFinish={(values) => handlePreviewDetail(values)}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <div className="w-[100%]">
          <Form.Item
            name="fullName"
            label={t("create_new_user.full_name")}
            rules={[
              {
                type: "string",
                required: true,
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Nhập họ và tên" size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            label={t("create_new_user.email")}
            rules={[{ type: "email", required: true }]}
          >
            <Input placeholder="Nhập email" size="large" />
          </Form.Item>
          <Space className="flex w-full justify-between">
            <Form.Item
              name="phoneNumber"
              label={t("create_new_user.phoneNumber")}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Số điện thoại không được để trống",
                },
                {
                  validator: (_, value) => {
                    // Strip spaces and validate the number
                    const normalizedValue = value.replace(/\s+/g, "");
                    const isValid =
                      /^0[35789]\d{8}$/.test(normalizedValue) ||
                      /^01\d{9}$/.test(normalizedValue);
                    if (isValid) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Số điện thoại không hợp lệ"),
                    );
                  },
                },
              ]}
            >
              <Input placeholder="Nhập SĐT" size="large" />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label={t("create_new_user.dob")}
              rules={[{ required: true }]}
            >
              <InputDate
                placeholder="Chọn ngày sinh"
                size="large"
                minDate={dayjs("31-12-1939", "DD-MM-YYYY")}
                maxDate={dayjs("31-12-2000", "DD-MM-YYYY")}
              />
            </Form.Item>
          </Space>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Radio.ButtonGroup
              items={[
                {
                  icon: <SolutionOutlined />,
                  enName: "Team Leader",
                  vnName: "Trưởng nhóm",
                  value: ROLE.leader,
                },
                {
                  icon: <TeamOutlined />,
                  enName: "Worker",
                  vnName: "Nhân viên",
                  value: ROLE.worker,
                },
              ]}
              render={(item) => (
                <div className="rounded-lg border-2 border-solid border-secondary bg-white px-10 py-5 text-secondary">
                  <Space direction="vertical" size={2} className="w-full">
                    <div className="text-lg">{item?.icon}</div>
                    <div className="text-base">{item?.enName}</div>
                    <div>{item?.vnName}</div>
                  </Space>
                </div>
              )}
              activeRender={(item) => (
                <div className="rounded-lg bg-secondary px-10 py-5 text-white">
                  <Space direction="vertical" size={2} className="w-full">
                    <div className="text-lg">{item?.icon}</div>
                    <div className="text-base">{item?.enName}</div>
                    <div>{item?.vnName}</div>
                  </Space>
                </div>
              )}
            />
          </Form.Item>
        </div>
      </Modal>
      {contextHolder}
    </>
  );
}
