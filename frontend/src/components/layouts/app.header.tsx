import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { useCurrentApp } from "../context/app.context";

const { Header } = Layout;

interface NavItem {
  key: string;
  label: string;
  path: string;
}

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const{user}=useCurrentApp();
  const menuItems: NavItem[] = [
    { key: "1", label: "Home", path: "/" },
    { key: "2", label: "Books", path: "/books" },
    { key: "3", label: "Contact", path: "/contact" },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const selected = menuItems.find((item) => item.key === e.key);
    if (selected) navigate(selected.path);
  };

  const dropdownMenu: MenuProps["items"] = [
    {
      key: "1",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: "2",
      icon: <LogoutOutlined />,
      label: "Logout",
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
      {/* 🔹 Gộp logo + menu vào cùng 1 khối để menu nằm cạnh logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Logo */}
        <div
          style={{ fontSize: 20, fontWeight: 600, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          MyWebsite
        </div>
        <div>
          {JSON.stringify(user)}
        </div>

        {/* 🔹 Menu đặt ngay cạnh logo */}
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
          style={{
            borderBottom: "none", // 🔹 bỏ justifyContent: "center"
          }}
        />
      </div>

      {/* Avatar bên phải giữ nguyên */}
      <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight" arrow>
        <Space style={{ cursor: "pointer" }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
