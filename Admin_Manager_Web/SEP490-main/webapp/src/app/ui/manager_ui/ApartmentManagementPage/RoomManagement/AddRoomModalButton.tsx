import { Space, Tag, Typography } from "antd";
import { Form } from "../../../../components/form";
import { Modal } from "../../../../components/modals";
import { PrimaryButton } from "../../../../components/buttons";
import {
  CloseOutlined,
  HomeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Input } from "../../../../components/inputs";
import { AddRoomsParams } from "../../../../redux/slice/apartmentSlice";
import { useApartment } from "../../../../hooks/useApartment";

const { Text } = Typography;

export default function AddRoomModalButton({
  apartmentId,
}: {
  apartmentId: string;
}) {
  const [addRoomForm] = Form.useForm();
  const { state, handleAddRooms, handleGetAllRoomsPaginated } = useApartment();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const initialValuesAddNewRoom: AddRoomsParams = {
    areaId: "",
    roomIds: [],
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const roomIds = addRoomForm.getFieldValue("roomIds");
    handleAddRooms({
      values: {
        areaId: apartmentId,
        roomIds: roomIds,
      },
      callBackFn: () => {
        setIsModalVisible(false);
        handleGetAllRoomsPaginated({
          PageIndex: 1,
          Pagesize: 8,
          AreaId: apartmentId,
        });
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <PrimaryButton
        text="Thêm căn hộ mới"
        icon={<PlusCircleOutlined />}
        onClick={showModal}
      />
      <Modal
        title={
          <Space className="text-base">
            <HomeOutlined />
            <div className="uppercase text-secondary">Thêm căn hộ mới</div>
          </Space>
        }
        open={isModalVisible}
        afterClose={addRoomForm.resetFields}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: state.isSending }}
        cancelButtonProps={{ disabled: state.isSending }}
        closeIcon={null}
        maskClosable={false}
        modalRender={(dom) => (
          <Form
            form={addRoomForm}
            initialValues={initialValuesAddNewRoom}
            name="AddRoomForm"
            onFinish={(values) => {
              const { roomId, roomIds } = values;
              const addMultipleRooms = (roomIdInput: string) => {
                const newRoomIds = roomIdInput
                  .split(/[,\s]+/) // Split by commas or spaces
                  .filter((id) => id.trim() !== ""); // Remove empty strings
                addRoomForm.setFieldsValue({
                  roomIds: [...new Set([...roomIds, ...newRoomIds])], // Ensure no duplicates
                });
              };
              addRoomForm.validateFields().then(() => addMultipleRooms(roomId));
              addRoomForm.setFieldValue("roomId", null);
            }}
          >
            {dom}
          </Form>
        )}
        width="fit-content"
        className="min-w-[600px]"
      >
        <Space direction="vertical" className="w-full">
          <Space direction="vertical" className="w-full">
            <Form.Item
              name="roomId"
              label={<div className="text-sm text-secondary">Số căn hộ</div>}
              rules={[
                {
                  type: "string",
                  required: true,
                },
              ]}
              className="mb-0"
            >
              <Input.TextArea
                placeholder="Nhập số căn hộ (vd: 101, 102, 103)"
                size="large"
                className="w-full"
              />
            </Form.Item>
            <Form.List name="roomIds">
              {(fields, { remove }) => {
                return (
                  <div className="flex flex-col gap-2">
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.roomId !== curValues.roomId
                      }
                      noStyle
                    >
                      <PrimaryButton
                        htmlType="submit"
                        text="Thêm căn hộ"
                        className="w-full"
                        icon={<PlusCircleOutlined />}
                        bgColor="#4cc9c7"
                      />
                    </Form.Item>
                    <div>{`Danh sách căn hộ (${fields.length} căn hộ)`}</div>
                    <div
                      // style={{
                      //   display: "flex",
                      //   flexDirection: "row",
                      //   flexWrap: "nowrap",
                      //   overflowX: "auto", // Enable horizontal scrolling
                      //   padding: "0.5rem",
                      //   border: "1px solid #ddd",
                      //   borderRadius: "4px",
                      // }}
                      className="grid grid-flow-col grid-rows-4 gap-4"
                    >
                      {fields.length ? (
                        fields.map((field) => (
                          <Tag
                            key={field.key}
                            bordered={true}
                            className="mr-3 w-fit"
                          >
                            <Space size={5}>
                              <Form.Item
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.roomIds !== curValues.roomIds
                                }
                                noStyle
                              >
                                {({ getFieldValue }) => {
                                  const roomIds = getFieldValue("roomIds");
                                  return (
                                    <span className="text-sm">{`${roomIds[field.name]}`}</span>
                                  );
                                }}
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  remove(field.name);
                                }}
                                className="opacity-50"
                              />
                            </Space>
                          </Tag>
                        ))
                      ) : (
                        <Text className="ant-form-text" type="secondary">
                          ( Chưa có căn hộ. )
                        </Text>
                      )}
                    </div>
                  </div>
                );
              }}
            </Form.List>
          </Space>
        </Space>
      </Modal>
    </>
  );
}
