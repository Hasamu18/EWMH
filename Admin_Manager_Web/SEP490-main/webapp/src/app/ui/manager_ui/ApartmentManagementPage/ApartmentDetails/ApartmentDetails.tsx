import { Space } from "antd";
import WorkerTable from "./WorkerTable";
import { useEffect } from "react";
import { Skeleton } from "../../../../components/skeletons";
import { Apartment } from "../../../../models/apartment";
import { useAccount } from "../../../../hooks/useAccount";
import { Image } from "../../../../components/image";
import htmlParse from "../../../../utils/htmlParser";
import { Card } from "../../../../components/card";

export default function ApartmentDetails({
  apartment,
  loading,
}: {
  apartment: Apartment;
  loading: boolean;
}) {
  const { state: accountState, handleGetAllWorkerFromLeader } = useAccount();

  useEffect(() => {
    const originalScrollPosition = window.scrollY;
    window.scrollTo(0, 0);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.scrollTo(0, originalScrollPosition);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    handleGetAllWorkerFromLeader({ LeaderId: apartment.leaderId });
  }, [apartment, apartment.leaderId, handleGetAllWorkerFromLeader]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Space direction="vertical" size={20} className="w-full">
      <div className="flex w-full gap-10">
        <div className="flex min-h-[500px] min-w-[500px] justify-center">
          <Image
            src={apartment.avatarUrl}
            preview={true}
            height={500}
            className="object-contain"
          />
        </div>
        <Card>
          <Space direction="vertical" className="w-full text-sm" size={15}>
            <div>
              <span className="font-bold">Tên chung cư: </span>
              <span>{apartment.name}</span>
            </div>
            <div>
              <span className="font-bold">Địa chỉ: </span>
              <span>{apartment.address}</span>
            </div>
            <div>
              <span className="font-bold">Công ty: </span>
              <span>{apartment.managementCompany}</span>
            </div>
            <div>
              <span className="font-bold">Trưởng nhóm hiện tại: </span>
              <span>{apartment.account.fullName}</span>
            </div>
            <div>
              <span className="font-bold">Miêu tả: </span>
              <span>{htmlParse(apartment.description)}</span>
            </div>
          </Space>
        </Card>
      </div>
      <Space direction="vertical" className="w-full">
        <div className="text-lg font-bold">
          Thông tin của trưởng nhóm và nhân viên phục vụ cho chung cư
        </div>
        <WorkerTable
          leader={apartment.account}
          workers={accountState.workerOfLeaderList.users}
        />
      </Space>
    </Space>
  );
}
