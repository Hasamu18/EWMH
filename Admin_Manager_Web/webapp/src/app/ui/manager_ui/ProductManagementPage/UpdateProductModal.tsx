import { App, Space } from "antd";
import { Modal } from "../../../components/modals";
import { Form } from "../../../components/form";
import { Input, InputNumber } from "../../../components/inputs";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Product } from "../../../models/product";
import { UploadImage } from "../../../components/image-upload/image-upload";
import { validateImageString, getFiles } from "../../../utils/helpers";
import { ImageUpload } from "../../../components/image-upload";
import { TextEditor } from "../../../components/rte";
import { UpdateProductParams } from "../../../redux/slice/productSlice";
import { useProduct } from "../../../hooks/useProduct";
import { useSpecialUI } from "../../../hooks/useSpecialUI";

export default function UpdateProductModal({
  open = false,
  setIsModalOpen,
  product,
  fetchProducts,
}: UpdateProductModalProps) {
  const { notification } = App.useApp();
  const [updateProductForm] = Form.useForm();
  const [images, setImages] = useState<UploadImage[]>([]);
  const { state, handleGetProduct, handleUpdateProduct } = useProduct();
  const { state: specialUIState } = useSpecialUI();

  const initialValuesUpdateProduct: UpdateProductParams = {
    ProductId: "",
    Name: "",
    Description: "",
    Price: 0,
    InOfStock: 0,
    WarantyMonths: 0,
    Image: { name: "" },
  };

  useEffect(() => {
    if (open) {
      handleGetProduct({ ProductId: product.productId });
    }
  }, [handleGetProduct, product.productId, open]);

  useEffect(() => {
    updateProductForm.setFieldsValue({
      Name: state.currentProduct.name,
      Description: state.currentProduct.description,
      Price: state.currentProduct.priceByDate,
      InOfStock: state.currentProduct.inOfStock,
      WarantyMonths: state.currentProduct.warantyMonths,
    });
    if (state.currentProduct.imageUrl) {
      setImages([
        {
          name: "",
          url: validateImageString(state.currentProduct.imageUrl),
        },
      ]);
    }
  }, [state.currentProduct, updateProductForm]);

  const handleOk = () => {
    updateProductForm.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateProductSubmit = async (values: any) => {
    const Images = await getFiles(images);
    if (images.length === 0) {
      notification.error({
        message: "Vui lòng chọn ít nhất 1 ảnh",
      });
      return;
    }

    handleUpdateProduct({
      values: {
        ...values,
        ProductId: state.currentProduct.productId,
        Image: Images[0],
      },
      callBackFn: () => {
        setIsModalOpen(false);
        fetchProducts();
      },
    });
  };

  return (
    <Modal
      title={
        <Space className="text-base">
          <EditOutlined />
          <div className="uppercase text-secondary">Cập nhật sẩn phẩm</div>
        </Space>
      }
      open={open}
      afterClose={() => {
        updateProductForm.resetFields();
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
          form={updateProductForm}
          initialValues={initialValuesUpdateProduct}
          name="UpdateProductForm"
          onFinish={handleUpdateProductSubmit}
        >
          {dom}
        </Form>
      )}
    >
      <Space direction="vertical" className="w-full">
        <ImageUpload images={images} setImages={setImages} />
        <Form.Item
          name="Name"
          label={<div className="text-sm text-secondary">Tên sản phẩm</div>}
          rules={[
            {
              type: "string",
              required: true,
              whitespace: true,
              message: "Tên sản phẩm không được để trống",
            },
            {
              min: 4,
              message: "Tên sản phẩm phải có ít nhất 4 ký tự",
            },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" size="large" disabled />
        </Form.Item>
        <Form.Item
          name="Description"
          label={<div className="text-sm text-secondary">Mô tả</div>}
          rules={[
            {
              type: "string",
              required: true,
              whitespace: true,
              message: "Mô tả không được để trống",
            },
          ]}
        >
          <TextEditor placeholder="Nhập mô tả" />
        </Form.Item>
        <Form.Item
          name="Price"
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
            placeholder="Nhập giá của gói"
            className="w-1/2"
            step={1000}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="InOfStock"
          label={<div className="text-sm text-secondary">Số lượng</div>}
          rules={[
            {
              type: "number",
              min: 0,
              required: true,
              message: "Số lượng không hợp lệ",
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập số lượng"
            className="w-1/2"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="WarantyMonths"
          label={
            <div className="text-sm text-secondary">Số tháng bảo hành</div>
          }
          rules={[
            {
              type: "number",
              min: 0,
              required: true,
              message: "Số tháng bảo hành không hợp lệ",
            },
          ]}
        >
          <InputNumber
            placeholder="Nhập số tháng"
            className="w-1/2"
            size="large"
          />
        </Form.Item>
      </Space>
    </Modal>
  );
}

type UpdateProductModalProps = {
  open?: boolean;
  setIsModalOpen?: any;
  product: Product;
  fetchProducts: any;
};
