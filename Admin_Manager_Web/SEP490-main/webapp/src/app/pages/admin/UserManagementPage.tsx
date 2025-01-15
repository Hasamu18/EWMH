import { App, Space, TableColumnsType, Tag } from "antd";
import { Avatar } from "../../components/avatar";
import { Form } from "../../components/form";
import { Input } from "../../components/inputs";
import { Table } from "../../components/table";
import { useTitle } from "../../hooks/useTitle";
import CreateNewAccountModalButton from "../../ui/admin_ui/UserManagementPage/CreateNewAccountModalButton";
import UserManagementDropdown from "../../ui/admin_ui/UserManagementPage/UserManagementDropdown";
import { statusGenerator } from "../../utils/generators/status";
import { roleNameGenerator } from "../../utils/generators/roleName";

import { Modal } from "../../components/modals";
import { WarningOutlined } from "@ant-design/icons";
import { ROLE } from "../../../constants/role";
import { User } from "../../models/user";
import { useAccount } from "../../hooks/useAccount";
import { useCallback, useEffect, useState } from "react";
import { usePagination } from "../../hooks/usePagination";
import { useTranslation } from "react-i18next";

export default function UserManagementPage() {
  const { t } = useTranslation("userManagement");
  const { notification } = App.useApp();
  useTitle({ tabTitle: "User Management - EWMH" });
  const [modal, contextHolder] = Modal.useModal();
  const [searchForm] = Form.useForm();
  const [disableReasonForm] = Form.useForm();
  const { state, handleGetAllAccountPaginated, handleDisableUser } =
    useAccount();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [searchByEmail, setSearchByEmail] = useState<string>();
  const [filters, setFilters] = useState<{
    isDisabled?: boolean[];
    role?: string[];
  }>();

  const fetchAccounts = useCallback(() => {
    handleGetAllAccountPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByEmail: searchByEmail,
      IsDisabled: filters?.isDisabled?.[0],
      Role: filters?.role?.[0],
    });
  }, [
    currentPage,
    currentPageSize,
    filters?.isDisabled,
    filters?.role,
    handleGetAllAccountPaginated,
    searchByEmail,
  ]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const initialValuesSearch = {
    searchString: "",
  };

  const handleSearchSubmit = ({ searchString }: typeof initialValuesSearch) => {
    goToPage(1);
    setSearchByEmail(searchString);
  };

  function handleConfirmLock(accountId: string) {
    const initialValuesDisableReason = {
      disabledReason: "",
    };

    modal.confirm({
      icon: <WarningOutlined />,
      width: "fit-content",
      afterClose: () => {
        disableReasonForm.resetFields();
      },
      title: (
        <div className="flex items-center whitespace-nowrap text-sm">
          <span>Bạn có muốn đổi trạng thái thành</span>
          <Tag color="volcano" className="mx-1">
            Vô hiệu hóa
          </Tag>
          <span>?</span>
        </div>
      ),
      content: (
        <Space direction="vertical" className="w-full">
          <div className="text-base text-secondary">Ghi chú</div>
          <Form
            form={disableReasonForm}
            initialValues={initialValuesDisableReason}
            name="DisableReasonForm"
          >
            <Form.Item
              noStyle
              name="disabledReason"
              rules={[
                {
                  type: "string",
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

          await handleDisableUser({
            accountId: accountId,
            disable: true,
            disabledReason: values.disabledReason,
          });
          fetchAccounts();
        });
      },
    });
  }

  function handleConfirmUnlock(accountId: string) {
    modal.confirm({
      icon: <WarningOutlined />,
      width: "fit-content",
      title: (
        <div className="flex items-center whitespace-nowrap text-sm">
          <span>Bạn có muốn đổi trạng thái thành</span>
          <Tag color="green" className="mx-1">
            Đang hoạt động
          </Tag>
          <span>?</span>
        </div>
      ),
      onOk: async () => {
        await handleDisableUser({
          accountId: accountId,
          disable: false,
          disabledReason: "",
        });
        fetchAccounts();
      },
    });
  }

  const userListColumns: TableColumnsType<User> = [
    {
      title: t("user_table.name"),
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
      title: t("user_table.role"),
      dataIndex: "role",
      render: (_, { role }) => (
        <div className="text-sm">{roleNameGenerator(role)}</div>
      ),
      filters: [
        {
          text: "Quản trị viên",
          value: ROLE.admin,
        },
        {
          text: "Quản lý",
          value: ROLE.manager,
        },
        {
          text: "Trưởng nhóm",
          value: ROLE.leader,
        },
        {
          text: "Nhân viên",
          value: ROLE.worker,
        },
        {
          text: "Khách hàng",
          value: ROLE.customer,
        },
      ],
    },
    {
      title: t("user_table.status"),
      dataIndex: "isDisabled",
      render: (_, { isDisabled, accountId, role }) => {
        return (
          <>
            {[ROLE.customer].includes(role) ? (
              <div
                onClick={() =>
                  isDisabled
                    ? handleConfirmUnlock(accountId)
                    : handleConfirmLock(accountId)
                }
                className="w-fit cursor-pointer"
              >
                {statusGenerator(isDisabled)}
              </div>
            ) : (
              <div
                className="w-fit cursor-pointer"
                onClick={() => {
                  notification.info({
                    message: "Không thể vô hiệu hóa tài khoản",
                    description: (
                      <>
                        Không thể vô hiệu hóa tài khoản có chức vụ{" "}
                        <span className="font-bold">
                          {roleNameGenerator(role)}
                        </span>
                      </>
                    ),
                    placement: "topRight",
                  });
                }}
              >
                {statusGenerator(isDisabled)}
              </div>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Hoạt động",
          value: false,
        },
        {
          text: "Vô hiệu hóa",
          value: true,
        },
      ],
    },
    {
      title: t("user_table.notes"),
      dataIndex: "disabledReason",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => <UserManagementDropdown record={record} />,
    },
  ];

  return (
    <div className="px-10 py-10">
      <Space direction="vertical" size={20} className="w-full">
        <div className="flex justify-end">
          <CreateNewAccountModalButton />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-semibold text-primary">
            {t("user_list")}
          </div>
          <Form
            form={searchForm}
            initialValues={initialValuesSearch}
            name="SearchForm"
            onFinish={handleSearchSubmit}
            className="w-1/2"
          >
            <Form.Item
              noStyle
              name="searchString"
              rules={[
                {
                  type: "string",
                  whitespace: true,
                  message: "",
                },
              ]}
            >
              <Input.Search
                placeholder={t("find_by_email")}
                onSearch={() => searchForm.submit()}
                onClear={() => {
                  searchForm.setFieldValue("searchString", "");
                  searchForm.submit();
                }}
              />
            </Form.Item>
          </Form>
        </div>
        <Table
          columns={userListColumns}
          dataSource={state.currentUserList.users}
          rowKey={(record) => record.accountId}
          loading={state.isFetching}
          pagination={{
            total: state.currentUserList.total,
            pageSize: currentPageSize,
            current: currentPage,
            onChange: (pageIndex, pageSize) => {
              goToPage(pageIndex);
              setPageSize(pageSize);
            },
          }}
          onChange={(_, filters) => {
            setFilters(filters);
          }}
        />
      </Space>
      {contextHolder}
    </div>
  );
}
