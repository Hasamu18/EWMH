import { ConfigProvider, Modal, ModalProps } from "antd";
import { useAppDispatch } from "../../redux/hook";
import { Form } from "../form";
import { Input } from "../inputs";
import { resetOTPModal } from "../../redux/slice/specialUISlice";

function CustomModal({ children, ...rest }: CustomModalProp) {
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Modal: {
              titleColor: "#FF7A00",
            },
          },
        }}
      >
        <Modal {...rest} destroyOnClose={true}>
          {children}
        </Modal>
      </ConfigProvider>
    </>
  );
}

function OTP(props: OTPProps) {
  const dispatch = useAppDispatch();
  const { children, extraValues, open, confirmLoading, handleOk } = props;
  const [form] = Form.useForm();

  const initialValues = {
    code: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    handleOk({ code: values.code, ...extraValues });
  };

  const handleCancel = () => {
    dispatch(resetOTPModal());
  };

  return (
    <Modal
      title="OTP"
      open={open}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
      afterClose={() => form.resetFields()}
    >
      {children}
      <Form
        form={form}
        initialValues={initialValues}
        name="OTPModal"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="code"
          rules={[
            {
              type: "string",
              required: true,
              whitespace: true,
            },
          ]}
        >
          <Input.OTP formatter={(str) => str.toUpperCase()} length={6} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

CustomModal.OTP = OTP;
CustomModal.useModal = Modal.useModal;

export default CustomModal;

type CustomModalProp = ModalProps;

type OTPProps = ModalProps & {
  extraValues: object;
  open: boolean;
  handleOk: (params: any) => void;
  confirmLoading: boolean;
};
