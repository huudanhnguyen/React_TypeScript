import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar,Result,Button } from 'antd';
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router'
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

const { Content, Footer, Sider } = Layout;



const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const { user,logout,isAuthenticated } = useCurrentApp();
    const location = useLocation()

  const handleLogout = async () => {
    await logout();
  };

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <span>Manage Users</span>,
            key: 'user',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to='/admin/user'>CRUD</Link>,
                    key: 'crud',
                    icon: <TeamOutlined />,
                },
            ]
        },
        {
            label: <Link to='/admin/book'>Manage Books</Link>,
            key: 'book',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: 'order',
            icon: <DollarCircleOutlined />
        },

    ];

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => alert("me")}
            >Account management</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Home</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Logout</label>,
            key: 'logout',
        },

    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;
    if(isAuthenticated===false){
        return(
            <Outlet/>
        )
    }
    const isAdminRoute=location.pathname.includes("admin");
    if(isAuthenticated===true && isAdminRoute ===true){
        const role=user?.role;
        if(role==="USER"){
            return(
                      <Result
        status="403"
        title="403 - Forbidden"
        subTitle="You are not authorized to access this page."
        extra={
          <Button type="primary">
            <Link to="/">Back to Home</Link>
          </Button>
        }
      />
            )
        }
    }
    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        defaultSelectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header' style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",

                    }}>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar src={urlAvatar} />
                                {user?.fullName}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 0, textAlign: "center" }}>
                        React - TypeScript &copy; Nguyễn Hữu Danh - Made with <HeartTwoTone />
                    </Footer>
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;