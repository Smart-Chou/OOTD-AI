import React from 'react'
import { Card, Row, Col, Statistic, Typography, Button } from 'antd'
import { UserOutlined, ShopOutlined, ScissorOutlined, RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useWardrobeStore, useOutfitStore } from '../stores'

const { Title, Paragraph } = Typography

const DashboardPage: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { clothing } = useWardrobeStore()
    const { outfits } = useOutfitStore()

    const quickActions = [
        {
            key: 'body-data',
            icon: <UserOutlined />,
            title: '完善体型数据',
            desc: '获得更精准的穿搭推荐',
            path: '/body-data',
        },
        {
            key: 'wardrobe',
            icon: <ShopOutlined />,
            title: '添加衣物',
            desc: '丰富您的衣橱',
            path: '/wardrobe',
        },
        {
            key: 'outfits',
            icon: <ScissorOutlined />,
            title: '创建搭配',
            desc: '尝试不同穿搭组合',
            path: '/outfits',
        },
    ]

    return (
        <div>
            <Title level={2}>欢迎回来, {user?.username || '用户'}!</Title>
            <Paragraph>这是您的个人穿搭助手主页</Paragraph>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="衣物数量"
                            value={clothing.length}
                            prefix={<ShopOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="搭配方案"
                            value={outfits.length}
                            prefix={<ScissorOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="用户角色"
                            value={user?.role || 'user'}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Title level={4} style={{ marginTop: 32 }}>
                快速操作
            </Title>
            <Row gutter={[16, 16]}>
                {quickActions.map(action => (
                    <Col xs={24} sm={8} key={action.key}>
                        <Card hoverable onClick={() => navigate(action.path)}>
                            <div style={{ fontSize: 32, marginBottom: 12, color: '#1890ff' }}>
                                {action.icon}
                            </div>
                            <Title level={5}>{action.title}</Title>
                            <Paragraph type="secondary">{action.desc}</Paragraph>
                            <Button type="link" icon={<RightOutlined />}>
                                前往
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default DashboardPage
