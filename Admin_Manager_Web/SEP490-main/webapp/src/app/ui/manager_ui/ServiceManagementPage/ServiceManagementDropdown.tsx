import {
  BarChartOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Dropdown } from "../../../components/dropdown";
import { ServicePackage } from "../../../models/service";
import { useState } from "react";
import UpdateServiceModal from "./UpdateServiceModal";
import ViewServicePackageDetailsModal from "./ViewServicePackageDetailsModal";
import ViewServicePackageStatisticsModal from "./ViewServicePackageStatisticsModal";
import { useTranslation } from "react-i18next";

const ServiceManagementDropdown = ({
  record,
  fetchServicePackage,
}: {
  record: ServicePackage;
  fetchServicePackage: any;
}) => {
  const { t } = useTranslation("services");
  const [isChangeLeaderModalOpen, setIsChangeLeaderModalOpen] = useState(false);
  const [
    isViewServicePackageStatisticsModalOpen,
    setIsViewServicePackageStatisticsModalOpen,
  ] = useState(false);
  const [isViewServicePackageModalOpen, setIsViewServicePackageModalOpen] =
    useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: t("dropdown.view_service_package_details"),
      onClick: () => setIsViewServicePackageModalOpen(true),
      icon: <EyeOutlined />,
    },
    {
      key: "2",
      label: t("dropdown.update_service_package_details"),
      onClick: () => setIsChangeLeaderModalOpen(true),
      icon: <EditOutlined />,
    },
    {
      key: "3",
      label: t("dropdown.view_statistics"),
      onClick: () => setIsViewServicePackageStatisticsModalOpen(true),
      icon: <BarChartOutlined />,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <EllipsisOutlined className="text-lg" />
      </Dropdown>
      <UpdateServiceModal
        open={isChangeLeaderModalOpen}
        setIsModalOpen={setIsChangeLeaderModalOpen}
        record={record}
        fetchServicePackage={fetchServicePackage}
      />
      <ViewServicePackageDetailsModal
        open={isViewServicePackageModalOpen}
        setIsModalOpen={setIsViewServicePackageModalOpen}
        servicePackage={record}
      />
      <ViewServicePackageStatisticsModal
        open={isViewServicePackageStatisticsModalOpen}
        setIsModalOpen={setIsViewServicePackageStatisticsModalOpen}
        servicePackage={record}
      />
    </>
  );
};

export default ServiceManagementDropdown;
