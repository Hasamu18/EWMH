import { App, Space } from "antd";
import { Modal } from "../../../components/modals";
import { Form } from "../../../components/form";
import { Input, InputNumber } from "../../../components/inputs";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ServicePackage } from "../../../models/service";
import { UploadImage } from "../../../components/image-upload/image-upload";
import { getFiles, validateImageString } from "../../../utils/helpers";
import { ImageUpload } from "../../../components/image-upload";
import { TextEditor } from "../../../components/rte";
import { useServicePackage } from "../../../hooks/useServicePackage";
import { UpdateServicePackageParams } from "../../../redux/slice/servicePackageSlice";
import { useSpecialUI } from "../../../hooks/useSpecialUI";

export default function UpdateServiceModal({
  open = false,
  setIsModalOpen,
  record,
  fetchServicePackage,
}: UpdateServiceModalProps) {
  const { notification } = App.useApp();
  const [updateServiceForm] = Form.useForm();
  const [images, setImages] = useState<UploadImage[]>([]);
  const { state, handleGetServicePackage, handleUpdateServicePackage } =
    useServicePackage();
  const { state: specialUIState } = useSpecialUI();

  const initialValuesUpdateService: UpdateServicePackageParams = {
    ServicePackageId: "",
    Name: "",
    Description: "",
    NumOfRequest: 0,
    Price: 0,
    Image: { name: "" },
  };

  useEffect(() => {
    if (open) {
      handleGetServicePackage({ ServicePackageId: record.servicePackageId });
    }
  }, [handleGetServicePackage, open, record.servicePackageId]);

  useEffect(() => {
    updateServiceForm.setFieldsValue({
      Name: state.currentServicePackage.name,
      Description: state.currentServicePackage.description,
      NumOfRequest: state.currentServicePackage.numOfRequest,
      Price: state.currentServicePackage.priceByDate,
    });
    if (state.currentServicePackage.imageUrl) {
      setImages([
        {
          name: "",
          url: validateImageString(state.currentServicePackage.imageUrl),
        },
      ]);
    }
  }, [state.currentServicePackage, updateServiceForm]);

  const handleOk = () => {
    updateServiceForm.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateServiceSubmit = async (values: any) => {
    const Images = await getFiles(images);
    if (images.length === 0) {
      notification.error({
        message: "Vui lòng chọn ít nhất 1 ảnh",
      });
      return;
    }

    handleUpdateServicePackage({
      values: {
        ...values,
        ServicePackageId: state.currentServicePackage.servicePackageId,
        Image: Images[0],
      },
      callBackFn: () => {
        setIsModalOpen(false);
        fetchServicePackage();
      },
    });
  };

  return (
    <Modal
      title={
        <Space className="text-base">
          <EditOutlined />
          <div className="uppercase text-secondary">Cập nhật gói dịch vụ</div>
        </Space>
      }
      open={open}
      afterClose={() => {
        updateServiceForm.resetFields();
        setImages([]);
      }}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ loading: state.isSending }}
      cancelButtonProps={{ disabled: state.isSending }}
      closeIcon={null}
      maskClosable={false}
      loading={specialUIState.isLoading}
      modalRender={(dom) => (
        <Form
          form={updateServiceForm}
          initialValues={initialValuesUpdateService}
          name="UpdateServiceForm"
          onFinish={handleUpdateServiceSubmit}
        >
          {dom}
        </Form>
      )}
    >
      <Space direction="vertical" className="w-full">
        <ImageUpload images={images} setImages={setImages} />
        <Form.Item
          name="Name"
          label={<div className="text-sm text-secondary">Tên gói dịch vụ</div>}
          rules={[
            {
              type: "string",
              required: true,
              whitespace: true,
              message: "Vui lòng nhập tên gói dịch vụ",
            },
          ]}
        >
          <Input placeholder="Nhập tên gói dịch vụ" size="large" />
        </Form.Item>
        <Form.Item
          name="Description"
          label={<div className="text-sm text-secondary">Mô tả</div>}
          rules={[
            {
              type: "string",
              required: true,
              whitespace: true,
              message: "Vui lòng nhập mô tả",
            },
          ]}
        >
          <TextEditor placeholder="Nhập mô tả" limit={200} />
        </Form.Item>
        <Form.Item
          name="NumOfRequest"
          label={<div className="text-sm text-secondary">Số lần sửa chữa</div>}
          rules={[
            {
              type: "number",
              required: true,
              min: 1,
              whitespace: true,
              message: "Số lần sửa chữa không hợp lệ",
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập số lần sửa chữa"
            className="w-1/2"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="Price"
          label={<div className="text-sm text-secondary">Giá gói (VND)</div>}
          rules={[
            {
              type: "number",
              required: true,
              min: 2000,
              message: "Giá gói phải ít nhất 2.000đ",
            },
          ]}
        >
          <InputNumber.Currency
            placeholder="Nhập giá của gói"
            className="w-1/2"
            step={1000}
            size="large"
          />
        </Form.Item>
      </Space>
    </Modal>
  );
}

type UpdateServiceModalProps = {
  open?: boolean;
  setIsModalOpen?: any;
  record: ServicePackage;
  fetchServicePackage: any;
};
