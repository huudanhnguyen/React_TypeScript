import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, App } from "antd";
import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const{setIsAuthenticated,setUser}=useCurrentApp();

const onFinish = async (values: LoginFormValues) => {
  try {
    setIsSubmit(true);
    const { username, password } = values;

    const res = await loginAPI(username, password);

    if (res.data) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      message.success("Login successfully!");
      navigate("/");
    } else {
      notification.error({
        message: "Login failed!",
        description: Array.isArray(res.message)
          ? res.message.join(", ")
          : res.message || "Invalid username or password!",
        duration: 4,
      });
    }
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Server error. Please try again!";

    notification.error({
      message: "Login failed!",
      description: Array.isArray(errMsg) ? errMsg.join(", ") : errMsg,
      duration: 5,
    });
  } finally {
    setIsSubmit(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: "30px 25px",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <LockOutlined style={{ fontSize: 40, color: "#1890ff" }} />
          <Title level={3} style={{ marginTop: 10, marginBottom: 5 }}>
            Welcome Back 👋
          </Title>
          <Text type="secondary">Login to your account</Text>
        </div>

        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="username"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#1890ff" }} />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              placeholder="Enter your password"
              size="large"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#1890ff" />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text
              type="secondary"
              style={{
                cursor: "pointer",
              }}
              onClick={() => message.info("Forgot password clicked!")}
            >
              Forgot password?
            </Text>
            <Text
              style={{
                color: "#1890ff",
                cursor: "pointer",
              }}
            >
              <Link
                to="/register"
                style={{ color: "#1890ff", fontWeight: 500 }}
              >
                Create Account
              </Link>
            </Text>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isSubmit}
              style={{
                borderRadius: 8,
                background: "linear-gradient(90deg, #1890ff, #40a9ff)",
                boxShadow: "0 4px 10px rgba(24,144,255,0.3)",
                fontWeight: 500,
              }}
            >
              {isSubmit ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
