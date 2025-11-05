import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookByIdAPI, getBookAPI } from "@/services/api";
import {
  Row,
  Col,
  Image,
  Typography,
  Rate,
  Button,
  Spin,
  Empty,
  Breadcrumb,
  Divider,
  Space,
  InputNumber,
  message,
} from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface IBookDetail {
  _id: string;
  mainText: string;
  author: string;
  price: number;
  thumbnail: string;
  slider?: string[];
  sold?: number;
  quantity?: number;
  category?: string;
  description?: string;
}

interface ICart {
  _id: string;
  quantity: number;
  detail: string;
  price?: number;
  thumbnail?: string;
}

const DetailBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<IBookDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [relatedBooks, setRelatedBooks] = useState<IBookDetail[]>([]);
  const [quantitySelected, setQuantitySelected] = useState<number>(1);

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getBookByIdAPI(id);
        if (res?.data) setBook(res.data);
      } catch (error) {
        console.error("Error fetching book detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!book?.category) return;
      try {
        const res = await getBookAPI();
        if (res?.data) {
          const filtered = res.data.filter(
            (b: IBookDetail) =>
              b.category === book.category && b._id !== book._id
          );
          setRelatedBooks(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching related books:", err);
      }
    };
    fetchRelated();
  }, [book]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );

  if (!book) return <Empty description="Book not found" />;

  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
  const imageUrl = book.thumbnail
    ? `${baseUrl}/images/book/${book.thumbnail}`
    : "https://via.placeholder.com/300x400";

  const handleAddToCart = () => {
    if (!book) return;

    try {
      const data = localStorage.getItem("cart");
      let cart: ICart[] = data ? JSON.parse(data) : [];

      const existingIndex = cart.findIndex((item) => item._id === book._id);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantitySelected;
      } else {
        cart.push({
          _id: book._id,
          quantity: quantitySelected,
          detail: book.mainText,
          price: book.price,
          thumbnail: book.thumbnail || "",
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // 👉 Thông báo cho AppHeader và các trang khác
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      message.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Thêm vào giỏ hàng thất bại!");
    }
  };

  return (
    <div style={{ background: "#fff", padding: "32px", borderRadius: 12 }}>
      <Breadcrumb
        style={{ marginBottom: 24 }}
        items={[
          {
            title: (
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                <HomeOutlined /> Home
              </span>
            ),
          },
          { title: book.mainText },
        ]}
      />

      <Button
        icon={<ArrowLeftOutlined />}
        type="link"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, padding: 0 }}
      >
        Back
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={10} lg={8}>
          <Image src={imageUrl} alt={book.mainText} width="100%" height={400} />
        </Col>

        <Col xs={24} md={14} lg={16}>
          <Title level={3}>{book.mainText}</Title>
          <Text type="secondary">Author: {book.author}</Text>
          <br />
          <Title level={2} style={{ color: "#e74c3c" }}>
            {book.price.toLocaleString("vi-VN")} ₫
          </Title>

          <div style={{ margin: "16px 0" }}>
            <Text strong>Quantity:</Text>
            <InputNumber
              min={1}
              max={book.quantity}
              value={quantitySelected}
              onChange={(v) =>
                setQuantitySelected(v && v > 0 ? v : quantitySelected)
              }
            />
          </div>

          <Space size="middle">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              type="primary"
              danger
              icon={<ThunderboltOutlined />}
              onClick={() => message.info("Buy now (demo)")}
            >
              Buy Now
            </Button>
          </Space>
        </Col>
      </Row>

      <Divider />
      <Title level={4}>Description</Title>
      <Paragraph>{book.description || "No description available."}</Paragraph>
    </div>
  );
};

export default DetailBook;
