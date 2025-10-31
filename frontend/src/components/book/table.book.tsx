import { getBookAPI, deleteBookAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Space, Popconfirm, Avatar, App } from "antd";
import { useRef, useState } from "react";
import DetailBook from "./detail.book";
import FormBook from "./form.book";
import UpdateBook from "./update.book";

type TSearch = {
  mainText?: string;
  author?: string;
  createdAt?: string;
  createdAtRange?: string[];
};

const TableBook = () => {
  const actionRef = useRef<ActionType | null>(null);
  const { message } = App.useApp();

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const res = await deleteBookAPI(bookId);
      if (res && res.data) {
        message.success("Deleted book successfully!");
        refreshTable();
      } else {
        message.error("Failed to delete book!");
      }
    } catch (error) {
      message.error("Error deleting book!");
      console.error("Delete book error:", error);
    }
  };

  const columns: ProColumns<IBookTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      align: "center",
      width: 90,
      render: (thumbnail: string) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
        const imageUrl = thumbnail ? `${baseUrl}/images/book/${thumbnail}` : "";

        return (
          <div
            style={{
              width: 55,
              height: 55,
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #e5e5e5",
              margin: "auto",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <Avatar
                size={55}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#f5f5f5" }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "mainText",
      sorter: true,
      copyable: true,
      ellipsis: true,
      render: (_, record) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setDataViewDetail(record);
            setOpenViewDetail(true);
          }}
        >
          {record.mainText}
        </a>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 120,
      render: (price: number) =>
        price
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(price)
          : "-",
    },
    {
      title: "Sold",
      dataIndex: "sold",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      fixed: "right",
      width: 90,
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => {
              setDataUpdate(record);
              setOpenModalUpdate(true);
            }}
            style={{ color: "#1677ff", cursor: "pointer" }}
          />
          <Popconfirm
            title="Delete Book"
            description="Are you sure you want to delete this book?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteBook(record._id)}
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <ProTable<IBookTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        scroll={{ x: "max-content" }}
        request={async (params) => {
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.mainText) query += `&mainText=/${params.mainText}/i`;
            if (params.author) query += `&author=/${params.author}/i`;

            const createdAtRange = dateRangeValidate(params.createdAtRange);
            if (createdAtRange)
              query += `&createdAt>=${createdAtRange[0]}&createdAt<=${createdAtRange[1]}`;
          }

          query += `&sort=-createdAt`;

          const res = await getBookAPI(query);
          if (res?.data?.meta) setMeta(res.data.meta);

          return {
            data: res.data?.result || [],
            success: true,
            total: res.data?.meta?.total || 0,
          };
        }}
        editable={{ type: "multiple" }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} books`,
        }}
        headerTitle="📚 Book Management"
        toolBarRender={() => [
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

      {/* 🔍 View Detail */}
      <DetailBook
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      {/* ➕ Create */}
      <FormBook
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={refreshTable}
      />

      {/* ✏️ Update */}
      <UpdateBook
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={refreshTable}
        dataUpdate={dataUpdate}
      />
    </div>
  );
};

export default TableBook;
