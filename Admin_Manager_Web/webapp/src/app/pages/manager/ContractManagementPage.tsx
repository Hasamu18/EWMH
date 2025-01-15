import { Form } from "../../components/form";
import { useTitle } from "../../hooks/useTitle";
import { Space, TableColumnsType } from "antd";
import { Contract } from "../../models/contract";
import { contractStatusGenerator } from "../../utils/generators/contractStatus";
import { Input } from "../../components/inputs";
import { Table } from "../../components/table";
import { formatDateToLocal } from "../../utils/helpers";
import ContractManagementDropdown from "../../ui/manager_ui/ContractManagementPage/ContractManagementDropdown";
import { useCallback, useEffect, useState } from "react";
import { usePagination } from "../../hooks/usePagination";
import { useContract } from "../../hooks/useContract";
import { useTranslation } from "react-i18next";

export default function ContractManagementPage() {
  const { t } = useTranslation("contracts");
  useTitle({
    tabTitle: "Contracts - EWMH",
    paths: [{ title: t("contract_list"), path: "/contracts" }],
  });
  const [searchForm] = Form.useForm();
  const { state, handleGetAllContractPaginated } = useContract();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [searchByPhone, setSearchByPhone] = useState<string>();
  const [tableParams, setTableParams] = useState<TableParams>();

  const fetchContracts = useCallback(() => {
    handleGetAllContractPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByPhone: searchByPhone,
      PurchaseTime_Des_Sort:
        tableParams?.sorter?.["item.PurchaseTime_Des_Sort"],
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllContractPaginated,
    searchByPhone,
    tableParams?.sorter,
  ]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const initialValuesSearch = {
    searchString: "",
  };

  const handleSearchSubmit = ({ searchString }: typeof initialValuesSearch) => {
    goToPage(1);
    setSearchByPhone(searchString);
  };

  const contractListColumns: TableColumnsType<Contract> = [
    {
      title: t("contract_table.contract_id"),
      dataIndex: ["item", "contractId"],
    },
    {
      title: t("contract_table.service_package_name"),
      dataIndex: ["item", "name"],
      // render: (_, { item }) => (
      //   <Space direction="vertical">
      //     <div className="text-base font-bold">{item.name}</div>
      //   </Space>
      // ),
    },
    {
      title: t("contract_table.contract_customer_name"),
      dataIndex: ["getCusInfo", "fullName"],
    },
    {
      title: t("contract_table.contract_paid_date"),
      dataIndex: ["item", "purchaseTime"],
      render: (value) => <div>{formatDateToLocal(value)}</div>,
      sorter: true,
      sortDirections: ["descend"],
    },
    {
      title: t("contract_table.contract_total_num_of_request"),
      dataIndex: ["item", "numOfRequest"],
    },
    {
      title: t("contract_table.contract_remaining_num_of_request"),
      dataIndex: ["item", "remainingNumOfRequests"],
    },
    {
      title: t("contract_table.contract_end_date"),
      dataIndex: ["item", "expireDate"],
      render: (value) => <div>{formatDateToLocal(value)}</div>,
    },
    {
      title: t("contract_table.contract_status"),
      render: (_, { item }) => {
        return (
          <div>
            {contractStatusGenerator({
              remaining: item.remainingNumOfRequests,
            })}
          </div>
        );
      },
    },
    {
      title: "",
      key: "actions",
      render: (record) => <ContractManagementDropdown record={record} />,
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
              />
            </Form.Item>
          </Form>
        </div>
        <Table
          columns={contractListColumns}
          dataSource={state.currentContractList.contracts}
          rowKey={(record) => record.item.contractId}
          loading={state.isFetching}
          pagination={{
            showSizeChanger: true,
            total: state.currentContractList.total,
            pageSize: currentPageSize,
            current: currentPage,
            onChange: (pageIndex, pageSize) => {
              goToPage(pageIndex);
              setPageSize(pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng ${total} hợp đồng`,
          }}
          onChange={(_, __, sorter) => {
            setTableParams({
              sorter: {
                "item.PurchaseTime_Des_Sort": Array.isArray(sorter)
                  ? undefined
                  : !(sorter.order === "descend"),
              },
            });
          }}
        />
      </Space>
    </>
  );
}

type TableParams = {
  sorter?: {
    "item.PurchaseTime_Des_Sort"?: boolean | undefined;
  };
};
