import { App, Space, TableColumnsType, Tag } from "antd";
import { useTitle } from "../../hooks/useTitle";
import { Form } from "../../components/form";
import { Input } from "../../components/inputs";
import { Table } from "../../components/table";
import { Modal } from "../../components/modals";
import { WarningOutlined } from "@ant-design/icons";
import { Worker } from "../../models/user";
import { Avatar } from "../../components/avatar";
import { statusGenerator } from "../../utils/generators/status";
import WorkerManagementDropdown from "../../ui/manager_ui/WorkerManagementPage/WorkerManagementDropdown";
import { useAccount } from "../../hooks/useAccount";
import { usePagination } from "../../hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function WorkerManagementPage() {
  const { notification } = App.useApp();
  const { t } = useTranslation("workers");
  useTitle({
    tabTitle: "Workers - EWMH",
    paths: [{ title: t("worker_list"), path: "/workers" }],
  });
  const [modal, contextHolder] = Modal.useModal();
  const [searchForm] = Form.useForm();
  const [disableReasonForm] = Form.useForm();
  const { state, handleGetAllWorkerPaginated, handleDisableUser } =
    useAccount();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [searchByPhone, setSearchByPhone] = useState<string>();
  const [tableParams, setTableParams] = useState<TableParams>();

  const fetchWorkerList = useCallback(() => {
    handleGetAllWorkerPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByPhone: searchByPhone,
      IsDisabled: tableParams?.filters?.["item.isDisabled"]?.[0],
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllWorkerPaginated,
    searchByPhone,
    tableParams?.filters,
  ]);

  useEffect(() => {
    fetchWorkerList();
  }, [fetchWorkerList]);

  const initialValuesSearch = {
    searchString: "",
  };

  const handleSearchSubmit = ({ searchString }: typeof initialValuesSearch) => {
    goToPage(1);
    setSearchByPhone(searchString);
  };

  function handleConfirmLock(accountId: string) {
    const initialValuesDisableReason = {
      disabledReason: "",
    };

    modal.confirm({
      icon: <WarningOutlined />,
      width: "fit-content",
      afterClose: () => {
        disableReasonForm.resetFields();
      },
      title: (
        <div className="flex items-center whitespace-nowrap text-sm">
          <span>Bạn có muốn đổi trạng thái thành</span>
          <Tag color="volcano" className="mx-1">
            Vô hiệu hóa
          </Tag>
          <span>?</span>
        </div>
      ),
      content: (
        <Space direction="vertical" className="w-full">
          <div className="text-base text-secondary">Ghi chú</div>
          <Form
            form={disableReasonForm}
            initialValues={initialValuesDisableReason}
            name="DisableReasonForm"
          >
            <Form.Item
              noStyle
              name="disabledReason"
              rules={[
                {
                  type: "string",
                },
              ]}
            >
              <Input.TextArea placeholder="Nhập ghi chú" />
            </Form.Item>
          </Form>
        </Space>
      ),
      onOk: async () => {
        await disableReasonForm.validateFields().then(async () => {
          const values = disableReasonForm.getFieldsValue(true);

          await handleDisableUser({
            accountId: accountId,
            disable: true,
            disabledReason: values.disabledReason,
          });
          fetchWorkerList();
        });
      },
    });
  }

  function handleConfirmUnlock(accountId: string) {
    modal.confirm({
      icon: <WarningOutlined />,
      width: "fit-content",
      title: (
        <div className="flex items-center whitespace-nowrap text-sm">
          <span>Bạn có muốn đổi trạng thái thành</span>
          <Tag color="green" className="mx-1">
            Đang hoạt động
          </Tag>
          <span>?</span>
        </div>
      ),
      onOk: async () => {
        await handleDisableUser({
          accountId: accountId,
          disable: false,
          disabledReason: "",
        });
        fetchWorkerList();
      },
    });
  }

  const workerListColumns: TableColumnsType<Worker> = [
    {
      title: t("worker_table.worker_info"),
      dataIndex: ["item", "fullName"],
      render: (_, { item }) => (
        <Space direction="horizontal" size={15}>
          <Avatar src={item?.avatarUrl} size={60} />
          <Space direction="vertical">
            <div className="text-base font-bold">{item?.fullName}</div>
            <div>{item?.email}</div>
          </Space>
        </Space>
      ),
    },
    {
      title: t("worker_table.worker_phone"),
      dataIndex: ["item", "phoneNumber"],
    },
    {
      title: t("worker_table.worker_leader"),
      dataIndex: "leaderId",
      render: (_, { getLeaderInfo }) =>
        getLeaderInfo?.accountId ? (
          <Tag color="green">{getLeaderInfo.fullName}</Tag>
        ) : (
          <Tag color="volcano">Chưa có</Tag>
        ),
    },
    {
      title: t("worker_table.worker_status"),
      dataIndex: ["item", "isDisabled"],
      render: (isDisabled, { getLeaderInfo, item }) => {
        return getLeaderInfo?.accountId ? (
          <div
            className="w-fit cursor-pointer"
            onClick={() => {
              notification.info({
                message: "Nhân viên có liên kết với trưởng nhóm",
                description: (
                  <>
                    Vui lòng bỏ gán nhân viên khỏi trưởng nhóm{" "}
                    <span className="font-bold">{getLeaderInfo.fullName}</span>{" "}
                    để có thể vô hiệu hóa tài khoản.
                  </>
                ),
                placement: "topRight",
              });
            }}
          >
            {statusGenerator(isDisabled)}
          </div>
        ) : (
          <div
            onClick={() =>
              isDisabled
                ? handleConfirmUnlock(item.accountId)
                : handleConfirmLock(item.accountId)
            }
            className="cursor-pointer"
          >
            {statusGenerator(isDisabled)}
          </div>
        );
      },
      filters: [
        {
          text: "Hoạt động",
          value: false,
        },
        {
          text: "Vô hiệu hóa",
          value: true,
        },
      ],
    },
    {
      title: t("worker_table.worker_notes"),
      dataIndex: ["item", "disabledReason"],
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <WorkerManagementDropdown
          record={record}
          callbackFn={() => fetchWorkerList()}
        />
      ),
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
                onClear={() => {
                  searchForm.setFieldValue("searchString", "");
                  searchForm.submit();
                }}
              />
            </Form.Item>
          </Form>
        </div>
        <Table
          columns={workerListColumns}
          dataSource={state.currentWorkerList.users as Worker[]}
          rowKey={(record) => record.item.accountId}
          loading={state.isFetching}
          pagination={{
            showSizeChanger: true,
            total: state.currentWorkerList.total,
            pageSize: currentPageSize,
            current: currentPage,
            onChange: (pageIndex, pageSize) => {
              goToPage(pageIndex);
              setPageSize(pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng ${total} nhân viên`,
            pageSizeOptions: [5, 10, 20, 50, 100],
          }}
          onChange={(_, filters) => {
            setTableParams({
              filters: filters,
            });
          }}
        />
      </Space>
      {contextHolder}
    </>
  );
}

type TableParams = {
  filters?: {
    "item.isDisabled"?: boolean[];
  };
};
