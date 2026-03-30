import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, ConfigProvider, Grid } from '@arco-design/web-react'
import { User, LayoutDashboard, Ruler, Shirt, Palette, Heart, LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout
const { Row, Col } = Grid

const MainLayout: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        { key: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { key: '/body-data', icon: <User size={16} />, label: '体型数据' },
        { key: '/wardrobe', icon: <Shirt size={16} />, label: '衣橱管理' },
        { key: '/outfits', icon: <Palette size={16} />, label: '搭配方案' },
        { key: '/recommendations', icon: <Heart size={16} />, label: '智能推荐' },
    ]

    const userMenuItems = [
        { key: 'profile', label: '个人资料' },
        { key: 'logout', icon: <LogOut size={14} />, label: '退出登录', danger: true },
    ]

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key)
    }

    const handleUserMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            logout()
            navigate('/login')
        }
    }

    return (
        <ConfigProvider>
            <Layout style={{ minHeight: '100vh' }}>
                {isAuthenticated && (
                    <Sider theme="dark" width={220}>
                        <div
                            style={{
                                height: 64,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}
                        >
                            OOTD AI
                        </div>
                        <Menu
                            mode="vertical"
                            selectedKeys={[location.pathname]}
                            data={menuItems}
                            onClickMenuItem={handleMenuClick}
                        />
                    </Sider>
                )}
                <Layout>
                    <Header
                        style={{
                            padding: '0 24px',
                            background: '#fff',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 16,
                        }}
                    >
                        {isAuthenticated ? (
                            <Dropdown
                                droplist={{
                                    children: userMenuItems,
                                    onClick: handleUserMenuClick,
                                }}
                                position="bl"
                            >
                                <Button
                                    type="text"
                                    style={{ height: 'auto', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 8 }}
                                >
                                    <Avatar size={32} style={{ backgroundColor: '#2D503C' }}>
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </Avatar>
                                    <span>{user?.username}</span>
                                </Button>
                            </Dropdown>
                        ) : (
                            <Button type="primary" onClick={() => navigate('/login')}>
                                登录
                            </Button>
                        )}
                    </Header>
                    <Content style={{ padding: 24, minHeight: 280 }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}

export default MainLayout