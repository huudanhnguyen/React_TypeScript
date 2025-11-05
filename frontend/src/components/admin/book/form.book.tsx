import {
  App,
  Button,
  Input,
  Modal,
  Form,
  InputNumber,
  Select,
  Upload,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { createBookAPI, getBookCategoryAPI, uploadFileAPI } from "@/services/api";
import type { FormProps } from "antd";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  mainText: string;
  author: string;
  price: string;
  category: string;
  quantity: string;
};

const FormBook = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);

  const [thumbnail, setThumbnail] = useState<UploadFile | null>(null);
  const [slider, setSlider] = useState<UploadFile[]>([]);

  // 🧩 Fetch Category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getBookCategoryAPI();
        if (res && res.data) {
          const formatted = res.data.map((item: string) => ({
            label: item,
            value: item,
          }));
          setListCategory(formatted);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategory();
  }, []);

  // 🧩 Xử lý xem trước ảnh
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 🧩 Upload ảnh và tạo sách
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setIsSubmit(true);
      console.log("📦 Form values:", values);

      // --- Upload Thumbnail ---
      if (!thumbnail?.originFileObj) {
        message.error("Vui lòng upload thumbnail!");
        setIsSubmit(false);
        return;
      }

      const resThumb = await uploadFileAPI(thumbnail.originFileObj, "book");
      const thumbnailUrl = resThumb?.data?.fileUploaded;
      console.log("✅ Thumbnail uploaded:", thumbnailUrl);

      // --- Upload Slider ---
      const sliderUrls: string[] = [];
      for (const file of slider) {
        if (file.originFileObj) {
          const res = await uploadFileAPI(file.originFileObj, "book");
          if (res?.data?.fileUploaded) {
            sliderUrls.push(res.data.fileUploaded);
            console.log("✅ Uploaded slider file:", res.data.fileUploaded);
          }
        }
      }

      // --- Gọi API tạo sách ---
      const resCreate = await createBookAPI(
        values.mainText,
        values.author,
        Number(values.price),
        Number(values.quantity),
        values.category,
        thumbnailUrl,
        sliderUrls
      );

      if (resCreate && resCreate.data) {
        notification.success({
          message: "Thành công",
          description: "Tạo sách mới thành công!",
        });
        handleCancel();
        refreshTable();
      } else {
        notification.error({
          message: "Thất bại",
          description: "Không thể tạo sách!",
        });
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo sách:", error);
      notification.error({
        message: "API Error",
        description: error.message || "Internal Server Error",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  // 🧩 Xử lý xóa modal
  const handleCancel = () => {
    setOpenModalCreate(false);
    form.resetFields();
    setThumbnail(null);
    setSlider([]);
  };

  return (
    <Modal
      title="Create New Book"
      open={openModalCreate}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Book Title"
          name="mainText"
          rules={[{ required: true, message: "Please enter book title" }]}
        >
          <Input placeholder="Enter book title" />
        </Form.Item>

        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: "Please enter author name" }]}
        >
          <Input placeholder="Enter author name" />
        </Form.Item>

        <Form.Item
          label="Price (VNĐ)"
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập giá sách"
            formatter={(value) =>
              value
                ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"
                : ""
            }
            parser={(value) =>
              value?.replace(/\s?đ/g, "").replace(/\./g, "") || ""
            }
          />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Enter quantity"
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select placeholder="Select category">
            {listCategory.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Upload Thumbnail */}
        <Form.Item label="Thumbnail">
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
            onChange={({ fileList }) => setThumbnail(fileList[0] || null)}
            onRemove={() => setThumbnail(null)}
            onPreview={async (file) => {
              const src =
                file.url || (await getBase64(file.originFileObj as File));
              const img = new Image();
              img.src = src;
              const w = window.open(src);
              w?.document.write(img.outerHTML);
            }}
            fileList={thumbnail ? [thumbnail] : []}
          >
            {!thumbnail && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Upload Slider */}
        <Form.Item label="Slider">
          <Upload
            listType="picture-card"
            multiple
            beforeUpload={() => false}
            onChange={({ fileList }) => setSlider(fileList)}
            onRemove={(file) =>
              setSlider((prev) => prev.filter((f) => f.uid !== file.uid))
            }
            onPreview={async (file) => {
              const src =
                file.url || (await getBase64(file.originFileObj as File));
              const img = new Image();
              img.src = src;
              const w = window.open(src);
              w?.document.write(img.outerHTML);
            }}
            fileList={slider}
          >
            {slider.length < 5 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmit} block>
            Create Book
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormBook;
