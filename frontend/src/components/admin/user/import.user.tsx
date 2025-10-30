import React, { useState } from "react";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import { Upload, Modal, Table, App, Button, Space } from "antd";
import type { UploadProps } from "antd";
import ExcelJS from "exceljs";
import { createUserAPI, getUserAPI } from "@/services/api";

const { Dragger } = Upload;

interface IProps {
  openModalImport: boolean;
  setOpenModalImport: (v: boolean) => void;
  refreshTable: () => void;
}

interface IUserImport {
  fullName: string;
  email: string;
  phone: string;
}

const ImportUser = ({
  openModalImport,
  setOpenModalImport,
  refreshTable,
}: IProps) => {
  const [dataPreview, setDataPreview] = useState<IUserImport[]>([]);
  const [dataImport, setDataImport] = useState<IUserImport[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { message: antdMessage } = App.useApp();
  const [fileList, setFileList] = useState<any[]>([]);

  // ❌ Close modal and reset data
  const handleCancel = () => {
    setOpenModalImport(false);
    setDataPreview([]);
    setDataImport([]);
    setFileList([]);
  };

  // ✅ Download sample Excel file
  const handleDownloadSample = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sample Users");

      worksheet.columns = [
        { header: "Full Name", key: "fullName", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phone", width: 20 },
      ];

      // Thêm một dòng mẫu
      worksheet.addRow({
        fullName: "John Doe",
        email: "john@example.com",
        phone: "0123456789",
      });

      // Style header
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFCCE5FF" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sample_import_users.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);

      antdMessage.success("Sample file downloaded successfully!");
    } catch (error) {
      console.error("Download sample failed:", error);
      antdMessage.error("Failed to download sample file!");
    }
  };

  // ✅ Import data
  const handleImportData = async () => {
    if (dataImport.length === 0) {
      antdMessage.warning("No data to import!");
      return;
    }

    try {
      setIsImporting(true);
      antdMessage.loading("Checking duplicate users...");

      // 1️⃣ Get all existing users (only email)
      const res = await getUserAPI("current=1&pageSize=9999");
      const existingEmails =
        res?.data?.result?.map((u: any) => u.email.toLowerCase()) || [];

      // 2️⃣ Filter out duplicates
      const newUsers = dataImport.filter(
        (user) => !existingEmails.includes(user.email.toLowerCase())
      );

      const duplicateCount = dataImport.length - newUsers.length;

      if (newUsers.length === 0) {
        antdMessage.warning("All users already exist!");
        handleCancel();
        return;
      }

      // 3️⃣ Import only new users
      antdMessage.loading("Importing users...");
      for (const user of newUsers) {
        const { fullName, email, phone } = user;
        await createUserAPI(fullName, email, "123456", phone);
      }

      antdMessage.success(
        `${newUsers.length} users imported successfully. ${duplicateCount} duplicates skipped.`
      );

      refreshTable();
      handleCancel();
    } catch (error: any) {
      console.error("Import failed:", error);
      antdMessage.error(error.response?.data?.message || "Import failed!");
    } finally {
      setIsImporting(false);
    }
  };

  // ✅ Handle Excel upload
  const uploads: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    fileList,
    async customRequest({ file, onSuccess, onError }) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer);

          const worksheet = workbook.getWorksheet(1);
          if (!worksheet) {
            antdMessage.error("No worksheet found in the Excel file.");
            onError?.(new Error("No worksheet found"));
            return;
          }

          const importedData: IUserImport[] = [];
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
              const fullName = row.getCell(1).value?.toString().trim() || "";
              const email = row.getCell(2).value?.toString().trim() || "";
              const phone = row.getCell(3).value?.toString().trim() || "";

              if (fullName && email && phone) {
                importedData.push({ fullName, email, phone });
              }
            }
          });

          if (importedData.length === 0) {
            antdMessage.warning("No valid data found in file!");
            onError?.(new Error("No valid data"));
            return;
          }

          setDataPreview(importedData);
          setDataImport(importedData);
          antdMessage.success(`File ${(file as File).name} processed successfully.`);
          onSuccess?.("ok");
        } catch (error) {
          console.error("Excel parse error:", error);
          antdMessage.error("Failed to read Excel file!");
          onError?.(error as Error);
        }
      };
      reader.readAsArrayBuffer(file as File);
    },
  };

  const columns = [
    { dataIndex: "fullName", title: "Full Name" },
    { dataIndex: "email", title: "Email" },
    { dataIndex: "phone", title: "Phone" },
  ];

  return (
    <Modal
      title="Import Users"
      open={openModalImport}
      onCancel={handleCancel}
      okText="Import Data"
      onOk={handleImportData}
      okButtonProps={{
        disabled: dataImport.length === 0,
        loading: isImporting,
      }}
      maskClosable={false}
    >
      {/* 🔹 Button download sample */}
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownloadSample}
          type="default"
        >
          Download Sample File
        </Button>
      </Space>

      <Dragger {...uploads}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag an Excel file (.xlsx or .csv) to this area to upload
        </p>
        <p className="ant-upload-hint">
          File must include columns: FullName – Email – Phone
        </p>
      </Dragger>

      {dataPreview.length > 0 && (
        <Table
          title={() => <span>📋 Preview data:</span>}
          columns={columns}
          dataSource={dataPreview}
          rowKey="email"
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 16 }}
        />
      )}
    </Modal>
  );
};

export default ImportUser;
