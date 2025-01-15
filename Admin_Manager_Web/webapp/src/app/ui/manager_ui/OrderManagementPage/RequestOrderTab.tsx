import { TableColumnsType } from "antd";
import { formatCurrency, formatDateToLocal } from "../../../utils/helpers";
import { RequestOrder } from "../../../models/order";
import { Table } from "../../../components/table";
import RequestOrderDropdown from "./RequestOrderDropdown";
import { useOrder } from "../../../hooks/useOrder";
import { usePagination } from "../../../hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RequestOrderTab(props: CustomerOrderTabProps) {
  const { t } = useTranslation("orders");
  const { state: orderState, handleGetAllRequestOrderPaginated } = useOrder();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [tableParams, setTableParams] = useState<TableParams>();

  const fetchOrders = useCallback(() => {
    handleGetAllRequestOrderPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByPhone: props.searchByPhone,
      DescreasingDateSort: tableParams?.sorter?.["order.purchaseTime"],
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllRequestOrderPaginated,
    props.searchByPhone,
    tableParams?.sorter,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const contractListColumns: TableColumnsType<RequestOrder> = [
    {
      title: t("request_order.order_table.request_id"),
      dataIndex: ["order", "requestId"],
      // render: (_, { order }) => (
      //   <div className="text-base font-bold">{order.requestId}</div>
      // ),
    },
    {
      title: t("request_order.order_table.order_customer_name"),
      dataIndex: ["customer_Leader", "0", "fullName"],
    },
    {
      title: t("request_order.order_table.order_customer_phone"),
      dataIndex: ["customer_Leader", "0", "phoneNumber"],
    },
    {
      title: t("request_order.order_table.order_date"),
      dataIndex: ["order", "purchaseTime"],
      render: (value) => <div>{formatDateToLocal(value)}</div>,
      sorter: true,
      sortDirections: ["ascend"],
    },
    {
      title: t("request_order.order_table.order_total_price"),
      render: (_, { order }) => {
        return <div>{formatCurrency(order.totalPrice)}</div>;
      },
    },
    {
      title: t("request_order.order_table.order_leader_name"),
      dataIndex: ["customer_Leader", "1", "fullName"],
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <RequestOrderDropdown requestOrder={record} setOpen={props.setOpen} />
      ),
    },
  ];
  return (
    <>
      <Table
        columns={contractListColumns}
        dataSource={orderState.currentRequestOrderList.orders}
        rowKey={(record) => record.order.requestId}
        loading={orderState.isFetching}
        pagination={{
          showSizeChanger: true,
          total: orderState.currentOrderList.total,
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
        onChange={(_, __, sorter) => {
          setTableParams({
            sorter: {
              "order.purchaseTime": Array.isArray(sorter)
                ? undefined
                : !(sorter.order === "ascend"),
            },
          });
        }}
      />
    </>
  );
}

type CustomerOrderTabProps = {
  searchByPhone?: string;
  setOpen: any;
};

type TableParams = {
  sorter?: {
    "order.purchaseTime": boolean | undefined;
  };
};
