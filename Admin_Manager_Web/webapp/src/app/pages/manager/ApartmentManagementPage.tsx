import { EnvironmentFilled } from "@ant-design/icons";
import { Form } from "../../components/form";
import { useTitle } from "../../hooks/useTitle";
import { Drawer, Space, TableColumnsType, Typography } from "antd";
import { Avatar } from "../../components/avatar";
import { Table } from "../../components/table";
import { Apartment } from "../../models/apartment";
import { leaderNameGenerator } from "../../utils/generators/name";
import ApartmentManagementDropdown from "../../ui/manager_ui/ApartmentManagementPage/ApartmentManagementDropdown";
import { Input } from "../../components/inputs";
import CreateNewApartmentModalButton from "../../ui/manager_ui/ApartmentManagementPage/CreateNewApartmentModalButton";
import { useApartment } from "../../hooks/useApartment";
import { usePagination } from "../../hooks/usePagination";
import { useCallback, useEffect, useState } from "react";
import htmlParse from "../../utils/htmlParser";
import ApartmentDetails from "../../ui/manager_ui/ApartmentManagementPage/ApartmentDetails/ApartmentDetails";
import { useSpecialUI } from "../../hooks/useSpecialUI";
import { useTranslation } from "react-i18next";

const { Paragraph } = Typography;

export default function ApartmentManagementPage() {
  const { t } = useTranslation("apartments");
  useTitle({
    tabTitle: "Apartments - EWMH",
    paths: [{ title: t("apartment_list"), path: "/apartments" }],
  });
  const [searchForm] = Form.useForm();
  const { state: apartmentState, handleGetAllApartmentsPaginated } =
    useApartment();
  const { state: specialUIState } = useSpecialUI();
  const { currentPage, currentPageSize, setPageSize, goToPage } =
    usePagination();
  const [searchByName, setSearchByName] = useState<string>();
  const [open, setOpen] = useState(false);

  const fetchApartments = useCallback(() => {
    handleGetAllApartmentsPaginated({
      PageIndex: currentPage,
      Pagesize: currentPageSize,
      SearchByName: searchByName,
    });
  }, [
    currentPage,
    currentPageSize,
    handleGetAllApartmentsPaginated,
    searchByName,
  ]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const initialValuesSearch = {
    searchString: "",
  };

  const handleSearchSubmit = ({ searchString }: typeof initialValuesSearch) => {
    goToPage(1);
    setSearchByName(searchString);
  };

  const apartmentListColumns: TableColumnsType<Apartment> = [
    {
      title: t("apartment_table.apartment_info"),
      render: (_, { name, avatarUrl, address }) => (
        <Space direction="horizontal" size={15}>
          <Avatar src={avatarUrl} size={60} shape="square" />
          <Space direction="vertical">
            <div className="text-base font-bold">{name}</div>
            <Space>
              <EnvironmentFilled />
              <Paragraph
                ellipsis={{ rows: 1 }}
                className="!m-0 max-w-[250px] text-sm"
              >
                {address}
              </Paragraph>
            </Space>
          </Space>
        </Space>
      ),
    },
    {
      title: t("apartment_table.apartment_company"),
      dataIndex: "managementCompany",
    },
    {
      title: t("apartment_table.apartment_description"),
      dataIndex: "description",
      render: (value) => (
        <Paragraph
          ellipsis={{ rows: 2 }}
          className="!m-0 max-w-[500px] break-words text-sm"
        >
          {htmlParse(value)}
        </Paragraph>
      ),
    },
    {
      title: t("apartment_table.apartment_leader_name"),
      render: (_, { account }) => {
        return <div>{leaderNameGenerator(account.fullName)}</div>;
      },
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <ApartmentManagementDropdown
          apartment={record}
          setDrawerOpen={setOpen}
        />
      ),
    },
  ];

  return (
    <>
      <Drawer
        title="Thông tin chung cư"
        placement="right"
        open={open}
        getContainer={false}
        destroyOnClose
        onClose={() => setOpen(false)}
        width="100%"
        style={{ height: "93vh" }}
      >
        <ApartmentDetails
          loading={specialUIState.isLoading}
          apartment={apartmentState.currentApartment}
        />
      </Drawer>
      <Space direction="vertical" size={20} className="w-full">
        <div className="flex justify-end">
          <CreateNewApartmentModalButton />
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
                placeholder={t("search_by_apartment_name")}
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
          columns={apartmentListColumns}
          dataSource={apartmentState.currentApartmentList.apartments}
          rowKey={(record) => record.areaId}
          loading={apartmentState.isFetching}
          pagination={{
            showSizeChanger: true,
            total: apartmentState.currentApartmentList.total,
            pageSize: currentPageSize,
            current: currentPage,
            onChange: (pageIndex, pageSize) => {
              goToPage(pageIndex);
              setPageSize(pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng ${total} chung cư`,
            pageSizeOptions: [5, 10, 20, 50, 100],
          }}
        />
      </Space>
    </>
  );
}
