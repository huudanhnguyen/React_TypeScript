import { createUserAPI } from "@/services/api";
import { App, Button, Input, Modal, notification, Form } from "antd";
import { useState } from "react";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: string;
};

const CreateUser = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();

  const onFinish = async (values: FieldType) => {
    const { fullName, password, email, phone } = values;
    setIsSubmit(true);

    try {
      const res = await createUserAPI(fullName, email, password, phone);
      if (res && res.data) {
        message.success("Create user successfully");
        form.resetFields();
        setOpenModalCreate(false);
        refreshTable();
      } else {
        notification.error({
          message: "Something went wrong",
          description: res?.message || "Unknown error",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "API Error",
        description: error?.message || "Server error",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const handleCancel = () => {
    setOpenModalCreate(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Create User"
      open={openModalCreate}
      onCancel={handleCancel}
      footer={null}
      confirmLoading={isSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            { required: true, message: "Please enter full name" },
            { min: 3, message: "Full name must be at least 3 characters" },
            {
              pattern: /^[A-Za-zÀ-ỹ\s]+$/,
              message: "Full name cannot contain numbers or special characters",
            },
          ]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter password" },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must be at least 8 characters, include upper/lowercase, number and special character",
            },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^[0-9]{9,11}$/,
              message:
                "Phone number must be 9–11 digits and contain only numbers",
            },
          ]}
        >
          <Input placeholder="Enter phone" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmit} block>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUser;
