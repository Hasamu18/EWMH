import {
  DropboxOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Dropdown } from "../../../components/dropdown";
import { useState } from "react";
import { ViewRatingDetailModal } from "./ViewRatingDetailModal";
import { Feedback } from "../../../models/feedback";
import { useRequest } from "../../../hooks/useRequest";
import { useTranslation } from "react-i18next";

const RatingManagementDropdown = ({
  feedback,
  setDrawerOpen,
}: RatingManagementDropdownProps) => {
  const { t } = useTranslation("ratings");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { handleGetDetailsOfRequest } = useRequest();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: t("dropdown.view_rating_details"),
      icon: <EyeOutlined />,
      onClick: () => setIsModalVisible(true),
    },
    {
      key: "2",
      label: t("dropdown.view_request_details"),
      icon: <DropboxOutlined />,
      onClick: () => {
        if (setDrawerOpen) {
          setDrawerOpen(true);
          handleGetDetailsOfRequest({ RequestId: feedback.requestId });
        }
      },
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <EllipsisOutlined className="text-lg" />
      </Dropdown>
      <ViewRatingDetailModal
        feedback={feedback}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );
};

export default RatingManagementDropdown;

type RatingManagementDropdownProps = {
  feedback: Feedback;
  setDrawerOpen?: any;
};
