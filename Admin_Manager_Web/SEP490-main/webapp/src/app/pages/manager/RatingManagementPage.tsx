import { Drawer, Rate, Space, TableColumnsType, Tag, Typography } from "antd";
import { useTitle } from "../../hooks/useTitle";
import { Table } from "../../components/table";
import { Modal } from "../../components/modals";
import { StarOutlined, UserOutlined, WarningOutlined } from "@ant-design/icons";
import { Avatar } from "../../components/avatar";
import { Feedback } from "../../models/feedback";
import { feedbackStatusGenerator } from "../../utils/generators/feedbackStatus";
import RatingManagementDropdown from "../../ui/manager_ui/RatingManagementPage/RatingManagementDropdown";
import { Card } from "../../components/card";
import { useFeedback } from "../../hooks/useFeedback";
import { usePagination } from "../../hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import { formatDateToLocal, isNonValue } from "../../utils/helpers";
import RequestDetails from "../../ui/manager_ui/RatingManagementPage/RequestDetails/RequestDetails";
import { useRequest } from "../../hooks/useRequest";
import { useSpecialUI } from "../../hooks/useSpecialUI";
import { useTranslation } from "react-i18next";

const { Paragraph } = Typography;

export default function RatingManagementPage() {
  const { t } = useTranslation("ratings");
  useTitle({
    tabTitle: "Ratings - EWMH",
    paths: [{ title: t("rating_list"), path: "/ratings" }],
  });
  const [modal, contextHolder] = Modal.useModal();
  const { state, handleGetAllFeedbacksPaginated, handleApproveFeedback } =
    useFeedback();
  const { state: requestState } = useRequest();
  const { state: specialUIState } = useSpecialUI();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [tableParams, setTableParams] = useState<TableParams>();
  const [open, setOpen] = useState(false);

  const fetchFeedbacks = useCallback(() => {
    handleGetAllFeedbacksPaginated({
      pageIndex: currentPage,
      pagesize: currentPageSize,
      sortByStarOrder: tableParams?.sorter?.sortByStarOrder || "asc",
      status: !isNonValue(tableParams?.filters?.status?.[0])
        ? tableParams?.filters?.status?.[0]
        : 2,
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllFeedbacksPaginated,
    tableParams?.filters?.status,
    tableParams?.sorter?.sortByStarOrder,
  ]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  function handleConfirmApprove(feedbackId: string) {
    modal.confirm({
      icon: <WarningOutlined />,
      width: "fit-content",
      title: (
        <div className="flex items-center whitespace-nowrap text-sm">
          <span>Bạn có muốn đổi trạng thái thành</span>
          <Tag color="green" className="mx-1">
            Đã duyệt
          </Tag>
          <span>?</span>
        </div>
      ),
      onOk: async () => {
        await handleApproveFeedback({
          values: { feedbackId: feedbackId },
        });
        fetchFeedbacks();
      },
    });
  }

  const feedbackListColumns: TableColumnsType<Feedback> = [
    {
      title: t("rating_table.customer_info"),
      dataIndex: "fullName",
      render: (_, { customerName, avatarUrl, customerEmail }) => (
        <Space direction="horizontal" size={15}>
          <Avatar src={avatarUrl} size={60} />
          <Space direction="vertical">
            <div className="text-base font-bold">{customerName}</div>
            <div>{customerEmail}</div>
          </Space>
        </Space>
      ),
    },
    {
      title: t("rating_table.rating_value"),
      dataIndex: "rate",
      render: (value) => <Rate allowHalf disabled value={value} />,
      sorter: true,
      sortDirections: ["descend"],
    },
    {
      title: t("rating_table.rating_description"),
      dataIndex: "content",
      render: (value) => (
        <Paragraph
          ellipsis={{ rows: 2 }}
          className="max-w-[900px] break-words text-sm"
        >
          {value}
        </Paragraph>
      ),
    },
    {
      title: t("rating_table.rating_time"),
      dataIndex: "time",
      render: (value) => formatDateToLocal(value, true),
    },
    {
      title: t("rating_table.rating_status"),
      dataIndex: "status",
      render: (_, { status, feedbackId }) => {
        return (
          <div
            onClick={() => (status ? null : handleConfirmApprove(feedbackId))}
            className="w-fit cursor-pointer"
          >
            {feedbackStatusGenerator(status)}
          </div>
        );
      },
      filters: [
        {
          text: "Hoạt động",
          value: 1,
        },
        {
          text: "Vô hiệu hóa",
          value: 0,
        },
      ],
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <RatingManagementDropdown feedback={record} setDrawerOpen={setOpen} />
      ),
    },
  ];

  return (
    <>
      <Drawer
        title="Thông tin yêu cầu"
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
        <Space>
          <Card
            style={{ width: 300 }}
            title={t("total_reviews")}
            loading={state.isFetching}
          >
            <Space className="text-2xl">
              <span>{state.currentFeedbackList.total}</span>
              <span>
                <UserOutlined />
              </span>
            </Space>
          </Card>
          <Card
            style={{ width: 300 }}
            title={t("avg_rating")}
            loading={state.isFetching}
          >
            <Space className="text-2xl">
              <span>{state.currentFeedbackList.averageRate}</span>
              <span>
                <StarOutlined />
              </span>
            </Space>
          </Card>
        </Space>
        <Table
          columns={feedbackListColumns}
          dataSource={state.currentFeedbackList.feedbacks}
          rowKey={(record) => record.feedbackId}
          loading={state.isFetching}
          pagination={{
            showSizeChanger: true,
            total: state.currentFeedbackList.total,
            pageSize: currentPageSize,
            current: currentPage,
            onChange: (pageIndex, pageSize) => {
              goToPage(pageIndex);
              setPageSize(pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng ${total} đánh giá`,
            pageSizeOptions: [5, 10, 20, 50, 100],
          }}
          onChange={(_, filters, sorter) => {
            setTableParams({
              filters: filters,
              sorter: {
                sortByStarOrder: Array.isArray(sorter)
                  ? undefined
                  : sorter.order === "descend"
                    ? "desc"
                    : "asc",
              },
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
    status?: (0 | 1 | 2)[];
  };
  sorter?: {
    sortByStarOrder?: "asc" | "desc";
  };
};
