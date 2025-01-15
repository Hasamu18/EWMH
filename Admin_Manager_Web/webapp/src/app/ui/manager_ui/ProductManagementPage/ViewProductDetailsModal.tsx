import { Space } from "antd";
import { Modal } from "../../../components/modals";
import { useEffect } from "react";
import { Product } from "../../../models/product";
import { useProduct } from "../../../hooks/useProduct";
import { useSpecialUI } from "../../../hooks/useSpecialUI";
import { Avatar } from "../../../components/avatar";
import { ToolOutlined } from "@ant-design/icons";
import { formatCurrency } from "../../../utils/helpers";
import { PrimaryButton } from "../../../components/buttons";
import htmlParse from "../../../utils/htmlParser";

export default function ViewProductDetailsModal({
  open = false,
  setIsModalOpen,
  product,
}: ViewProductModalProps) {
  const { state, handleGetProduct } = useProduct();
  const { state: specialUIState } = useSpecialUI();

  useEffect(() => {
    if (open) {
      handleGetProduct({ ProductId: product.productId });
    }
  }, [handleGetProduct, product.productId, open]);

  return (
    <Modal
      title={
        <Space className="text-base">
          <ToolOutlined />
          <div className="uppercase text-secondary">Thông tin sản phẩm</div>
        </Space>
      }
      open={open}
      footer={[
        <PrimaryButton
          key="close"
          text="Đóng"
          onClick={() => setIsModalOpen(false)}
          size="middle"
        />,
      ]}
      closeIcon={null}
      maskClosable={false}
      loading={specialUIState.isLoading}
    >
      <Space direction="vertical" className="w-full text-sm">
        <Space direction="vertical" size={5} className="w-full">
          <div className="flex gap-5">
            <div>
              <Avatar
                src={state.currentProduct.imageUrl}
                size={200}
                shape="square"
              />
            </div>
            <div>
              <div>
                <span className="font-bold">Tên sản phẩm: </span>
                {state.currentProduct.name}
              </div>
              <div>
                <span className="font-bold">Giá hiện tại: </span>
                {formatCurrency(state.currentProduct.priceByDate)}
              </div>
              <div>
                <span className="font-bold">Số lượng trong kho: </span>
                {state.currentProduct.inOfStock}
              </div>
              <div>
                <span className="font-bold">Bảo hành: </span>
                {state.currentProduct.warantyMonths} tháng
              </div>
            </div>
          </div>
        </Space>
        <Space direction="vertical" size={5}>
          <div>
            <div className="font-bold">Mô tả: </div>
            {htmlParse(state.currentProduct.description)}
          </div>
        </Space>
      </Space>
    </Modal>
  );
}

type ViewProductModalProps = {
  open?: boolean;
  setIsModalOpen?: any;
  product: Product;
};
