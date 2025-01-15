import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Dropdown } from "../../../components/dropdown";
import { useState } from "react";
import { ViewRoomsModal } from "./RoomManagement/ViewRoomsModal";
import { Apartment } from "../../../models/apartment";
import UpdateApartmentModal from "./UpdateApartmentModal";
import { useAppDispatch } from "../../../redux/hook";
import { setCurrentApartment } from "../../../redux/slice/apartmentSlice";
import { useTranslation } from "react-i18next";

const ApartmentManagementDropdown = ({
  apartment,
  setDrawerOpen,
}: {
  apartment: Apartment;
  setDrawerOpen?: any;
}) => {
  const { t } = useTranslation("apartments");
  const dispatch = useAppDispatch();

  const [
    isViewApartmentDetailModalVisible,
    setIsViewApartmentDetailModalVisible,
  ] = useState<boolean>(false);
  const [isUpdateApartmentModalOpen, setIsUpdateApartmentModalOpen] =
    useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: t("dropdown.view_apartment_details"),
      icon: <EyeOutlined />,
      onClick: () => {
        dispatch(setCurrentApartment(apartment));
        setDrawerOpen(true);
      },
    },
    {
      key: "2",
      label: t("dropdown.update_apartment_details"),
      icon: <EditOutlined />,
      onClick: () => setIsUpdateApartmentModalOpen(true),
    },
    {
      key: "3",
      label: t("dropdown.manage_apartment_rooms"),
      icon: <HomeOutlined />,
      onClick: () => setIsViewApartmentDetailModalVisible(true),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <EllipsisOutlined className="text-lg" />
      </Dropdown>
      <ViewRoomsModal
        apartmentId={apartment.areaId}
        isModalVisible={isViewApartmentDetailModalVisible}
        setIsModalVisible={setIsViewApartmentDetailModalVisible}
      />
      <UpdateApartmentModal
        apartment={apartment}
        isModalVisible={isUpdateApartmentModalOpen}
        setIsModalVisible={setIsUpdateApartmentModalOpen}
      />
    </>
  );
};

export default ApartmentManagementDropdown;
