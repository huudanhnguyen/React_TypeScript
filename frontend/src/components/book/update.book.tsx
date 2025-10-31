import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import {
  getBookCategoryAPI,
  uploadFileAPI,
  updateBookAPI,
} from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IBookTable | null;
}

const UpdateBook = (props: IProps) => {
  const { openModalUpdate, setOpenModalUpdate, refreshTable, dataUpdate } = props;

  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);

  const [thumbnail, setThumbnail] = useState<UploadFile[]>([]);
  const [slider, setSlider] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  // 📦 Lấy danh mục
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getBookCategoryAPI();
        if (res && res.data) {
          const d = res.data.map((item: string) => ({
            label: item,
            value: item,
          }));
          setListCategory(d);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  // 🔄 Load data vào form khi mở modal
  useEffect(() => {
    if (dataUpdate && openModalUpdate) {
      form.setFieldsValue({
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        quantity: dataUpdate.quantity,
        category: dataUpdate.category,
      });

      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
      if (dataUpdate.thumbnail) {
        setThumbnail([
          {
            uid: "-1",
            name: dataUpdate.thumbnail,
            status: "done",
            url: `${baseUrl}/images/book/${dataUpdate.thumbnail}`,
          },
        ]);
      } else setThumbnail([]);

      if (dataUpdate.slider && Array.isArray(dataUpdate.slider)) {
        setSlider(
          dataUpdate.slider.map((img, index) => ({
            uid: String(index),
            name: img,
            status: "done",
            url: `${baseUrl}/images/book/${img}`,
          }))
        );
      } else setSlider([]);
    }
  }, [dataUpdate, openModalUpdate, form]);

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 📤 Upload ảnh lên server
  const uploadImage = async (file: File) => {
    const res = await uploadFileAPI(file, "book");
    return res.data?.fileUploaded;
  };

  const onFinish = async (values: any) => {
    if (!dataUpdate?._id) return;
    setLoading(true);
    try {
      let thumbnailName = dataUpdate.thumbnail;
      let sliderNames: string[] = Array.isArray(dataUpdate.slider)
        ? [...dataUpdate.slider]
        : [];

      // Thumbnail mới
      if (thumbnail.length && thumbnail[0].originFileObj) {
        thumbnailName = await uploadImage(thumbnail[0].originFileObj as File);
      }

      // Slider mới
      const newSliderFiles = slider.filter((f) => f.originFileObj);
      const uploadedSliders = await Promise.all(
        newSliderFiles.map(async (f) => {
          const name = await uploadImage(f.originFileObj as File);
          return name;
        })
      );

      // Merge slider cũ + mới
      const finalSlider = [
        ...sliderNames.filter(
          (name) => !newSliderFiles.some((f) => f.name === name)
        ),
        ...uploadedSliders,
      ];

      // ✅ Gọi API đúng cách (theo định nghĩa cũ)
      const res = await updateBookAPI(
        dataUpdate._id,
        values.mainText,
        values.author,
        values.price,
        values.quantity,
        values.category,
        thumbnailName,
        finalSlider
      );

      if (res && res.data) {
        message.success("Cập nhật sách thành công!");
        refreshTable();
        handleCancel();
      } else {
        message.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      message.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpenModalUpdate(false);
    form.resetFields();
    setThumbnail([]);
    setSlider([]);
  };

  return (
    <Modal
      title="Update Book"
      open={openModalUpdate}
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
            placeholder="Enter price"
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
          <InputNumber min={1} style={{ width: "100%" }} />
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

        <Form.Item label="Thumbnail">
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
            onChange={({ fileList }) => setThumbnail(fileList)}
            onPreview={async (file) => {
              const src =
                file.url || (await getBase64(file.originFileObj as File));
              const img = new Image();
              img.src = src;
              const w = window.open(src);
              w?.document.write(img.outerHTML);
            }}
            fileList={thumbnail}
          >
            {thumbnail.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Slider">
          <Upload
            listType="picture-card"
            multiple
            beforeUpload={() => false}
            onChange={({ fileList }) => setSlider(fileList)}
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
          <Button type="primary" htmlType="submit" loading={loading} block>
            Update Book
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateBook;
