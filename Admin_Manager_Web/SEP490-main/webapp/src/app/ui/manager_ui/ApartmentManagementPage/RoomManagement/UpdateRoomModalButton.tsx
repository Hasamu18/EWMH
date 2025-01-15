import { EditOutlined, HomeOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { useState } from "react";
import { Form } from "../../../../components/form";
import { Input } from "../../../../components/inputs";
import { Modal } from "../../../../components/modals";
import { useApartment } from "../../../../hooks/useApartment";

export default function UpdateRoomModalButton({
  areaId,
  oldRoomId,
}: {
  areaId: string;
  oldRoomId: string;
}) {
  const [updateRoomForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { state, handleUpdateRoom, handleGetAllRoomsPaginated } =
    useApartment();

  const initialValuesUpdateRoom: any = {
    newRoomId: oldRoomId,
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    updateRoomForm.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdateRoomSubmit = (values: any) => {
    const newRoomId = values.newRoomId;
    handleUpdateRoom({
      values: { areaId: areaId, newRoomId: newRoomId, oldRoomId: oldRoomId },
      callBackFn: () => {
        setIsModalVisible(false);
        handleGetAllRoomsPaginated({
          PageIndex: 1,
          Pagesize: 8,
          AreaId: areaId,
        });
      },
    });
  };

  return (
    <>
      <EditOutlined onClick={showModal} />
      <Modal
        title={
          <Space className="text-base">
            <HomeOutlined />
            <div className="uppercase text-secondary">Cập nhật số căn hộ</div>
          </Space>
        }
        open={isModalVisible}
        afterClose={updateRoomForm.resetFields}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: state.isSending }}
        cancelButtonProps={{ disabled: state.isSending }}
        closeIcon={null}
        maskClosable={false}
        modalRender={(dom) => (
          <Form
            form={updateRoomForm}
            initialValues={initialValuesUpdateRoom}
            name="UpdateRoomForm"
            onFinish={handleUpdateRoomSubmit}
          >
            {dom}
          </Form>
        )}
      >
        <Space direction="vertical" className="w-full">
          <Form.Item
            name="newRoomId"
            label={<div className="text-sm text-secondary">Số căn hộ</div>}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Nhập số căn hộ mới" size="large" />
          </Form.Item>
        </Space>
      </Modal>
    </>
  );
}
