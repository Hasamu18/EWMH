import { WarningOutlined } from "@ant-design/icons";
import { Form } from "../../components/form";
import { Modal } from "../../components/modals";
import { useTitle } from "../../hooks/useTitle";
import { Space, TableColumnsType, Tag } from "antd";
import { Avatar } from "../../components/avatar";
import { statusGenerator } from "../../utils/generators/status";
import ProductManagementDropdown from "../../ui/manager_ui/ProductManagementPage/ProductManagementDropdown";
import CreateNewProductModalButton from "../../ui/manager_ui/ProductManagementPage/CreateNewProductModalButton";
import { Input } from "../../components/inputs";
import { Table } from "../../components/table";
import { Product } from "../../models/product";
import { formatCurrency } from "../../utils/helpers";
import { useCallback, useEffect, useState } from "react";
import { usePagination } from "../../hooks/usePagination";
import { useProduct } from "../../hooks/useProduct";
import { productStatusGenerator } from "../../utils/generators/productStatus";
import { useTranslation } from "react-i18next";

export default function ProductManagementPage() {
  const { t } = useTranslation("products");
  useTitle({
    tabTitle: "Products - EWMH",
    paths: [{ title: t("product_list"), path: "/products" }],
  });
  const [modal, contextHolder] = Modal.useModal();
  const [searchForm] = Form.useForm();
  const { state, handleGetAllProductPaginated, handleDisableProduct } =
    useProduct();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [searchByName, setSearchByName] = useState<string>();
  const [tableParams, setTableParams] = useState<TableParams>();

  const fetchProducts = useCallback(() => {
    handleGetAllProductPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByName: searchByName,
      IncreasingPrice: tableParams?.sorter?.priceByDate,
      Status: tableParams?.filters?.status?.[0],
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllProductPaginated,
    searchByName,
    tableParams?.filters?.status,
    tableParams?.sorter?.priceByDate,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const initialValuesSearch = {
    searchString: "",
  };

  const handleSearchSubmit = ({ searchString }: typeof initialValuesSearch) => {
    goToPage(1);
    setSearchByName(searchString);
  };

  function handleConfirmLock(productId: string) {
    modal.confirm({
      icon: <WarningOutlined />,
      width: "fit-content",
      title: (
        <div className="flex items-center whitespace-nowrap text-sm">
          <span>Bạn có muốn đổi trạng thái thành</span>
          <Tag color="volcano" className="mx-1">
            Vô hiệu hóa
          </Tag>
          <span>?</span>
        </div>
      ),
      onOk: async () => {
        await handleDisableProduct({
          values: { ProductId: productId, Status: true },
        });
        fetchProducts();
      },
    });
  }

  function handleConfirmUnlock(productId: string) {
    modal.confirm({
      icon: <WarningOutlined />,
      width: "fit-content",
      title: (
        <div className="flex items-center whitespace-nowrap text-sm">
          <span>Bạn có muốn đổi trạng thái thành</span>
          <Tag color="green" className="mx-1">
            Đang hoạt động
          </Tag>
          <span>?</span>
        </div>
      ),
      onOk: async () => {
        await handleDisableProduct({
          values: { ProductId: productId, Status: false },
        });
        fetchProducts();
      },
    });
  }

  const productListColumns: TableColumnsType<Product> = [
    {
      title: t("product_table.product_info"),
      dataIndex: "name",
      render: (_, { name, imageUrl }) => (
        <Space direction="horizontal" size={15}>
          <Avatar src={imageUrl} size={60} shape="square" />
          <Space direction="vertical">
            <div className="text-base font-bold">{name}</div>
          </Space>
        </Space>
      ),
    },
    {
      title: t("product_table.product_price"),
      dataIndex: "priceByDate",
      render: (value) => {
        return formatCurrency(value);
      },
      sorter: true,
    },
    {
      title: t("product_table.product_quantity"),
      dataIndex: "inOfStock",
    },
    {
      title: t("product_table.product_quantity_status"),
      render: (_, { inOfStock }) => {
        return <div>{productStatusGenerator(inOfStock)}</div>;
      },
    },
    {
      title: t("product_table.product_status"),
      dataIndex: "status",
      render: (_, { status, productId }) => {
        return (
          <div
            onClick={() =>
              status
                ? handleConfirmUnlock(productId)
                : handleConfirmLock(productId)
            }
            className="w-fit cursor-pointer"
          >
            {statusGenerator(status)}
          </div>
        );
      },
      filters: [
        {
          text: "Đang hoạt động",
          value: false,
        },
        {
          text: "Vô hiệu hóa",
          value: true,
        },
      ],
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <ProductManagementDropdown
          record={record}
          fetchProducts={fetchProducts}
        />
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" size={20} className="w-full">
        <div className="flex justify-end">
          <CreateNewProductModalButton />
        </div>
        <div className="flex items-center justify-end">
          <Form
            form={searchForm}
            initialValues={initialValuesSearch}
            name="SearchForm"
            onFinish={handleSearchSubmit}
            className="w-1/2"
          >
            <Form.Item
              noStyle
              name="searchString"
              rules={[
                {
                  type: "string",
                  whitespace: true,
                  message: "",
                },
              ]}
            >
              <Input.Search
                placeholder={t("search_by_name")}
                onSearch={() => searchForm.submit()}
                onClear={() => {
                  searchForm.setFieldValue("searchString", "");
                  searchForm.submit();
                }}
              />
            </Form.Item>
          </Form>
        </div>
        <Table
          columns={productListColumns}
          dataSource={state.currentProductList.products}
          rowKey={(record) => record.productId}
          loading={state.isFetching}
          pagination={{
            showSizeChanger: true,
            total: state.currentProductList.total,
            pageSize: currentPageSize,
            current: currentPage,
            onChange: (pageIndex, pageSize) => {
              goToPage(pageIndex);
              setPageSize(pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng ${total} sản phẩm`,
            pageSizeOptions: [5, 10, 20, 50, 100],
          }}
          onChange={(_, filters, sorter) => {
            setTableParams({
              filters: filters,
              sorter: {
                priceByDate:
                  Array.isArray(sorter) || !sorter.order
                    ? undefined
                    : sorter.order === "ascend"
                      ? true
                      : false,
              },
            });
          }}
        />
      </Space>
      {contextHolder}
    </>
  );
}

type TableParams = {
  filters?: {
    status?: boolean[];
  };
  sorter?: {
    priceByDate?: boolean | undefined;
  };
};
