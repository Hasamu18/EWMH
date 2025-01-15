import { DownloadOutlined } from "@ant-design/icons";
import { Space } from "antd";
import WorkerTable from "./WorkerTable";
import { Skeleton } from "../../../../components/skeletons";
import { Request } from "../../../../models/request";
import {
  requestStatusGenerator,
  requestTypeGenerator,
} from "../../../../utils/generators/requestStatus";
import { formatCurrency, formatDateToLocal } from "../../../../utils/helpers";
import { Avatar } from "../../../../components/avatar";
import { Collapse } from "../../../../components/collapse";
import { PrimaryButton } from "../../../../components/buttons";
import RequestProductList from "./RequestProductList";

export default function RequestDetails({
  request,
  loading,
}: {
  request?: Request;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="h-[500px] w-[1000px]">
        <Skeleton />
      </div>
    );
  }

  return (
    <Space direction="vertical" size={20}>
      <div className="flex w-full justify-between">
        <Space direction="vertical" className="w-3/12 text-sm" size={15}>
          <div>
            <span className="font-bold">Mã số yêu cầu: </span>
            <span>{request?.request.requestId}</span>
          </div>
          <div>
            <span className="font-bold">Trạng thái: </span>
            <span>{requestStatusGenerator(request?.request.status)}</span>
          </div>
          <div>
            <span className="font-bold">Loại yêu cầu: </span>
            <span>
              {requestTypeGenerator(request?.request.categoryRequest)}
            </span>
          </div>
          <div>
            <span className="font-bold">Thời gian bắt đầu: </span>
            <span>{formatDateToLocal(request?.request.start, true)}</span>
          </div>
        </Space>
        <Space direction="vertical" className="w-4/12 text-sm">
          <span className="font-bold">Thông tin khách hàng:</span>
          <div className="rounded-lg border-2 border-solid border-secondary px-3 py-2">
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <Avatar
                  size={150}
                  src={request?.customer_Leader[0]?.avatarUrl}
                />
                <div className="whitespace-nowrap font-bold">
                  {request?.customer_Leader[0]?.fullName}
                </div>
              </div>
              <div>
                <div>
                  <span className="font-bold">Email: </span>
                  <span className="break-all">
                    {request?.customer_Leader[0]?.email}
                  </span>
                </div>
                <div>
                  <span className="font-bold">SĐT: </span>
                  <span>{request?.customer_Leader[0]?.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </Space>
        <Space direction="vertical" className="w-4/12 text-sm">
          <span className="font-bold">Thông tin trưởng nhóm:</span>
          <div className="rounded-lg border-2 border-solid border-secondary px-3 py-2">
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <Avatar
                  size={150}
                  src={request?.customer_Leader[1]?.avatarUrl}
                />
                <div className="whitespace-nowrap font-bold">
                  {request?.customer_Leader[1]?.fullName}
                </div>
              </div>
              <div>
                <div>
                  <span className="font-bold">Email: </span>
                  <span className="break-all">
                    {request?.customer_Leader[1]?.email}
                  </span>
                </div>
                <div>
                  <span className="font-bold">SĐT: </span>
                  <span>{request?.customer_Leader[1]?.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </Space>
      </div>
      <Collapse
        items={[
          {
            label: "Danh sách nhân viên",
            children: <WorkerTable workers={request?.workerList} />,
          },
        ]}
        fontSize={18}
      />
      <div className="text-sm">
        <div className="font-bold">Mô tả vấn đề của khách hàng: </div>
        <div>{request?.request.customerProblem}</div>
      </div>
      <div className="text-sm">
        <div className="font-bold">Kết luận của nhân viên: </div>
        <div>
          {request?.request.conclusion ? request.request.conclusion : "Chưa có"}
        </div>
      </div>
      <PrimaryButton
        text="Tải hóa đơn"
        icon={<DownloadOutlined />}
        className="w-full"
        onClick={() => {
          if (request?.request.fileUrl) {
            window.open(request?.request.fileUrl);
          }
        }}
        disabled={!request?.request.fileUrl}
      />
      <Collapse
        items={[
          {
            label: "Đơn hàng của yêu cầu",
            children: <RequestProductList products={request?.productList} />,
            forceRender: true,
          },
        ]}
        fontSize={18}
      />
      {request?.request.status === 2 ? (
        <>
          <Space className="flex justify-between text-sm">
            <div className="font-bold">Giá gửi yêu cầu: </div>
            <div className="font-semibold">
              {request?.request.requestPrice === 0
                ? "Miễn phí"
                : formatCurrency(request?.request.requestPrice)}
            </div>
          </Space>
          <Space className="flex justify-between text-sm">
            <div className="font-bold">Tổng giá: </div>
            <div className="font-bold">
              {request?.request.totalPrice === 0
                ? "Miễn phí"
                : formatCurrency(request?.request.totalPrice)}
            </div>
          </Space>
        </>
      ) : (
        <></>
      )}
    </Space>
  );
}
