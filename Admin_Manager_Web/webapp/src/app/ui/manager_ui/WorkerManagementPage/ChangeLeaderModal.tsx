import { Space } from "antd";
import { Modal } from "../../../components/modals";
import { Form } from "../../../components/form";
import { InputSelect } from "../../../components/inputs";
import { Leader } from "../../../models/user";
import { EditOutlined, PhoneFilled } from "@ant-design/icons";
import { Avatar } from "../../../components/avatar";
import { useAccount } from "../../../hooks/useAccount";
import { useEffect } from "react";
import { AssignWorkerToLeaderParams } from "../../../redux/slice/accountSlice";
import { useSpecialUI } from "../../../hooks/useSpecialUI";
import { Skeleton } from "../../../components/skeletons";

export default function ChangeLeaderModal({
  open = false,
  setIsModalOpen,
  workerId,
  leaderId,
  callbackFn,
}: ChangeLeaderModalProps) {
  const [changeLeaderForm] = Form.useForm();
  const {
    state: accountState,
    handleAssignWorkerToLeader,
    handleGetAllLeaderPaginatedExcluded,
  } = useAccount();
  const { state: specialUIState } = useSpecialUI();

  useEffect(() => {
    if (open) {
      handleGetAllLeaderPaginatedExcluded({ PageIndex: 1, Pagesize: 1000 });
    }
  }, [handleGetAllLeaderPaginatedExcluded, open, leaderId]);

  const initialValuesChangeLeader: AssignWorkerToLeaderParams = {
    workerId: "",
    leaderId: "",
  };

  useEffect(() => {
    if (open) {
      changeLeaderForm.setFieldsValue({
        workerId: workerId,
        leaderId: leaderId,
      });
    }
  }, [changeLeaderForm, leaderId, workerId, open]);

  const handleChangeLeaderSubmit = (values: AssignWorkerToLeaderParams) => {
    handleAssignWorkerToLeader({
      values: {
        leaderId: values.leaderId,
        workerId: workerId,
      },
      callBackFn: () => {
        setIsModalOpen(false);
        if (callbackFn) {
          callbackFn();
        }
      },
    });
  };

  const handleOk = () => {
    changeLeaderForm.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={
        <Space className="text-base">
          <EditOutlined />
          <div className="uppercase text-secondary">Chọn trưởng nhóm</div>
        </Space>
      }
      open={open}
      afterClose={changeLeaderForm.resetFields}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ loading: accountState.isSending }}
      cancelButtonProps={{ disabled: accountState.isSending }}
      closeIcon={null}
      maskClosable={false}
      modalRender={(dom) => (
        <Form
          form={changeLeaderForm}
          initialValues={initialValuesChangeLeader}
          name="ChangeLeaderForm"
          onFinish={handleChangeLeaderSubmit}
        >
          {dom}
        </Form>
      )}
      width={650}
    >
      <Space direction="vertical" className="w-full" size={0}>
        <Form.Item
          name="leaderId"
          label={<div className="text-sm text-secondary">Trưởng nhóm</div>}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn trưởng nhóm",
            },
          ]}
          style={{ marginBottom: 10 }}
        >
          <InputSelect
            className="w-full"
            placeholder="Chọn trưởng nhóm"
            options={(accountState.currentLeaderList.users as Leader[]).map(
              (leader) => ({
                label: `${leader.fullName} - ${leader.email} ${leader.areaId ? `(${leader.name})` : ""}`,
                value: leader.accountId,
              }),
            )}
            loading={specialUIState.isLoading}
            disabled={specialUIState.isLoading}
            size="large"
            allowClear
          />
        </Form.Item>
        <Form.Item shouldUpdate={(prev, cur) => prev.leaderId !== cur.leaderId}>
          {({ getFieldValue }) => {
            const leaderIdForm = getFieldValue("leaderId");
            const currentLeader = (
              accountState.currentLeaderList.users as Leader[]
            ).find((leader) => leader.accountId === leaderIdForm) as Leader;
            return leaderIdForm ? (
              <div className="rounded-lg border-2 border-solid border-secondary p-2">
                <Space direction="vertical" className="text-sm">
                  <Avatar
                    size={80}
                    src={currentLeader?.avatarUrl}
                    loading={specialUIState.isLoading}
                  />
                  {specialUIState.isLoading ? (
                    <Skeleton
                      title={{ width: 200 }}
                      paragraph={{ rows: 1, width: 400 }}
                    />
                  ) : (
                    <>
                      <div className="text-lg font-bold">
                        {currentLeader?.fullName}
                      </div>
                      <div className="flex gap-5">
                        <div>
                          <span className="font-bold">Email: </span>
                          <span className="break-all">
                            {currentLeader?.email}
                          </span>
                        </div>
                        <div>
                          <Space>
                            <PhoneFilled />
                            <span className="font-bold">SĐT: </span>
                            <span className="whitespace-nowrap">
                              {currentLeader?.phoneNumber}
                            </span>
                          </Space>
                        </div>
                      </div>
                    </>
                  )}
                </Space>
              </div>
            ) : (
              <></>
            );
          }}
        </Form.Item>
      </Space>
    </Modal>
  );
}

type ChangeLeaderModalProps = {
  open?: boolean;
  setIsModalOpen?: any;
  workerId: string;
  leaderId?: string;
  callbackFn?: () => void;
};
