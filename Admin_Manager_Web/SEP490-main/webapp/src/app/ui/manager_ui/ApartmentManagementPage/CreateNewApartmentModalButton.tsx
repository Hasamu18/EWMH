import { App, Input, Space } from "antd";
import { Form } from "../../../components/form";
import { Modal } from "../../../components/modals";
import { PrimaryButton } from "../../../components/buttons";
import {
  HomeOutlined,
  PhoneFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { TextEditor } from "../../../components/rte";
import { ImageUpload } from "../../../components/image-upload";
import { UploadImage } from "../../../components/image-upload/image-upload";
import { InputSelect } from "../../../components/inputs";
import { Avatar } from "../../../components/avatar";
import { useAccount } from "../../../hooks/useAccount";
import { Leader } from "../../../models/user";
import { AddApartmentParams } from "../../../redux/slice/apartmentSlice";
import { getFiles } from "../../../utils/helpers";
import { useApartment } from "../../../hooks/useApartment";
import { Skeleton } from "../../../components/skeletons";
import { useSpecialUI } from "../../../hooks/useSpecialUI";
import { useTranslation } from "react-i18next";

export default function CreateNewApartmentModalButton() {
  const { t } = useTranslation("apartments");
  const { notification } = App.useApp();
  const [createNewApartmentForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [images, setImages] = useState<UploadImage[]>([]);
  const { state: accountState, handleGetAllFreeLeaders } = useAccount();
  const {
    state: apartmentState,
    handleAddApartment,
    handleGetAllApartmentsPaginated,
  } = useApartment();
  const { state: specialUIState } = useSpecialUI();

  const initialValuesCreateNewApartment: Partial<AddApartmentParams> = {
    Name: "",
    Address: "",
    ManagementCompany: "",
    Description: undefined,
    Image: { name: "" },
    LeaderId: undefined,
  };

  // async function fetchFreeLeaderList(
  //   email: string,
  // ): Promise<{ label: string; value: string }[]> {
  //   return agent.Account.getAllFreeLeaders().then((body) => {
  //     const trimmedEmail = email.trim();
  //     // if (!trimmedEmail) return [];

  //     return body
  //       .filter((leader: Leader) => leader.email.includes(trimmedEmail))
  //       .map((leader: Leader) => ({
  //         label: `${leader.fullName} - ${leader.email} ${leader.areaId ? `(${leader.name})` : ""}`,
  //         value: leader.accountId,
  //       }));
  //   });
  // }

  useEffect(() => {
    if (isModalVisible) {
      handleGetAllFreeLeaders();
    }
  }, [handleGetAllFreeLeaders, isModalVisible]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    createNewApartmentForm.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateNewServiceSubmit = async (values: any) => {
    const Images = await getFiles(images);
    if (images.length === 0) {
      notification.error({
        message: "Vui lòng chọn ít nhất 1 ảnh",
      });
      return;
    }

    await handleAddApartment({
      values: {
        ...values,
        Image: Images[0],
      },
      callBackFn: () => {
        setIsModalVisible(false);
        handleGetAllApartmentsPaginated({ PageIndex: 1, Pagesize: 8 });
      },
    });
  };

  return (
    <>
      <PrimaryButton
        text={t("create_new_apartment.title")}
        icon={<PlusCircleOutlined />}
        onClick={showModal}
      />
      <Modal
        title={
          <Space className="text-base">
            <HomeOutlined />
            <div className="uppercase text-secondary">
              {t("create_new_apartment.title")}
            </div>
          </Space>
        }
        open={isModalVisible}
        afterClose={() => {
          createNewApartmentForm.resetFields();
          setImages([]);
        }}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: apartmentState.isSending }}
        cancelButtonProps={{ disabled: apartmentState.isSending }}
        closeIcon={null}
        maskClosable={false}
        modalRender={(dom) => (
          <Form
            form={createNewApartmentForm}
            initialValues={initialValuesCreateNewApartment}
            name="UpdateServiceForm"
            onFinish={handleCreateNewServiceSubmit}
          >
            {dom}
          </Form>
        )}
        width={650}
      >
        <Space direction="vertical" className="w-full">
          <ImageUpload images={images} setImages={setImages} />
          <Form.Item
            name="Name"
            label={
              <div className="text-sm text-secondary">
                {t("create_new_apartment.apartment_name")}
              </div>
            }
            rules={[
              {
                type: "string",
                required: true,
                whitespace: true,
                message: "Vui lòng nhập tên chung cư",
              },
              {
                type: "string",
                min: 4,
                message: "Tên chung cư phải có ít nhất 4 ký tự",
              },
            ]}
          >
            <Input placeholder="Nhập tên chung cư" size="large" />
          </Form.Item>
          <Form.Item
            name="Address"
            label={
              <div className="text-sm text-secondary">
                {t("create_new_apartment.apartment_address")}
              </div>
            }
            rules={[
              {
                type: "string",
                required: true,
                whitespace: true,
                message: "Vui lòng nhập địa chỉ chung cư",
              },
              {
                type: "string",
                min: 4,
                message: "Địa chỉ chung cư phải có ít nhất 4 ký tự",
              },
            ]}
          >
            <Input placeholder="Nhập địa chỉ" size="large" />
          </Form.Item>
          <Form.Item
            name="ManagementCompany"
            label={
              <div className="text-sm text-secondary">
                {t("create_new_apartment.apartment_company")}
              </div>
            }
            rules={[
              {
                type: "string",
                required: true,
                whitespace: true,
                message: "Vui lòng nhập tên công ty",
              },
              {
                type: "string",
                min: 4,
                message: "Tên công ty phải có ít nhất 4 ký tự",
              },
            ]}
          >
            <Input placeholder="Nhập tên công ty" size="large" />
          </Form.Item>
          <Form.Item
            name="Description"
            label={
              <div className="text-sm text-secondary">
                {t("create_new_apartment.apartment_description")}
              </div>
            }
            rules={[
              {
                type: "string",
                required: true,
                whitespace: true,
                message: "Vui lòng nhập mô tả chung cư",
              },
            ]}
          >
            <TextEditor placeholder="Nhập mô tả" />
          </Form.Item>
          <Space direction="vertical" className="w-full" size={0}>
            <Form.Item
              name="LeaderId"
              label={
                <div className="text-sm text-secondary">
                  {t("create_new_apartment.apartment_leader")}
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trưởng nhóm",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              {/* <InputSelect.Debounce
                className="w-full"
                placeholder="Tìm kiếm bằng email"
                onFocus={() => fetchFreeLeaderList("")}
                fetchOptions={fetchFreeLeaderList}
                allowClear
                size="large"
              /> */}
              <InputSelect
                className="w-full"
                placeholder="Chọn trưởng nhóm"
                options={(accountState.freeLeaderList.users as Leader[]).map(
                  (leader) => ({
                    label: `${leader.fullName} - ${leader.email} ${leader.areaId ? `(${leader.name})` : ""}`,
                    value: leader.accountId,
                  }),
                )}
                loading={specialUIState.isLoading}
                size="large"
                allowClear
              />
            </Form.Item>
            <Form.Item
              shouldUpdate={(prev, cur) => prev.LeaderId !== cur.LeaderId}
            >
              {({ getFieldValue }) => {
                const leaderIdForm = getFieldValue("LeaderId");
                const currentLeader = (
                  accountState.freeLeaderList.users as Leader[]
                ).find((leader) => leader.accountId === leaderIdForm) as Leader;

                return leaderIdForm ? (
                  <div className="rounded-lg border-2 border-solid border-secondary p-2">
                    <Space direction="vertical" className="text-sm">
                      <Avatar
                        size={80}
                        src={currentLeader?.avatarUrl}
                        loading={accountState.isFetching}
                      />
                      {accountState.isFetching ? (
                        <Skeleton
                          title={{ width: 200 }}
                          paragraph={{ rows: 1, width: 400 }}
                        />
                      ) : (
                        <>
                          <div className="text-lg font-bold">
                            {currentLeader?.fullName}
                          </div>
                          <Space>
                            <div>
                              <span className="font-bold">Email: </span>
                              <span>{currentLeader?.email}</span>
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
                          </Space>
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
        </Space>
      </Modal>
    </>
  );
}
