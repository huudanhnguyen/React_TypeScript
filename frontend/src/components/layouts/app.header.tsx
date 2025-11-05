import { useState, useEffect } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import {
  Divider,
  Badge,
  Drawer,
  Avatar,
  Popover,
  Dropdown,
  Space,
  Button,
  List,
  Typography,
  Empty,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useCurrentApp } from "components/context/app.context";
import "./app.header.scss";

const { Text } = Typography;

interface ICart {
  _id: string;
  quantity: number;
  detail: string;
  price?: number;
  thumbnail?: string;
}

const AppHeader = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [cart, setCart] = useState<ICart[]>([]);
  const { isAuthenticated, user, logout } = useCurrentApp();
  const navigate = useNavigate();

  // ✅ Load cart từ localStorage và lắng nghe thay đổi
  useEffect(() => {
    const loadCart = () => {
      try {
        const data = localStorage.getItem("cart");
        setCart(data ? JSON.parse(data) : []);
      } catch {
        setCart([]);
      }
    };

    loadCart();

    // Lắng nghe thay đổi từ các tab hoặc event tùy chỉnh
    window.addEventListener("storage", loadCart);
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  // ✅ Tổng số lượng và tổng tiền
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  // ✅ Popover hiển thị preview giỏ hàng
  const cartContent =
    cart.length === 0 ? (
      <Empty description="Giỏ hàng trống" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    ) : (
      <div style={{ width: 280 }}>
        <List
          size="small"
          dataSource={cart.slice(0, 3)}
          renderItem={(item) => (
            <List.Item
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
              onClick={() => navigate("/cart")}
            >
              <img
                src={
                  item.thumbnail
                    ? `${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`
                    : "https://via.placeholder.com/50x70"
                }
                alt={item.detail}
                style={{
                  width: 40,
                  height: 55,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: "block" }}>
                  {item.detail}
                </Text>
                <Text type="secondary">
                  SL: {item.quantity} ×{" "}
                  {item.price?.toLocaleString("vi-VN") || 0}₫
                </Text>
              </div>
            </List.Item>
          )}
        />
        <Divider style={{ margin: "10px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          <span>Tổng cộng:</span>
          <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
        </div>
        <Button
          type="primary"
          block
          onClick={() => navigate("/cart")}
          style={{ borderRadius: 6 }}
        >
          Xem giỏ hàng →
        </Button>
      </div>
    );

  // ✅ Menu tài khoản
  const items = isAuthenticated
    ? [
        ...(user?.role === "ADMIN"
          ? [{ label: <Link to="/admin">Admin dashboard</Link>, key: "admin" }]
          : []),
        {
          label: (
            <label style={{ cursor: "pointer" }} onClick={() => navigate("/user")}>
              Account management
            </label>
          ),
          key: "account",
        },
        { label: <Link to="/history">Order history</Link>, key: "history" },
        {
          label: (
            <label style={{ cursor: "pointer" }} onClick={logout}>
              Logout
            </label>
          ),
          key: "logout",
        },
      ]
    : [
        {
          label: (
            <label style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
              Login
            </label>
          ),
          key: "login",
        },
        {
          label: (
            <label
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register
            </label>
          ),
          key: "register",
        },
      ];

  const urlAvatar = user?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user.avatar}`
    : undefined;

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          {/* ✅ Left section */}
          <div className="page-header__left">
            <div
              className="page-header__toggle"
              onClick={() => setOpenDrawer(true)}
            >
              ☰
            </div>

            <div className="brand" onClick={() => navigate("/")}>
              <FaReact className="brand__icon" />
              <span className="brand__text">Danh</span>
            </div>

            <div className="search-wrapper">
              <input
                className="search-input"
                type="text"
                placeholder="What are you looking for today?"
                aria-label="search"
              />
              <VscSearchFuzzy className="search-icon" />
            </div>
          </div>

          {/* ✅ Right section */}
          <div className="page-header__right">
            {/* Giỏ hàng (Popover click) */}
            <Popover
              placement="bottomRight"
              trigger="click"
              title="Sản phẩm trong giỏ hàng"
              content={cartContent}
            >
              <div className="nav-item" style={{ cursor: "pointer" }}>
                <Badge count={totalCount} size="small" showZero>
                  <FiShoppingCart className="icon-cart" />
                </Badge>
              </div>
            </Popover>

            <Divider type="vertical" />

            {/* Tài khoản */}
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                {isAuthenticated && urlAvatar ? (
                  <Avatar src={urlAvatar} />
                ) : isAuthenticated ? (
                  <Avatar style={{ backgroundColor: "#1677ff" }}>
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                ) : (
                  <Avatar style={{ backgroundColor: "#aaa" }}>?</Avatar>
                )}
                <span className="account-label">
                  {isAuthenticated ? user?.fullName : "Account"}
                </span>
              </Space>
            </Dropdown>
          </div>
        </header>
      </div>

      {/* ✅ Drawer mobile */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        {isAuthenticated ? (
          <>
            <p onClick={() => navigate("/user")}>Account management</p>
            <Divider />
            <p onClick={logout}>Logout</p>
            <Divider />
          </>
        ) : (
          <>
            <p onClick={() => navigate("/login")}>Login</p>
            <Divider />
            <p onClick={() => navigate("/register")}>Register</p>
            <Divider />
          </>
        )}
      </Drawer>
    </>
  );
};

export default AppHeader;
