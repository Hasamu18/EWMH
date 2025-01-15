import { Drawer, Space, TabsProps } from "antd";
import { Tabs } from "../../components/tabs";
import { useTitle } from "../../hooks/useTitle";
import NewRequestTab from "../../ui/manager_ui/RequestManagementPage/NewRequestTab";
import { useState } from "react";
import RequestDetails from "../../ui/manager_ui/RequestManagementPage/RequestDetails/RequestDetails";
import { useRequest } from "../../hooks/useRequest";
import { useSpecialUI } from "../../hooks/useSpecialUI";
import ProcessingRequestTab from "../../ui/manager_ui/RequestManagementPage/ProcessingRequestTab";
import CompletedRequestTab from "../../ui/manager_ui/RequestManagementPage/CompletedRequestTab";
import CanceledRequestTab from "../../ui/manager_ui/RequestManagementPage/CanceledRequestTab";
import { EditFilled } from "@ant-design/icons";
import { PrimaryButton } from "../../components/buttons";
import { ViewRequestValuesModal } from "../../ui/manager_ui/RequestManagementPage/RequestValues/ViewRequestValuesModal";
import { useTranslation } from "react-i18next";

export default function RequestManagementPage() {
  const { t } = useTranslation("requests");
  useTitle({
    tabTitle: "Requests - EWMH",
    paths: [
      {
        title: t("request_list"),
        path: "/requests",
        actions: [
          <PrimaryButton.Icon
            icon={<EditFilled />}
            bgColor="transparent"
            onClick={() => setIsViewRequestValuesModalVisible(true)}
          />,
        ],
      },
    ],
  });
  const [open, setOpen] = useState(false);
  const [isViewRequestValuesModalVisible, setIsViewRequestValuesModalVisible] =
    useState<boolean>(false);
  const { state: requestState } = useRequest();
  const { state: specialUIState } = useSpecialUI();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("new_request"),
      children: <NewRequestTab status={0} setDrawerOpen={setOpen} />,
    },
    {
      key: "2",
      label: t("processing_request"),
      children: <ProcessingRequestTab status={1} setDrawerOpen={setOpen} />,
    },
    {
      key: "3",
      label: t("finished_request"),
      children: <CompletedRequestTab status={2} setDrawerOpen={setOpen} />,
    },
    {
      key: "4",
      label: t("canceled_request"),
      children: <CanceledRequestTab status={3} setDrawerOpen={setOpen} />,
    },
  ];

  return (
    <>
      <ViewRequestValuesModal
        isModalVisible={isViewRequestValuesModalVisible}
        setIsModalVisible={setIsViewRequestValuesModalVisible}
      />
      <Drawer
        title={t("request_details.request_details")}
        placement="right"
        open={open}
        getContainer={false}
        destroyOnClose
        onClose={() => setOpen(false)}
        width="100%"
        style={{ height: "93vh" }}
      >
        <RequestDetails
          loading={specialUIState.isLoading}
          request={requestState.currentRequest}
        />
      </Drawer>
      <Space direction="vertical" size={20} className="w-full">
        <Tabs defaultActiveKey="1" items={items} destroyInactiveTabPane />
      </Space>
    </>
  );
}
