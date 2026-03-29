import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { UserOutlined, AppstoreOutlined, ShopOutlined, ScissorOutlined, HeartOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { key: '/body-data', icon: <UserOutlined />, label: '体型数据' },
    { key: '/wardrobe', icon: <ShopOutlined />, label: '衣橱管理' },
    { key: '/outfits', icon: <ScissorOutlined />, label: '搭配方案' },
    { key: '/recommendations', icon: <HeartOutlined />, label: '智能推荐' },
  ];

  const userMenuItems = [
    { key: 'profile', label: '个人资料' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isAuthenticated && (
        <Sider theme="dark" width={220}>
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
            OOTD AI
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
      )}
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
              <Button type="text" style={{ height: 'auto', padding: '4px 8px' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatar_url} />
                <span style={{ marginLeft: 8 }}>{user?.username}</span>
              </Button>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>登录</Button>
          )}
        </Header>
        <Content style={{ padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
