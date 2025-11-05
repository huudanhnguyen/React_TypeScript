import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  InputNumber,
  Space,
  Typography,
  Popconfirm,
  message,
  Empty,
  Divider,
  Grid,
  Card,
} from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface ICart {
  _id: string;
  quantity: number;
  detail: string;
  price?: number;
  thumbnail?: string;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [cart, setCart] = useState<ICart[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false); // ✅ thêm cờ để tránh mất dữ liệu

  // ✅ Load cart từ localStorage
  const loadCart = () => {
    try {
      const data = localStorage.getItem("cart");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setIsCartLoaded(true); // ✅ chỉ sau khi load xong
    }
  };

  // ✅ Load khi mount + khi có event cartUpdated
  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  // ✅ Chỉ lưu lại khi cart đã load xong
  useEffect(() => {
    if (!isCartLoaded) return; // tránh ghi đè local khi chưa load xong
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, isCartLoaded]);

  // ✅ Xử lý thay đổi số lượng
  const handleQuantityChange = (id: string, value: number | null) => {
    if (!value || value < 1) return;
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: value } : item
    );
    setCart(updated);
  };

  // ✅ Xóa sản phẩm
const handleRemove = (id: string) => {
  const updated = cart.filter((item) => item._id !== id);
  setCart(updated);
  localStorage.setItem("cart", JSON.stringify(updated)); // ✅ cập nhật localStorage ngay lập tức
  message.success("Removed product from cart");
  window.dispatchEvent(new CustomEvent("cartUpdated")); // ✅ giờ header sẽ nhận dữ liệu đúng
};

  // ✅ Tổng tiền
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  // ✅ Thanh toán (demo)
  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning("Cart is empty");
      return;
    }
    message.success("Checkout successful (demo)");
    localStorage.removeItem("cart");
    setCart([]);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  if (cart.length === 0) {
    return (
      <div
        style={{
          padding: screens.xs ? 24 : 60,
          textAlign: "center",
        }}
      >
        <Empty description="Your cart is empty">
          <Button type="primary" onClick={() => navigate("/")}>
            Shop now
          </Button>
        </Empty>
      </div>
    );
  }

  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");

  const columns = [
    {
      title: "Product",
      dataIndex: "detail",
      render: (_: any, record: ICart) => (
        <Space align="start">
          <img
            src={
              record.thumbnail
                ? `${baseUrl}/images/book/${record.thumbnail}`
                : "https://via.placeholder.com/80x100"
            }
            alt={record.detail}
            style={{
              width: 60,
              height: 80,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <Text strong>{record.detail}</Text>
        </Space>
      ),
    },
    {
      title: "Price",
      align: "center" as const,
      render: (_: any, record: ICart) => (
        <Text>{record.price?.toLocaleString("vi-VN")} ₫</Text>
      ),
    },
    {
      title: "Quantity",
      align: "center" as const,
      render: (_: any, record: ICart) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(val) => handleQuantityChange(record._id, val)}
        />
      ),
    },
    {
      title: "Subtotal",
      align: "center" as const,
      render: (_: any, record: ICart) => (
        <Text strong>
          {((record.price ?? 0) * record.quantity).toLocaleString("vi-VN")} ₫
        </Text>
      ),
    },
    {
      title: "Action",
      align: "center" as const,
      render: (_: any, record: ICart) => (
        <Popconfirm
          title="Remove this product?"
          onConfirm={() => handleRemove(record._id)}
        >
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: screens.xs ? 16 : 32,
        borderRadius: 12,
      }}
    >
      <Title
        level={screens.xs ? 4 : 3}
        style={{ textAlign: screens.xs ? "center" : "left" }}
      >
        <ShoppingCartOutlined style={{ marginRight: 8 }} /> Your Shopping Cart
      </Title>

      <Divider />

      {/* ✅ Responsive view */}
      {!screens.xs ? (
        <Table
          dataSource={cart}
          rowKey="_id"
          pagination={false}
          columns={columns}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cart.map((item) => (
            <Card
              key={item._id}
              size="small"
              style={{
                borderRadius: 10,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Space align="start" style={{ width: "100%" }}>
                <img
                  src={
                    item.thumbnail
                      ? `${baseUrl}/images/book/${item.thumbnail}`
                      : "https://via.placeholder.com/80x100"
                  }
                  alt={item.detail}
                  style={{
                    width: 70,
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <Text strong>{item.detail}</Text>
                  <div style={{ marginTop: 6 }}>
                    <Text type="secondary">
                      Price: {item.price?.toLocaleString("vi-VN")} ₫
                    </Text>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <Text>Qty:</Text>{" "}
                    <InputNumber
                      min={1}
                      size="small"
                      value={item.quantity}
                      onChange={(val) =>
                        handleQuantityChange(item._id, val)
                      }
                    />
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <Text strong>
                      Total:{" "}
                      {((item.price ?? 0) * item.quantity).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫
                    </Text>
                  </div>
                </div>
                <Popconfirm
                  title="Remove this product?"
                  onConfirm={() => handleRemove(item._id)}
                >
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>
              </Space>
            </Card>
          ))}
        </div>
      )}

      <Divider />

      {/* ✅ Bottom section */}
      <div
        style={{
          display: "flex",
          flexDirection: screens.xs ? "column" : "row",
          justifyContent: "space-between",
          alignItems: screens.xs ? "stretch" : "center",
          gap: 16,
        }}
      >
        <Button onClick={() => navigate("/")} type="link" block={screens.xs}>
          ← Continue Shopping
        </Button>

        <div style={{ textAlign: screens.xs ? "center" : "right" }}>
          <Text style={{ fontSize: screens.xs ? 14 : 16 }}>Total: </Text>
          <Title
            level={screens.xs ? 5 : 4}
            style={{
              color: "#e74c3c",
              display: "inline",
              marginLeft: 4,
            }}
          >
            {totalPrice.toLocaleString("vi-VN")} ₫
          </Title>
          <div>
            <Button
              type="primary"
              size={screens.xs ? "middle" : "large"}
              style={{
                marginTop: screens.xs ? 12 : 0,
                width: screens.xs ? "100%" : "auto",
              }}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
