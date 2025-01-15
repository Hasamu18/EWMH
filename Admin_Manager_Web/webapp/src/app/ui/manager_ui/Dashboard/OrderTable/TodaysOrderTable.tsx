import { Table } from "../../../../components/table";
import { TableColumnsType } from "antd";
import { formatCurrency, formatDateToLocal } from "../../../../utils/helpers";
import { Order } from "../../../../models/order";
import { ViewDetailButton } from "./ViewOrderDetailModal";
import { useOrder } from "../../../../hooks/useOrder";
import { usePagination } from "../../../../hooks/usePagination";
import { useCallback, useEffect } from "react";

export default function TodaysOrderTable() {
  const { state, handleGetTodaysOrderPaginated } = useOrder();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();

  const fetchOrders = useCallback(() => {
    handleGetTodaysOrderPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      Date: new Date().toISOString(),
    });
  }, [currentPage, currentPageSize, handleGetTodaysOrderPaginated]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const todaysOrderListColumns: TableColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: ["order", "orderId"],
      // render: (_, { order }) => (
      //   <div className="text-base font-bold">{order?.orderId}</div>
      // ),
    },
    {
      title: "Khách hàng",
      dataIndex: ["customer", "0", "fullName"],
    },
    {
      title: "SĐT",
      dataIndex: ["customer", "0", "phoneNumber"],
    },
    {
      title: "Ngày đặt",
      dataIndex: ["order", "purchaseTime"],
      render: (value) => <div>{formatDateToLocal(value, true)}</div>,
      sorter: true,
      sortDirections: ["ascend"],
    },
    {
      title: "Tổng giá",
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
        columns={todaysOrderListColumns}
        dataSource={state.todaysOrderList.orders}
        rowKey={(record) => record.order?.orderId}
        loading={state.isFetching}
        pagination={{
          showSizeChanger: true,
          total: state.todaysOrderList.total,
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
      />
    </>
  );
}
