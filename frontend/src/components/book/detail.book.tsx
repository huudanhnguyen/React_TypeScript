import {
  Drawer,
  Descriptions,
  Image,
  Divider,
  Tag,
  Upload,
  message,
} from "antd";
import type { DescriptionsProps, UploadFile } from "antd";
import {
  BookOutlined,
  UploadOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IBookTable | null;
  setDataViewDetail: (v: IBookTable | null) => void;
}

const DetailBook = ({
  openViewDetail,
  setOpenViewDetail,
  dataViewDetail,
  setDataViewDetail,
}: IProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (dataViewDetail && dataViewDetail.slider?.length > 0) {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
      const mapped = dataViewDetail.slider.map((file, idx) => ({
        uid: `${idx}`,
        name: file,
        status: "done" as const,
        url: `${baseUrl}/images/book/${file}`,
      }));
      setFileList(mapped);
    } else {
      setFileList([]);
    }
  }, [dataViewDetail]);

  if (!dataViewDetail) return null;

  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
  const imageUrl = dataViewDetail.thumbnail
    ? `${baseUrl}/images/book/${dataViewDetail.thumbnail}`
    : "";

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Book Name",
      children: (
        <span style={{ fontWeight: 600 }}>{dataViewDetail.mainText}</span>
      ),
    },
    {
      key: "2",
      label: "Author",
      children: (
        <>
          <UserOutlined /> {dataViewDetail.author}
        </>
      ),
    },
    {
      key: "3",
      label: "Category",
      children: <Tag color="blue">{dataViewDetail.category}</Tag>,
    },
    {
      key: "4",
      label: "Price",
      children: dataViewDetail.price
        ? new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(dataViewDetail.price)
        : "-",
    },
    {
      key: "5",
      label: "Quantity",
      children: dataViewDetail.quantity,
    },
    {
      key: "6",
      label: "Sold",
      children: dataViewDetail.sold,
    },
    {
      key: "7",
      label: "Created At",
      children: new Date(dataViewDetail.createdAt).toLocaleString(),
    },
  ];

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file: any) => {
      const newFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
      };
      setFileList((prev) => [...prev, newFile]);
      message.success(`${file.name} uploaded successfully (mock)!`);
      return false; // Ngăn upload thật
    },
    fileList,
    listType: "picture-card" as const,
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <BookOutlined /> Book Details
        </div>
      }
      width={700}
      open={openViewDetail}
      onClose={() => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
      }}
      bodyStyle={{
        background: "#fafafa",
        padding: "24px",
      }}
    >
      {/* Info Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <div
          style={{
            width: 220,
            height: 280,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Book Thumbnail"
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <UserOutlined style={{ fontSize: 40 }} />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div style={{ flex: 1 }}>
          <Descriptions
            column={1}
            items={items}
            labelStyle={{ fontWeight: 500, width: 120 }}
            contentStyle={{ fontSize: 15 }}
          />
        </div>
      </div>

      <Divider />

      {/* Description */}
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Description</h3>
        <p style={{ color: "#555", lineHeight: 1.6 }}>
          {dataViewDetail.description || "No description available."}
        </p>
      </div>

      <Divider />

      {/* Upload + Preview Images */}
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Book Gallery</h3>

        <Upload {...uploadProps}>
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>

        {fileList.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <Image.PreviewGroup>
              {fileList.map((file) => (
                <Image
                  key={file.uid}
                  src={file.url}
                  alt={file.name}
                  width={100}
                  height={130}
                  style={{
                    objectFit: "cover",
                    borderRadius: 8,
                    marginRight: 10,
                    marginBottom: 10,
                  }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default DetailBook;
