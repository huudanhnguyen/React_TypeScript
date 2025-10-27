import { useState } from "react";
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
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useCurrentApp } from "components/context/app.context";
import "./app.header.scss";

const AppHeader = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { isAuthenticated, user, logout } = useCurrentApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  // menu items...
  let items: any[] = [];

  if (isAuthenticated) {
    items = [
      {
        label: (
          <label style={{ cursor: "pointer" }} onClick={() => navigate("/user")}>
            Account management
          </label>
        ),
        key: "account",
      },
      {
        label: <Link to="/history">Order history</Link>,
        key: "history",
      },
      {
        label: (
          <label style={{ cursor: "pointer" }} onClick={handleLogout}>
            Logout
          </label>
        ),
        key: "logout",
      },
    ];

    if (user?.role === "ADMIN") {
      items.unshift({
        label: <Link to="/admin">Admin dashboard</Link>,
        key: "admin",
      });
    }
  } else {
    items = [
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
          <label style={{ cursor: "pointer" }} onClick={() => navigate("/register")}>
            Register
          </label>
        ),
        key: "register",
      },
    ];
  }

  const urlAvatar = user?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`
    : undefined;

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__left">
            <div className="page-header__toggle" onClick={() => setOpenDrawer(true)}>
              ☰
            </div>

            <div className="brand" onClick={() => navigate("/")}>
              <FaReact className="brand__icon" />
              <span className="brand__text">Danh</span>
            </div>

            {/* NEW: search wrapper */}
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

          <div className="page-header__right">
            <div className="nav-item">
              <Popover
                className="popover-carts"
                placement="topRight"
                title={"Recently added"}
                arrow={true}
                content={<div>No items</div>}
              >
                <Badge count={2} size="small" showZero>
                  <FiShoppingCart className="icon-cart" />
                </Badge>
              </Popover>
            </div>

            <div className="nav-item">
              <Divider type="vertical" />
            </div>

            <div className="nav-item">
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Space style={{ cursor: "pointer" }}>
                  {isAuthenticated && urlAvatar ? (
                    <Avatar src={urlAvatar} />
                  ) : isAuthenticated ? (
                    <Avatar style={{ backgroundColor: "#1677ff" }}>
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                  ) : null}

                  <span className="account-label">
                    {isAuthenticated ? user?.fullName : "Account"}
                  </span>
                </Space>
              </Dropdown>
            </div>
          </div>
        </header>
      </div>

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
            <p onClick={handleLogout}>Logout</p>
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
