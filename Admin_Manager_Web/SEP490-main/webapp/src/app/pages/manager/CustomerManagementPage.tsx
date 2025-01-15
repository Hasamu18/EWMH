import { Space, TableColumnsType, Tag } from "antd";
import { Avatar } from "../../components/avatar";
import { Form } from "../../components/form";
import { Input } from "../../components/inputs";
import { Table } from "../../components/table";
import { useTitle } from "../../hooks/useTitle";
import { statusGenerator } from "../../utils/generators/status";
import { Customer, User } from "../../models/user";
import CustomerManagementDropdown from "../../ui/manager_ui/CustomerManagementPage/CustomerManagementDropdown";
import { Modal } from "../../components/modals";
import { WarningOutlined } from "@ant-design/icons";
import { useAccount } from "../../hooks/useAccount";
import { usePagination } from "../../hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { ROLE } from "../../../constants/role";
import { useTranslation } from "react-i18next";

export default function CustomerManagementPage() {
  const { t } = useTranslation("customers");
  useTitle({
    tabTitle: "Customers - EWMH",
    paths: [{ title: t("customer_list"), path: "/customers" }],
  });
  const [modal, contextHolder] = Modal.useModal();
  const [searchForm] = Form.useForm();
  const [disableReasonForm] = Form.useForm();
  const { state, handleGetAllAccountPaginated, handleDisableUser } =
    useAccount();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [searchByName, setSearchByName] = useState<string>();
  const [tableParams, setTableParams] = useState<TableParams>();

  const fetchCustomers = useCallback(() => {
    handleGetAllAccountPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByEmail: searchByName,
      IsDisabled: tableParams?.filters?.isDisabled?.[0],
      Role: ROLE.customer,
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllAccountPaginated,
    searchByName,
    tableParams?.filters?.isDisabled,
  ]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const initialValuesSearch = {
    searchString: "",
  };

  const handleSearchSubmit = ({ searchString }: typeof initialValuesSearch) => {
    goToPage(1);
    setSearchByName(searchString);
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
          fetchCustomers();
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
        fetchCustomers();
      },
    });
  }

  const customerListColumns: TableColumnsType<User> = [
    {
      title: t("customer_table.customer_info"),
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
      title: t("customer_table.customer_phone"),
      dataIndex: "phoneNumber",
    },
    {
      title: t("customer_table.customer_status"),
      dataIndex: "isDisabled",
      render: (_, { isDisabled, accountId }) => {
        return (
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
      title: t("customer_table.customer_notes"),
      dataIndex: "disabledReason",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => <CustomerManagementDropdown record={record} />,
    },
  ];

  return (
    <>
      <Space direction="vertical" size={20} className="w-full">
        <div className="flex items-center justify-end">
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
                placeholder={t("search_by_email")}
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
          columns={customerListColumns}
          dataSource={state.currentUserList.users as Customer[]}
          rowKey={(record) => record.accountId}
          loading={state.isFetching}
          pagination={{
            showSizeChanger: true,
            total: state.currentUserList.total,
            pageSize: currentPageSize,
            current: currentPage,
            onChange: (pageIndex, pageSize) => {
              goToPage(pageIndex);
              setPageSize(pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng ${total} khách hàng`,
            pageSizeOptions: [5, 10, 20, 50, 100],
          }}
          onChange={(_, filters) => {
            setTableParams({
              filters: filters,
            });
          }}
        />
      </Space>
      {contextHolder}
    </>
  );
}

type TableParams = {
  filters?: {
    isDisabled?: boolean[];
  };
};
