import { App, Input, Space } from "antd";
import { Form } from "../../../components/form";
import { Modal } from "../../../components/modals";
import { InputNumber } from "../../../components/inputs";
import { PrimaryButton } from "../../../components/buttons";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { TextEditor } from "../../../components/rte";
import { ImageUpload } from "../../../components/image-upload";
import { UploadImage } from "../../../components/image-upload/image-upload";
import { useServicePackage } from "../../../hooks/useServicePackage";
import { AddServicePackageParams } from "../../../redux/slice/servicePackageSlice";
import { getFiles } from "../../../utils/helpers";
import { useTranslation } from "react-i18next";

export default function CreateNewServicePackageModalButton() {
  const { t } = useTranslation("services");
  const { notification } = App.useApp();
  const [createNewServicePackageForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [images, setImages] = useState<UploadImage[]>([]);
  const {
    state,
    handleAddServicePackage,
    handleGetAllServicePackagePaginated,
  } = useServicePackage();

  const initialValuesCreateNewService: AddServicePackageParams = {
    Name: "",
    Description: "",
    NumOfRequest: 0,
    Image: { name: "" },
    Price: 0,
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    createNewServicePackageForm.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateNewServiceSubmit = async (
    values: AddServicePackageParams,
  ) => {
    const Images = await getFiles(images);
    if (images.length === 0) {
      notification.error({
        message: "Vui lòng chọn ít nhất 1 ảnh",
      });
      return;
    }

    await handleAddServicePackage({
      values: {
        ...values,
        Image: Images[0],
      },
      callBackFn: () => {
        setIsModalVisible(false);
        handleGetAllServicePackagePaginated({ PageIndex: 1, Pagesize: 8 });
      },
    });
  };

  return (
    <>
      <PrimaryButton
        text={t("create_new_service_package.title")}
        icon={<PlusCircleOutlined />}
        onClick={showModal}
      />
      <Modal
        title={
          <Space className="text-base">
            <EditOutlined />
            <div className="uppercase text-secondary">
              {t("create_new_service_package.title")}
            </div>
          </Space>
        }
        open={isModalVisible}
        afterClose={() => {
          createNewServicePackageForm.resetFields();
          setImages([]);
        }}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: state.isSending }}
        cancelButtonProps={{ disabled: state.isSending }}
        closeIcon={null}
        maskClosable={false}
        modalRender={(dom) => (
          <Form
            form={createNewServicePackageForm}
            initialValues={initialValuesCreateNewService}
            name="CreateNewServiceForm"
            onFinish={handleCreateNewServiceSubmit}
          >
            {dom}
          </Form>
        )}
      >
        <Space direction="vertical" className="w-full">
          <ImageUpload images={images} setImages={setImages} />
          <Form.Item
            name="Name"
            label={
              <div className="text-sm text-secondary">
                {t("create_new_service_package.service_package_name")}
              </div>
            }
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
            label={
              <div className="text-sm text-secondary">
                {t("create_new_service_package.service_package_description")}
              </div>
            }
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
            label={
              <div className="text-sm text-secondary">
                {t("create_new_service_package.service_package_num_of_request")}
              </div>
            }
            rules={[
              {
                type: "number",
                min: 1,
                required: true,
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
            label={
              <div className="text-sm text-secondary">
                {t("create_new_service_package.service_package_price")}
              </div>
            }
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
    </>
  );
}
