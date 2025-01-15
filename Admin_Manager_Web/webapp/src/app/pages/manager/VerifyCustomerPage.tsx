import { Form } from "../../components/form";
import { useTitle } from "../../hooks/useTitle";
import { Space, TableColumnsType, Tag } from "antd";
import { Input } from "../../components/inputs";
import { PendingCustomer } from "../../models/user";
import { Table } from "../../components/table";
import VerifyCustomerModalButton from "../../ui/manager_ui/VerifyCustomerPage/VerifyCustomerModalButton";
import { useAccount } from "../../hooks/useAccount";
import { usePagination } from "../../hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function VerifyCustomerPage() {
  const { t } = useTranslation("customerVerify");
  useTitle({
    tabTitle: "Customer Verify - EWMH",
    paths: [{ title: t("verify_request_list"), path: "/customer-verify" }],
  });
  const [searchForm] = Form.useForm();
  const { state, handleGetAllPendingAccountPaginated } = useAccount();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [searchByPhone, setSearchByPhone] = useState<string>();

  const fetchPendingAccountsPaginated = useCallback(() => {
    handleGetAllPendingAccountPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByPhone: searchByPhone,
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllPendingAccountPaginated,
    searchByPhone,
  ]);

  useEffect(() => {
    fetchPendingAccountsPaginated();
  }, [fetchPendingAccountsPaginated]);

  const initialValuesSearch = {
    searchString: "",
  };

  const handleSearchSubmit = ({ searchString }: typeof initialValuesSearch) => {
    goToPage(1);
    setSearchByPhone(searchString);
  };

  const pendingAccountListColumns: TableColumnsType<PendingCustomer> = [
    {
      title: t("approve_request_request_table.approve_request_request_info"),
      dataIndex: "fullName",
      render: (_, { get }) => (
        <Space direction="horizontal" size={15}>
          <Space direction="vertical">
            <div className="text-base font-bold">{get.fullName}</div>
            <div>{get.email}</div>
          </Space>
        </Space>
      ),
    },
    {
      title: t("approve_request_request_table.approve_request_request_phone"),
      dataIndex: ["get", "phoneNumber"],
    },
    {
      title: t(
        "approve_request_request_table.approve_request_request_apartment",
      ),
      dataIndex: ["apartment", "0", "name"],
    },
    {
      title: t(
        "approve_request_request_table.approve_request_request_apartment_room",
      ),
      dataIndex: ["get", "roomIds"],
      render: (_, { get }) => (
        <>
          {get.roomIds.map((tag) => {
            return (
              <Tag color="green" key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <VerifyCustomerModalButton
          customer={record}
          fetchPendingAccountsPaginated={fetchPendingAccountsPaginated}
        />
      ),
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
                placeholder={t("search_by_phone")}
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
          columns={pendingAccountListColumns}
          dataSource={state.currentPendingAccountList.users}
          rowKey={(record) => record.get.pendingAccountId}
          loading={state.isFetching}
          pagination={{
            showSizeChanger: true,
            total: state.currentPendingAccountList.total,
            pageSize: currentPageSize,
            current: currentPage,
            onChange: (pageIndex, pageSize) => {
              goToPage(pageIndex);
              setPageSize(pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng ${total} yêu cầu`,
            pageSizeOptions: [5, 10, 20, 50, 100],
          }}
        />
      </Space>
    </>
  );
}
