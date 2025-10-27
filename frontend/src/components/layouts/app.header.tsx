import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { useCurrentApp } from "../context/app.context";

const { Header } = Layout;
const { Text } = Typography;

interface NavItem {
  key: string;
  label: string;
  path: string;
}

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useCurrentApp();

  // 🔹 Các mục điều hướng
  const menuItems: NavItem[] = [
    { key: "1", label: "Home", path: "/" },
    { key: "2", label: "Books", path: "/books" },
    { key: "3", label: "Contact", path: "/contact" },
  ];

  // 🔹 Khi click menu chính (Home / Books / Contact)
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const selected = menuItems.find((item) => item.key === e.key);
    if (selected) navigate(selected.path);
  };

  // 🔹 Khi click "Đăng xuất"
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  // 🔹 Menu trong dropdown (tuỳ theo có user hay không)
  const dropdownMenu: MenuProps["items"] = user
    ? [
        {
          key: "user-info",
          label: (
            <div style={{ padding: "8px 12px" }}>
              <Text strong>{user.fullName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user.email}
              </Text>
            </div>
          ),
          disabled: true,
        },
        { type: "divider" as const },
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: "Settings",
          onClick: () => navigate("/settings"),
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: handleLogout,
        },
      ]
    : [
        {
          key: "login",
          icon: <UserOutlined />,
          label: "Login",
          onClick: () => navigate("/login"),
        },
      ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px #f0f1f2",
        padding: "0 24px",
      }}
    >
      {/* 🔹 Logo + menu */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Logo */}
        <div
          style={{ fontSize: 20, fontWeight: 600, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          MyWebsite
        </div>

        {/* Menu điều hướng */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={
            menuItems.map((item) => ({
              key: item.key,
              label: item.label,
            })) as MenuProps["items"]
          }
          onClick={handleMenuClick}
          style={{ borderBottom: "none" }}
        />
      </div>

      {/* 🔹 Avatar + Dropdown */}
      <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight" arrow>
        <Space style={{ cursor: "pointer" }}>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={user?.avatar || undefined}
          />
          {user && (
            <Text
              style={{
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.fullName}
            </Text>
          )}
        </Space>
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
