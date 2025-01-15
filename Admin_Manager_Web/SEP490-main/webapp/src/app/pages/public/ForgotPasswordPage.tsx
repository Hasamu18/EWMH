import { Space } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { PrimaryButton } from "../../components/buttons";
import { Form } from "../../components/form";
import { Input } from "../../components/inputs";
import { useAuth } from "../../hooks/useAuth";
import { SendPasswordResetLinkParams } from "../../redux/slice/authSlice";
import LoginBackground from "../../../assets/images/login_background.png";
import { ScreenCard } from "../../components/card";
import { useTitle } from "../../hooks/useTitle";

export default function LoginPage() {
  useTitle({ tabTitle: "Forgot Password - EWMH" });
  const { state: stateAuth, handleSendPasswordResetLink } = useAuth();

  const [form] = Form.useForm();

  const initialValues: SendPasswordResetLinkParams = {
    email: "",
  };

  const handleSubmit = async (values: SendPasswordResetLinkParams) => {
    handleSendPasswordResetLink({
      values: values,
    });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <img
        src={LoginBackground}
        className="absolute h-full w-full object-cover"
      />
      <ScreenCard
        cardTitle={"Đổi mật khẩu"}
        className="w-[500px]"
        bordered={false}
      >
        <div className="px-5">
          <Form
            form={form}
            initialValues={initialValues}
            name="ForgotPasswordForm"
            onFinish={handleSubmit}
          >
            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Form.Item
                  name="email"
                  label={
                    <Space>
                      <UserOutlined />
                      <span>Email</span>
                    </Space>
                  }
                  rules={[
                    {
                      type: "email",
                      required: true,
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" size="large" />
                </Form.Item>
                <Link to="/login">
                  Về trang đăng nhập
                  {/* <span className="underline">Đăng nhập</span> */}
                </Link>
              </div>
              <div className="flex justify-center">
                <PrimaryButton.BoldText
                  htmlType="submit"
                  text="Đồng ý"
                  loading={stateAuth.isSending}
                  className="w-full"
                />
              </div>
            </Space>
          </Form>
        </div>
      </ScreenCard>
    </div>
  );
}
