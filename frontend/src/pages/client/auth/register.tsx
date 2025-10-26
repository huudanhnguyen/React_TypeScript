import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, App } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { registerAPI } from "@/services/api";

const { Title, Text } = Typography;

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      setIsSubmit(true);
      const { fullName, email, password, phone } = values;

      const res = await registerAPI(fullName, email, password, phone);

      if (res.data) {
        message.success("Register successfully!");
        navigate("/login");
      } else {
        message.error(res.message || "Registration failed!");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Server error!");
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
          width: 420,
          padding: "30px 25px",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <UserOutlined style={{ fontSize: 40, color: "#1890ff" }} />
          <Title level={3} style={{ marginTop: 10, marginBottom: 5 }}>
            Create Account ✨
          </Title>
          <Text type="secondary">Join us and start exploring!</Text>
        </div>

        <Form
          form={form}
          name="registerForm"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="on"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            hasFeedback
            rules={[{ required: true, message: "Please enter your full name!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              placeholder="Enter your full name"
              size="large"
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            hasFeedback
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#1890ff" }} />}
              placeholder="Enter your email"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            hasFeedback
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
              {
                pattern: /^(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must include at least 1 uppercase letter and 1 number!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              placeholder="Enter your password"
              size="large"
              autoComplete="new-password"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#1890ff" />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            hasFeedback
            rules={[
              { required: true, message: "Please enter your phone number!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message:
                  "Phone number must be 10–11 digits and contain only numbers!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: "#1890ff" }} />}
              placeholder="Enter your phone number"
              size="large"
              autoComplete="tel"
            />
          </Form.Item>

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
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#1890ff", fontWeight: 500 }}>
                Login
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
