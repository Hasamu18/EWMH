import {
  BarChartOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { useState } from "react";
import { Dropdown } from "../../../components/dropdown";
import { Product } from "../../../models/product";
import UpdateProductModal from "./UpdateProductModal";
import ViewProductDetailsModal from "./ViewProductDetailsModal";
import ViewProductStatisticsModal from "./ViewProductStatisticsModal";
import { useTranslation } from "react-i18next";

const ProductManagementDropdown = ({
  record,
  fetchProducts,
}: {
  record: Product;
  fetchProducts: any;
}) => {
  const { t } = useTranslation("products");
  const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] =
    useState(false);
  const [
    isViewProductStatisticsModalOpen,
    setIsViewProductStatisticsModalOpen,
  ] = useState(false);
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: t("dropdown.view_product_details"),
      onClick: () => setIsViewProductModalOpen(true),
      icon: <EyeOutlined />,
    },
    {
      key: "2",
      label: t("dropdown.update_product_details"),
      onClick: () => setIsUpdateProductModalOpen(true),
      icon: <EditOutlined />,
    },
    {
      key: "3",
      label: t("dropdown.view_statistics"),
      onClick: () => setIsViewProductStatisticsModalOpen(true),
      icon: <BarChartOutlined />,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <EllipsisOutlined className="text-lg" />
      </Dropdown>
      <UpdateProductModal
        open={isUpdateProductModalOpen}
        setIsModalOpen={setIsUpdateProductModalOpen}
        product={record}
        fetchProducts={fetchProducts}
      />
      <ViewProductDetailsModal
        open={isViewProductModalOpen}
        setIsModalOpen={setIsViewProductModalOpen}
        product={record}
      />
      <ViewProductStatisticsModal
        open={isViewProductStatisticsModalOpen}
        setIsModalOpen={setIsViewProductStatisticsModalOpen}
        product={record}
      />
    </>
  );
};

export default ProductManagementDropdown;
