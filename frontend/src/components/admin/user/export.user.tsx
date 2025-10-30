import React, { useState } from "react";
import { Button, App } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ExcelJS from "exceljs";
import { getUserAPI } from "@/services/api";

const ExportUser: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { message } = App.useApp();

  const handleExport = async () => {
    let hideLoading: any;

    try {
      setIsExporting(true);
      hideLoading = message.loading("Exporting users...", 0); // hiển thị vô thời hạn cho đến khi tắt thủ công

      // 🔹 Lấy toàn bộ user
      const res = await getUserAPI("current=1&pageSize=9999&sort=-createdAt");
      const users = res?.data?.result || [];

      if (users.length === 0) {
        message.warning("No users found!");
        return;
      }

      // 🔹 Tạo workbook Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Users");

      worksheet.columns = [
        { header: "Full Name", key: "fullName", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phone", width: 20 },
        { header: "Created At", key: "createdAt", width: 25 },
      ];

      users.forEach((user: any) => {
        worksheet.addRow({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          createdAt: user.createdAt
            ? new Date(user.createdAt).toLocaleString()
            : "",
        });
      });

      // 🔹 Xuất file Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);

      message.success(`Exported ${users.length} users successfully!`);
    } catch (error: any) {
      console.error("Export failed:", error);
      message.error(error?.response?.data?.message || "Export failed!");
    } finally {
      if (hideLoading) hideLoading(); // đóng message loading
      setIsExporting(false);
    }
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      loading={isExporting}
      onClick={handleExport}
    >
      Export Users
    </Button>
  );
};

export default ExportUser;
