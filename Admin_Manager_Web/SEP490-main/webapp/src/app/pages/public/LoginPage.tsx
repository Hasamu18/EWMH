import { Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { PrimaryButton } from "../../components/buttons";
import { Form } from "../../components/form";
import { Input } from "../../components/inputs";
import { useAuth } from "../../hooks/useAuth";
import { LoginParams } from "../../redux/slice/authSlice";
import LoginBackground from "../../../assets/images/login_background.png";
import { ScreenCard } from "../../components/card";
import { useTitle } from "../../hooks/useTitle";

export default function LoginPage() {
  useTitle({ tabTitle: "Login - EWMH" });
  const navigate = useNavigate();
  const { state: stateAuth, handleLogin } = useAuth();

  const [form] = Form.useForm();

  const initialValues: LoginParams = {
    email_Or_Phone: "",
    password: "",
  };

  const handleSubmit = async (values: LoginParams) => {
    handleLogin(values, navigate);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <img
        src={LoginBackground}
        className="absolute h-full w-full object-cover"
      />
      <ScreenCard
        cardTitle={"Hệ thống quản lí EWMH"}
        className="w-[500px]"
        bordered={false}
      >
        <div className="px-5">
          <Form
            form={form}
            initialValues={initialValues}
            name="LoginPage"
            onFinish={handleSubmit}
          >
            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Form.Item
                  name="email_Or_Phone"
                  label={
                    <Space>
                      <UserOutlined />
                      <span>Email / Số điện thoại</span>
                    </Space>
                  }
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Vui lòng nhập email hoặc số điện thoại",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập email hoặc số điện thoại"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={
                    <Space>
                      <LockOutlined />
                      <span>Mật khẩu</span>
                    </Space>
                  }
                  rules={[
                    {
                      type: "string",
                      required: true,
                      whitespace: true,
                      message: "Vui lòng nhập mật khẩu",
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" size="large" />
                </Form.Item>
                <Link to="/forgot-password">
                  Đổi mật khẩu
                  {/* <span className="underline">Đổi mật khẩu</span> */}
                </Link>
              </div>
              <div className="flex justify-center">
                <Form.Item className="w-full">
                  <PrimaryButton.BoldText
                    htmlType="submit"
                    text="Đăng nhập"
                    loading={stateAuth.isSending}
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </Space>
          </Form>
        </div>
      </ScreenCard>
    </div>
  );
}
