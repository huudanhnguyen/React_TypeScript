import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Modal, Table } from "antd";
import type { UploadProps } from "antd";

const { Dragger } = Upload;

interface IProps {
  openModalImport: boolean;
  setOpenModalImport: (v: boolean) => void;
}

const ImportUser = ({ openModalImport, setOpenModalImport }: IProps) => {
  const [dataPreview, setDataPreview] = useState<
    { fullName: string; email: string; phone: string }[]
  >([]);

  const handleCancel = () => {
    setOpenModalImport(false);
  };

  const uploads: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",

    // 🔹 Giả lập upload
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        // 🔹 Dữ liệu giả sau khi upload
        setDataPreview([
          { fullName: "Nguyen Van A", email: "a@gmail.com", phone: "0123456789" },
          { fullName: "Tran Thi B", email: "b@gmail.com", phone: "0987654321" },
        ]);
        if (onSuccess) onSuccess("ok");
      }, 1000);
    },

    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Modal
      title="Import User"
      open={openModalImport}
      onCancel={handleCancel}
      okText="Import Data"
      okButtonProps={{ disabled: true }}
    >
      <Dragger {...uploads}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single file upload (.csv or .xlsx).
        </p>
      </Dragger>

      <Table
        title={() => <span>📋 Data preview:</span>}
        columns={[
          { dataIndex: "fullName", title: "Full Name" },
          { dataIndex: "email", title: "Email" },
          { dataIndex: "phone", title: "Phone" },
        ]}
        dataSource={dataPreview}
        rowKey="email"
        pagination={false}
        style={{ marginTop: 16 }}
      />
    </Modal>
  );
};

export default ImportUser;
