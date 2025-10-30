import { getUserAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Space, Popconfirm } from "antd";
import { useRef, useState } from "react";
import DetailUser from "./detail.user";
import FormUser from "./form.user";
import ImportUser from "./import.user";
import ExportUser from "./export.user";
import UpdateUser from "./update.user";

type TSearch = {
  fullName?: string;
  email?: string;
  createdAt?: string;
  createdAtRange?: string[];
};

interface IUserTable {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

const TableUser = () => {
  const actionRef = useRef<ActionType | null>(null);
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
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "_id",
      hideInSearch: true,
      width: 180,
      render: (_, record) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setDataViewDetail(record);
            setOpenViewDetail(true);
          }}
        >
          {record._id}
        </a>
      ),
    },
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
    {
      title: "Action",
      key: "action",
      hideInSearch: true,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => {
              setDataUpdate(record); // ✅ Truyền data vào
              setOpenModalUpdate(true);
            }}
            style={{ color: "#1677ff", cursor: "pointer" }}
          />
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user?"
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort) => {
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) query += `&email=/${params.email}/i`;
            if (params.fullName) query += `&fullName=/${params.fullName}/i`;

            const createdAtRange = dateRangeValidate(params.createdAtRange);
            if (createdAtRange)
              query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`;
          }

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

          const res = await getUserAPI(query);
          if (res.data) setMeta(res.data.meta);

          return {
            data: res.data?.result || [],
            success: true,
            total: res.data?.meta.total || 0,
          };
        }}
        editable={{ type: "multiple" }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} rows`,
        }}
        headerTitle="User Management"
        toolBarRender={() => [
          <ExportUser key="export" />,
          <Button
            key="import"
            icon={<ImportOutlined />}
            onClick={() => setOpenModalImport(true)}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="add"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalCreate(true)}
            type="primary"
          >
            Add new
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

      <UpdateUser
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableUser;
