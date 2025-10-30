import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Modal, Table, App } from "antd";
import type { UploadProps } from "antd";
import ExcelJS from "exceljs";
import { createUserAPI, getUserAPI } from "@/services/api"; // ✅ dùng luôn getUserAPI để kiểm tra trùng

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

const ImportUser = ({ openModalImport, setOpenModalImport, refreshTable }: IProps) => {
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

  // ✅ Import data using your existing API
  const handleImportData = async () => {
    if (dataImport.length === 0) {
      antdMessage.warning("No data to import!");
      return;
    }

    try {
      setIsImporting(true);
      antdMessage.loading("Checking duplicate users...");

      // 1️⃣ Get all existing users (only email)
      const res = await getUserAPI("current=1&pageSize=9999"); // lấy tất cả user
      const existingEmails = res?.data?.result?.map((u: any) => u.email.toLowerCase()) || [];

      // 2️⃣ Filter out duplicates
      const newUsers = dataImport.filter(
        (user) => !existingEmails.includes(user.email.toLowerCase())
      );

      const duplicateCount = dataImport.length - newUsers.length;

      if (newUsers.length === 0) {
        antdMessage.warning("All users already exist!");
        handleCancel();
        setFileList([]);
        return;
      }

      // 3️⃣ Import only new users
      antdMessage.loading("Importing users...");
      for (const user of newUsers) {
        const { fullName, email, phone } = user;
        await createUserAPI(fullName, email, "123456", phone);
      }

      // 4️⃣ Show summary
      antdMessage.success(
        `${newUsers.length} users imported successfully. ${duplicateCount} duplicates skipped.`
      );

      refreshTable();
      handleCancel();
      setFileList([]);
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
