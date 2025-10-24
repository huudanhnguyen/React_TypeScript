import React from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: LoginFormValues) => {
    // Chỉ để tạm log ra console, không xử lý đăng nhập
    console.log("Form values:", values);
    message.success("This is UI only — no login logic!");
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
            name="email"
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
              style={{
                borderRadius: 8,
                background: "linear-gradient(90deg, #1890ff, #40a9ff)",
                boxShadow: "0 4px 10px rgba(24,144,255,0.3)",
                fontWeight: 500,
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
