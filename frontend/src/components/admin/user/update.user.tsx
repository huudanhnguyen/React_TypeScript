import { updateUserAPI } from "@/services/api";
import { App, Button, Input, Modal, notification, Form } from "antd";
import { useState, useEffect } from "react";

interface IUser {
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  dataUpdate?: IUser | null;
  refreshTable: () => void;
}

type FieldType = {
  fullName: string;
  email: string;
  phone: string;
};

const UpdateUser = (props: IProps) => {
  const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (dataUpdate && openModalUpdate) {
      form.setFieldsValue({
        fullName: dataUpdate.fullName || "",
        email: dataUpdate.email || "",
        phone: dataUpdate.phone || "",
      });
    }
  }, [dataUpdate, openModalUpdate, form]);

  const onFinish = async (values: FieldType) => {
    if (!dataUpdate?._id) {
      notification.error({
        message: "Missing user ID",
        description: "Cannot update user without valid _id",
      });
      return;
    }

    setIsSubmit(true);
    try {
      // ✅ Gửi đúng ID và data
      const res = await updateUserAPI(dataUpdate._id,
  values.fullName,
  values.phone);

      if (res && res.data) {
        message.success("User updated successfully");
        form.resetFields();
        setOpenModalUpdate(false);
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
    setOpenModalUpdate(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Update User"
      open={openModalUpdate}
      onCancel={handleCancel}
      footer={null}
      confirmLoading={isSubmit}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        {/* ✅ Hiển thị _id chỉ để xem, không gửi lên server */}
        <Form.Item label="User ID">
          <Input value={dataUpdate?._id} disabled />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
      { required: true, message: "Please enter full name" },
      { min: 3, message: "Full name must be at least 3 characters" },
    ]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
      { required: true, message: "Please enter phone number" },
      {
        pattern: /^[0-9]{9,11}$/,
        message: "Phone number must be 9–11 digits and contain only numbers",
      },
    ]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmit} block>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
