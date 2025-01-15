import {
  EnvironmentFilled,
  LikeOutlined,
  MailFilled,
  PhoneFilled,
} from "@ant-design/icons";
import { Modal } from "../../../components/modals";
import { Rate, Space } from "antd";
import { Avatar } from "../../../components/avatar";
import { Grid } from "../../../components/grids";
import { PrimaryButton } from "../../../components/buttons";
import { Feedback } from "../../../models/feedback";
import { useFeedback } from "../../../hooks/useFeedback";
import { useEffect } from "react";
import { useSpecialUI } from "../../../hooks/useSpecialUI";
import { formatDateToLocal } from "../../../utils/helpers";

export function ViewRatingDetailModal({
  feedback,
  isModalVisible,
  setIsModalVisible,
}: {
  feedback: Feedback;
  isModalVisible: boolean;
  setIsModalVisible: any;
}) {
  const { state: feedbackState, handleGetFeedbackDetails } = useFeedback();
  const { state: specialUIState } = useSpecialUI();

  useEffect(() => {
    if (isModalVisible) {
      handleGetFeedbackDetails({ feedbackId: feedback.feedbackId });
    }
  }, [feedback.feedbackId, handleGetFeedbackDetails, isModalVisible]);

  return (
    <>
      <Modal
        title={
          <Space className="text-base">
            <LikeOutlined />
            <div className="uppercase text-secondary">Đánh giá</div>
          </Space>
        }
        maskClosable={false}
        open={isModalVisible}
        footer={[
          <PrimaryButton
            key="close"
            text="Đóng"
            onClick={() => setIsModalVisible(false)}
            size="middle"
          />,
        ]}
        loading={specialUIState.isLoading}
        closeIcon={null}
        width={800}
      >
        <Grid
          className="text-sm"
          items={[
            <Space direction="vertical" size={10} className="w-full">
              <Avatar
                src={feedbackState.currentFeedback.avatarUrl}
                size={150}
              />
              <div>
                <strong>Họ và Tên:</strong>{" "}
                {feedbackState.currentFeedback.customerName}
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <PhoneFilled />
                  <strong>SĐT:</strong>
                  <span>{feedbackState.currentFeedback.customerPhone}</span>
                </Space>
              </div>
              <div>
                <Space direction="horizontal" size={3}>
                  <MailFilled />
                  <strong>Email:</strong>
                  <span>{feedbackState.currentFeedback.customerEmail}</span>
                </Space>
              </div>
              <div>
                <Space
                  direction="horizontal"
                  size={3}
                  className="flex items-start"
                >
                  <EnvironmentFilled />
                  <strong className="whitespace-nowrap">Địa chỉ:</strong>
                  <span className="break-words">
                    {feedbackState.currentFeedback.customerAddress}
                  </span>
                </Space>
              </div>
            </Space>,
            <Space direction="vertical" size={15} className="w-full">
              <div>
                <div className="text-2xl font-bold">Đánh giá</div>
                <Rate
                  disabled
                  allowHalf
                  value={feedbackState.currentFeedback.rate}
                />
                <div className="text-sm text-gray-500">
                  {formatDateToLocal(feedbackState.currentFeedback.time, true)}
                </div>
              </div>
              <div>{feedbackState.currentFeedback.content}</div>
            </Space>,
          ]}
        />
      </Modal>
    </>
  );
}
