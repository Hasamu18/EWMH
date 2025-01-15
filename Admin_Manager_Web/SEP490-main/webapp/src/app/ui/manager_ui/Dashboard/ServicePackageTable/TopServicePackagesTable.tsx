import { Table } from "../../../../components/table";
import { Space, TableColumnsType } from "antd";
import { formatCurrency } from "../../../../utils/helpers";
import { useCallback, useEffect } from "react";
import { useServicePackage } from "../../../../hooks/useServicePackage";
import { TopServicePackage } from "../../../../models/service";
import { Avatar } from "../../../../components/avatar";

export default function TopServicePackageTable() {
  const {
    state: servicePackageState,
    handleGetRevenueAndNumberOfPurchaseOfServicePackage,
  } = useServicePackage();

  const fetchTopServicePackages = useCallback(() => {
    handleGetRevenueAndNumberOfPurchaseOfServicePackage({
      NumOfTop: 5,
      ServicePackageId: "",
    });
  }, [handleGetRevenueAndNumberOfPurchaseOfServicePackage]);

  useEffect(() => {
    fetchTopServicePackages();
  }, [fetchTopServicePackages]);

  const topServiceListColumns: TableColumnsType<TopServicePackage> = [
    {
      title: "Số thứ tự",
      dataIndex: "Id",
      render: (_, __, index) => <>{index + 1}</>,
    },
    {
      title: "Gói dịch vụ",
      dataIndex: "Name",
      render: (
        _,
        { numOfRequest, servicePackageImageUrl, servicePackageName },
      ) => (
        <Space direction="horizontal" size={15}>
          <Avatar src={servicePackageImageUrl} size={60} shape="square" />
          <Space direction="vertical">
            <div className="text-base font-bold">{servicePackageName}</div>
            <div>{numOfRequest} lần sửa</div>
          </Space>
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "latestPrice",
      render: (_, { latestPrice }) => {
        return formatCurrency(latestPrice);
      },
    },
    {
      title: "Tổng số lượt mua",
      dataIndex: "totalPurchasedQuantity",
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "totalRevenue",
      render: (_, { totalRevenue }) => {
        return formatCurrency(totalRevenue);
      },
    },
  ];
  return (
    <>
      <Table
        columns={topServiceListColumns}
        dataSource={servicePackageState.topServicePackageList}
        rowKey={(record) => record.servicePackageId}
        loading={servicePackageState.isFetching}
        pagination={{ hideOnSinglePage: true }}
      />
    </>
  );
}
