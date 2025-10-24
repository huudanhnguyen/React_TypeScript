import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Form, Input, Typography, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

const { Title, Text } = Typography;
interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  phone: number;
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: RegisterFormValues) => {
    // Chỉ log ra console để test, không xử lý đăng ký thật
    console.log("Form values:", values);
    message.success("This is UI only — no register logic!");
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
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            hasFeedback
            rules={[
              { required: true, message: "Please enter your full name!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              placeholder="Enter your full name"
              size="large"
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
            />
          </Form.Item>

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
