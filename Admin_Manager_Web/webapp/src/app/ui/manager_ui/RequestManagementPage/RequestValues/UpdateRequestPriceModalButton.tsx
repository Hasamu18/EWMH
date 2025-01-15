import { Space } from "antd";
import { DollarCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Form } from "../../../../components/form";
import { Modal } from "../../../../components/modals";
import { InputNumber } from "../../../../components/inputs";
import { useRequest } from "../../../../hooks/useRequest";

export default function EditRequestPriceModalButton({
  oldPrice,
}: {
  oldPrice: number;
}) {
  const [updatePriceForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { state, handleUpdatePriceOfRequest, handleGetCurrentPriceOfRequest } =
    useRequest();

  useEffect(() => {
    updatePriceForm.setFieldsValue({
      price: oldPrice,
    });
  }, [oldPrice, updatePriceForm]);

  const initialValuesUpdateRequestPrice: any = {
    price: oldPrice,
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    updatePriceForm.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdateRequestPriceSubmit = (values: any) => {
    const price = values.price;
    handleUpdatePriceOfRequest({
      values: { price: price },
      callBackFn: () => {
        setIsModalVisible(false);
        handleGetCurrentPriceOfRequest();
      },
    });
  };

  return (
    <>
      <EditOutlined onClick={showModal} />
      <Modal
        title={
          <Space className="text-base">
            <DollarCircleOutlined />
            <div className="uppercase text-secondary">Cập nhật giá</div>
          </Space>
        }
        open={isModalVisible}
        afterClose={updatePriceForm.resetFields}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: state.isSending }}
        cancelButtonProps={{ disabled: state.isSending }}
        closeIcon={null}
        maskClosable={false}
        modalRender={(dom) => (
          <Form
            form={updatePriceForm}
            initialValues={initialValuesUpdateRequestPrice}
            name="UpdatePriceForm"
            onFinish={handleUpdateRequestPriceSubmit}
          >
            {dom}
          </Form>
        )}
      >
        <Space direction="vertical" className="w-full">
          <div>
            <Form.Item
              name="price"
              label={<div className="text-sm text-secondary">Giá hiện tại</div>}
              rules={[
                {
                  type: "number",
                  required: true,
                  min: 2000,
                  message: "Giá sản phẩm phải ít nhất 2.000đ",
                },
              ]}
            >
              <InputNumber.Currency
                placeholder="Nhập giá mới"
                className="w-1/2"
                step={1000}
                size="large"
              />
            </Form.Item>
          </div>
        </Space>
      </Modal>
    </>
  );
}
