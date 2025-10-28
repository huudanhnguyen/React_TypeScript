import { getUserAPI } from "@/services/api";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Space, Popconfirm } from "antd";
import { useRef, useState, useEffect } from "react";

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
        }}
      >
        {record._id}
      </a>
    ),
    responsive: ["sm", "md", "lg"],
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
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
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    render: (_, record) => (
      <Space size="middle">
        <EditOutlined
          onClick={() => {
            //   setDataUpdate(record);
            //   setIsModalUpdateOpen(true);
          }}
          style={{ color: "#1677ff", cursor: "pointer" }}
        />
        <Popconfirm
          title="Delete User"
          description="Are you sure you want to delete this user?"
          // onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </Popconfirm>
      </Space>
    ),
  },
];

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  return (
    <>
      <ProTable<IUserTable>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          const res = await getUserAPI(
            params?.current ?? 1,
            params?.pageSize ?? 10
          );

          if (res.data) {
            setMeta(res.data.meta);
          }

          return {
            data: res.data?.result || [],
            success: true,
            total: res.data?.meta.total || 0,
          };
        }}
        editable={{
          type: "multiple",
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} of {total} rows
              </div>
            );
          },
        }}
        headerTitle="Table user"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
            }}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
    </>
  );
};

export default TableUser;
