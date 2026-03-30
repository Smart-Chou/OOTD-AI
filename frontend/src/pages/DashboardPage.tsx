import React from 'react'
import { Card, Row, Col, Typography, Grid } from '@arco-design/web-react'
import { User, Shirt, Palette } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useWardrobeStore, useOutfitStore } from '../stores'

const { Title, Text } = Typography
const { Row: GridRow, Col: GridCol } = Grid

interface QuickActionProps {
    icon: React.ReactNode
    title: string
    desc: string
    onClick: () => void
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, desc, onClick }) => (
    <Card
        hoverable
        onClick={onClick}
        style={{ cursor: 'pointer', borderRadius: 12 }}
        bodyStyle={{ padding: 20 }}
    >
        <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--primary, #2D503C)' }}>
            {icon}
        </div>
        <Title heading={5} style={{ margin: '8px 0 4px' }}>{title}</Title>
        <Text type="secondary">{desc}</Text>
        <div style={{ marginTop: 12 }}>
            <span style={{ color: 'var(--primary, #2D503C)' }}>前往 →</span>
        </div>
    </Card>
)

const DashboardPage: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { clothing } = useWardrobeStore()
    const { outfits } = useOutfitStore()

    const quickActions = [
        {
            key: 'body-data',
            icon: <User className="w-8 h-8" />,
            title: '完善体型数据',
            desc: '获得更精准的穿搭推荐',
        },
        {
            key: 'wardrobe',
            icon: <Shirt className="w-8 h-8" />,
            title: '添加衣物',
            desc: '丰富您的衣橱',
        },
        {
            key: 'outfits',
            icon: <Palette className="w-8 h-8" />,
            title: '创建搭配',
            desc: '尝试不同穿搭组合',
        },
    ]

    return (
        <div>
            <Title heading={2}>欢迎回来, {user?.username || '用户'}!</Title>
            <Text>这是您的个人穿搭助手主页</Text>

            <GridRow gutter={[16, 16]} style={{ marginTop: 24 }}>
                <GridCol xs={24} sm={8}>
                    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Shirt className="w-6 h-6" style={{ color: 'var(--primary, #2D503C)' }} />
                            <div>
                                <Text type="secondary">衣物数量</Text>
                                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{clothing.length}</div>
                            </div>
                        </div>
                    </Card>
                </GridCol>
                <GridCol xs={24} sm={8}>
                    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Palette className="w-6 h-6" style={{ color: 'var(--primary, #2D503C)' }} />
                            <div>
                                <Text type="secondary">搭配方案</Text>
                                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{outfits.length}</div>
                            </div>
                        </div>
                    </Card>
                </GridCol>
                <GridCol xs={24} sm={8}>
                    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <User className="w-6 h-6" style={{ color: 'var(--primary, #2D503C)' }} />
                            <div>
                                <Text type="secondary">用户角色</Text>
                                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{user?.role || 'user'}</div>
                            </div>
                        </div>
                    </Card>
                </GridCol>
            </GridRow>

            <Title heading={4} style={{ marginTop: 32 }}>
                快速操作
            </Title>
            <GridRow gutter={[16, 16]}>
                {quickActions.map((action, index) => (
                    <GridCol xs={24} sm={8} key={action.key}>
                        <QuickAction
                            icon={action.icon}
                            title={action.title}
                            desc={action.desc}
                            onClick={() => navigate(`/${action.key.replace('-', '-')}`)}
                        />
                    </GridCol>
                ))}
            </GridRow>
        </div>
    )
}

export default DashboardPage