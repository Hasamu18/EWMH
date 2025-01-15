import { Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import { PrimaryButton } from "../../components/buttons";
import { Form } from "../../components/form";
import { Input } from "../../components/inputs";
import { useAuth } from "../../hooks/useAuth";
import { ResetPasswordParams } from "../../redux/slice/authSlice";
import LoginBackground from "../../../assets/images/login_background.png";
import { ScreenCard } from "../../components/card";
import { useTitle } from "../../hooks/useTitle";
import { useQueryParam } from "../../hooks/useQueryParam";
import { useEffect } from "react";

export default function LoginPage() {
  useTitle({ tabTitle: "Change Password - EWMH" });
  const navigate = useNavigate();
  const { state: stateAuth, handleResetPassword } = useAuth();
  const [form] = Form.useForm();
  const token = useQueryParam("token", true);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate, token]);

  const initialValues: ResetPasswordParams = {
    token: "",
    password: "",
  };

  const handleSubmit = async (values: ResetPasswordParams) => {
    if (token) {
      handleResetPassword({
        values: { password: values.password, token: token },
        // callBackFn: () => navigate("/login", { replace: true }),
      });
    }
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
            name="ChangePasswordForm"
            onFinish={handleSubmit}
          >
            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Form.Item
                  name="password"
                  label={
                    <Space>
                      <LockOutlined />
                      <span>Mật khẩu mới</span>
                    </Space>
                  }
                  rules={[
                    {
                      type: "string",
                      required: true,
                      whitespace: true,
                      message: "Vui lòng nhập mật khẩu",
                    },
                    {
                      max: 20,
                      message: "Mật khẩu không được quá 20 ký tự",
                    },
                    {
                      min: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                      message:
                        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu mới"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  label={
                    <Space>
                      <LockOutlined />
                      <span>Nhập lại mật khẩu</span>
                    </Space>
                  }
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      type: "string",
                      required: true,
                      whitespace: true,
                      message: "Vui lòng nhập lại mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu bạn nhập không khớp"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập lại mật khẩu mới"
                    size="large"
                  />
                </Form.Item>

                <Link to="/login">
                  Về trang đăng nhập
                  {/* <span className="underline">Đăng nhập</span> */}
                </Link>
              </div>
              <div className="flex justify-center">
                <PrimaryButton.BoldText
                  htmlType="submit"
                  text="Đổi mật khẩu"
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
