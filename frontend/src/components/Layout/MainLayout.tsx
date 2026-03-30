import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, ConfigProvider } from '@arco-design/web-react'
import { User, LayoutDashboard, Shirt, Palette, Heart, LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout
const { Item: MenuItem } = Menu

const MainLayout: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const handleMenuClick = (key: string) => {
        navigate(key)
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
                            onClickMenuItem={handleMenuClick}
                        >
                            <MenuItem key="/dashboard">
                                <LayoutDashboard size={16} /> Dashboard
                            </MenuItem>
                            <MenuItem key="/body-data">
                                <User size={16} /> 体型数据
                            </MenuItem>
                            <MenuItem key="/wardrobe">
                                <Shirt size={16} /> 衣橱管理
                            </MenuItem>
                            <MenuItem key="/outfits">
                                <Palette size={16} /> 搭配方案
                            </MenuItem>
                            <MenuItem key="/recommendations">
                                <Heart size={16} /> 智能推荐
                            </MenuItem>
                        </Menu>
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
                                droplist={
                                    <Menu>
                                        <MenuItem
                                            key="profile"
                                            onClick={() => navigate('/profile')}
                                        >
                                            个人资料
                                        </MenuItem>
                                        <MenuItem
                                            key="logout"
                                            onClick={() => {
                                                logout()
                                                navigate('/login')
                                            }}
                                            style={{ color: '#d63c32' }}
                                        >
                                            <LogOut size={14} /> 退出登录
                                        </MenuItem>
                                    </Menu>
                                }
                                position="bl"
                            >
                                <Button
                                    type="text"
                                    style={{
                                        height: 'auto',
                                        padding: '4px 8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
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
