import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";

const { Header } = Layout;

interface NavItem {
  key: string;
  label: string;
  path: string;
}

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: NavItem[] = [
    { key: "1", label: "Home", path: "/" },
    { key: "2", label: "Books", path: "/books" },
    { key: "3", label: "Contact", path: "/contact" },
  ];

  // ✅ Dùng kiểu chuẩn của antd cho sự kiện click
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
      {/* Logo / Tên website */}
      <div
        style={{ fontSize: 20, fontWeight: 600, cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        MyWebsite
      </div>

      {/* Menu chính */}
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
          flex: 1,
          justifyContent: "center",
          borderBottom: "none",
        }}
      />

      {/* User Avatar */}
      <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight" arrow>
        <Space style={{ cursor: "pointer" }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
