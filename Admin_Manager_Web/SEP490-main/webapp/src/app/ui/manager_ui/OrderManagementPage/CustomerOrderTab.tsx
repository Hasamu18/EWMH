import { Table } from "../../../components/table";
import { TableColumnsType } from "antd";
import { formatCurrency, formatDateToLocal } from "../../../utils/helpers";
import { Order } from "../../../models/order";
import { ViewDetailButton } from "./ViewOrderDetailModal";
import { useOrder } from "../../../hooks/useOrder";
import { usePagination } from "../../../hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CustomerOrderTab(props: CustomerOrderTabProps) {
  const { t } = useTranslation("orders");
  const { state, handleGetAllOrderPaginated } = useOrder();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [tableParams, setTableParams] = useState<TableParams>();

  const fetchOrders = useCallback(() => {
    handleGetAllOrderPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByPhone: props.searchByPhone,
      DescreasingDateSort: tableParams?.sorter?.["order.purchaseTime"],
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllOrderPaginated,
    props.searchByPhone,
    tableParams?.sorter,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const contractListColumns: TableColumnsType<Order> = [
    {
      title: t("customer_order.order_table.order_id"),
      dataIndex: ["order", "orderId"],
      // render: (_, { order }) => (
      //   <div className="text-base font-bold">{order?.orderId}</div>
      // ),
    },
    {
      title: t("customer_order.order_table.order_customer_name"),
      dataIndex: ["customer", "0", "fullName"],
    },
    {
      title: t("customer_order.order_table.order_customer_phone"),
      dataIndex: ["customer", "0", "phoneNumber"],
    },
    {
      title: t("customer_order.order_table.order_date"),
      dataIndex: ["order", "purchaseTime"],
      render: (value) => <div>{formatDateToLocal(value)}</div>,
      sorter: true,
      sortDirections: ["ascend"],
    },
    {
      title: t("customer_order.order_table.order_total_price"),
      render: (_, { order }) => {
        return <div>{formatCurrency(order?.totalPrice)}</div>;
      },
    },
    {
      title: "",
      key: "actions",
      render: (_, { order }) => <ViewDetailButton orderId={order?.orderId} />,
    },
  ];
  return (
    <>
      <Table
        columns={contractListColumns}
        dataSource={state.currentOrderList.orders}
        rowKey={(record) => record.order?.orderId}
        loading={state.isFetching}
        pagination={{
          showSizeChanger: true,
          total: state.currentOrderList.total,
          pageSize: currentPageSize,
          current: currentPage,
          onChange: (pageIndex, pageSize) => {
            goToPage(pageIndex);
            setPageSize(pageSize);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng ${total} đơn hàng`,
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
};

type TableParams = {
  sorter?: {
    "order.purchaseTime": boolean | undefined;
  };
};
