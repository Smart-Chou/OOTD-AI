import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Typography, Row, Col, Spin, Button, Empty } from '@arco-design/web-react'
import { ArrowLeft, Heart, Eye } from 'lucide-react'
import { outfitApi } from '../services/api'
import type { Outfit } from '../types'

const { Title, Text } = Typography

const PublicOutfitsPage: React.FC = () => {
    const [outfits, setOutfits] = useState<Outfit[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null)

    useEffect(() => {
        loadPublicOutfits()
    }, [])

    const loadPublicOutfits = async () => {
        setLoading(true)
        try {
            const response = await outfitApi.getPublicOutfits()
            setOutfits(response.data)
        } catch (error) {
            console.error('加载公开搭配失败', error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewOutfit = async (outfit: Outfit) => {
        try {
            const response = await outfitApi.getOutfit(outfit.id)
            setSelectedOutfit(response.data)
        } catch (error) {
            console.error('加载搭配详情失败', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div style={{ width: '1440px', margin: '0 auto' }} className="px-12 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        icon={<ArrowLeft size={18} />}
                        onClick={() => window.history.back()}
                        style={{ borderRadius: '999px' }}
                    >
                        返回
                    </Button>
                    <div>
                        <Title heading={3} className="mb-0">
                            公开穿搭
                        </Title>
                        <Text type="secondary">浏览其他用户分享的穿搭灵感</Text>
                    </div>
                </div>

                {outfits.length === 0 ? (
                    <Empty description="暂无公开穿搭，快来分享你的搭配吧！" />
                ) : (
                    <Row gutter={[16, 16]}>
                        {outfits.map(outfit => (
                            <Col xs={24} sm={12} md={8} lg={6} key={outfit.id}>
                                <Card
                                    hoverable
                                    className="h-full cursor-pointer"
                                    onClick={() => handleViewOutfit(outfit)}
                                    cover={
                                        outfit.image_url ? (
                                            <div
                                                style={{
                                                    height: 200,
                                                    backgroundImage: `url(${outfit.image_url})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    height: 200,
                                                    background:
                                                        'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontSize: 48 }}>
                                                    👔
                                                </Text>
                                            </div>
                                        )
                                    }
                                >
                                    <Card.Meta
                                        title={outfit.name}
                                        description={
                                            <div>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {outfit.description || '暂无描述'}
                                                </Text>
                                                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Heart size={14} />
                                                        {outfit.likes_count}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={14} />
                                                        {outfit.items?.length || 0} 件单品
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {/* Outfit Detail Modal */}
                {selectedOutfit && (
                    <div
                        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setSelectedOutfit(null)}
                    >
                        <div
                            className="bg-card rounded-2xl p-8 shadow-hover max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                {selectedOutfit.name}
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                {selectedOutfit.description}
                            </p>

                            <div className="flex gap-4 mb-6">
                                <span className="px-3 py-1 bg-secondary rounded-full text-sm">
                                    {selectedOutfit.occasion}
                                </span>
                                <span className="px-3 py-1 bg-secondary rounded-full text-sm">
                                    {selectedOutfit.season}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {selectedOutfit.items?.map(item => (
                                    <Card key={item.id} size="small">
                                        <Text>{item.name}</Text>
                                        <Text type="secondary" block className="text-xs">
                                            {item.category}
                                        </Text>
                                    </Card>
                                ))}
                            </div>

                            <Button
                                type="primary"
                                long
                                className="mt-6"
                                style={{ borderRadius: '999px' }}
                                onClick={() => setSelectedOutfit(null)}
                            >
                                关闭
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PublicOutfitsPage
