import { getUserAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Space, Popconfirm, App } from "antd";
import { useRef, useState } from "react";
import DetailUser from "./detail.user";
import FormUser from "./form.user";
import ImportUser from "./import.user";
import ExcelJS from "exceljs";

type TSearch = {
  fullName?: string;
  email?: string;
  createdAt?: string;
  createdAtRange?: string[];
};

const TableUser = () => {
  const actionRef = useRef<ActionType | null>(null);
  const paramsRef = useRef<any>(null); // 🔹 Lưu params và sort hiện tại
  const sortRef = useRef<any>(null);

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { message } = App.useApp();

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  // 🔹 Hàm dựng query string (dùng lại cho export)
  const buildQuery = (params: any, sort: any) => {
    let query = "";
    if (params) {
      query += `current=1&pageSize=9999`; // lấy tất cả bản ghi đang lọc
      if (params.email) query += `&email=/${params.email}/i`;
      if (params.fullName) query += `&fullName=/${params.fullName}/i`;

      const createdAtRange = dateRangeValidate(params.createdAtRange);
      if (createdAtRange) {
        query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`;
      }
    }

    // sort mặc định
    query += `&sort=-createdAt`;

    if (sort?.createdAt) {
      query += `&sort=${
        sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
      }`;
    }

    if (sort?.fullName) {
      query += `&sort=${
        sort.fullName === "ascend" ? "fullName" : "-fullName"
      }`;
    }

    return query;
  };

  // 🔹 Hàm Export (dùng cùng bộ lọc)
  const handleExport = async () => {
    try {
      setIsExporting(true);
      message.loading("Exporting users...");

      const query = buildQuery(paramsRef.current, sortRef.current);
      const res = await getUserAPI(query);
      const users = res?.data?.result || [];

      if (users.length === 0) {
        message.warning("No users found for current filter!");
        return;
      }

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
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          createdAt: new Date(user.createdAt).toLocaleString(),
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      message.success("Export successful!");
    } catch (err: any) {
      console.error(err);
      message.error("Export failed!");
    } finally {
      setIsExporting(false);
    }
  };

  const columns: ProColumns<IUserTable>[] = [
    { dataIndex: "index", valueType: "indexBorder", width: 48 },
    {
      title: "Full Name",
      dataIndex: "fullName",
      sorter: true,
      copyable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
    },
  ];

  return (
    <>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          // 🔹 Lưu lại params + sort để export dùng lại
          paramsRef.current = params;
          sortRef.current = sort;

          const query = buildQuery(params, sort);
          const res = await getUserAPI(query);

          if (res.data) setMeta(res.data.meta);

          return {
            data: res.data?.result || [],
            success: true,
            total: res.data?.meta.total || 0,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} rows`,
        }}
        headerTitle="Table User"
        toolBarRender={() => [
          <Button
            key="export"
            icon={<ExportOutlined />}
            type="primary"
            loading={isExporting}
            onClick={handleExport}
          >
            Export
          </Button>,
          <Button
            key="import"
            icon={<ImportOutlined />}
            onClick={() => setOpenModalImport(true)}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="create"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalCreate(true)}
            type="primary"
          >
            Add New
          </Button>,
        ]}
      />

      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <FormUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />
      <ImportUser
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        refreshTable={refreshTable}
      />
    </>
  );
};

export default TableUser;
