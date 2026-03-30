import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Switch, Typography, Grid, Message } from '@arco-design/web-react'
import { Plus, Edit, Trash2, Eye, Share2, Link as LinkIcon } from 'lucide-react'
import { outfitApi, wardrobeApi } from '../services/api'
import { useOutfitStore } from '../stores'
import { useMessage } from '../hooks/useMessage'
import type { Outfit, ClothingItem } from '../types'

const { Title, Text } = Typography
const { Row, Col } = Grid

const occasions = [
    { value: 'casual', label: '休闲' },
    { value: 'formal', label: '正式' },
    { value: 'work', label: '工作' },
    { value: 'date', label: '约会' },
    { value: 'sport', label: '运动' },
]

const seasons = [
    { value: 'spring', label: '春季' },
    { value: 'summer', label: '夏季' },
    { value: 'fall', label: '秋季' },
    { value: 'winter', label: '冬季' },
]

const OutfitsPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [viewModalVisible, setViewModalVisible] = useState(false)
    const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null)
    const [viewingOutfit, setViewingOutfit] = useState<Outfit | null>(null)
    const [allClothing, setAllClothing] = useState<ClothingItem[]>([])
    const [form] = Form.useForm()
    const { outfits, setOutfits, addOutfit, updateOutfit, removeOutfit } = useOutfitStore()
    const message = useMessage()

    useEffect(() => {
        loadOutfits()
        loadClothing()
    }, [])

    const loadOutfits = async () => {
        setLoading(true)
        try {
            const response = await outfitApi.getOutfits()
            setOutfits(response.data)
        } catch (error) {
            message.error('加载搭配失败')
        } finally {
            setLoading(false)
        }
    }

    const loadClothing = async () => {
        try {
            const response = await wardrobeApi.getClothingList()
            setAllClothing(response.data)
        } catch (error) {
            console.error('加载衣物失败')
        }
    }

    const handleSubmit = async (values: any) => {
        setLoading(true)
        try {
            if (editingOutfit) {
                const response = await outfitApi.updateOutfit(editingOutfit.id, values)
                updateOutfit(editingOutfit.id, response.data)
                message.success('搭配更新成功')
            } else {
                const response = await outfitApi.createOutfit(values)
                addOutfit(response.data)
                message.success('搭配创建成功')
            }
            setModalVisible(false)
            form.resetFields()
            setEditingOutfit(null)
        } catch (error: any) {
            message.error(error.response?.data?.detail || '操作失败')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await outfitApi.deleteOutfit(id)
            removeOutfit(id)
            message.success('搭配删除成功')
        } catch (error) {
            message.error('删除失败')
        }
    }

    const handleView = async (outfit: Outfit) => {
        try {
            const response = await outfitApi.getOutfit(outfit.id)
            setViewingOutfit(response.data)
            setViewModalVisible(true)
        } catch (error) {
            message.error('加载失败')
        }
    }

    const handleEdit = (record: Outfit) => {
        setEditingOutfit(record)
        form.setFieldsValue({
            ...record,
            item_ids: record.items.map(i => i.id),
        })
        setModalVisible(true)
    }

    const handleCreate = () => {
        setEditingOutfit(null)
        form.resetFields()
        setModalVisible(true)
    }

    const handleShare = async (outfit: Outfit) => {
        // 公开搭配才能分享
        if (!outfit.is_public) {
            Message.warning('请先将搭配设置为公开才能分享')
            return
        }

        const shareUrl = `${window.location.origin}/outfits/public/${outfit.id}`
        const shareText = `看看我的穿搭: ${outfit.name} - ${outfit.description || ''}`

        // 使用 Web Share API (移动端)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: outfit.name,
                    text: shareText,
                    url: shareUrl,
                })
            } catch (err) {
                // 用户取消分享
            }
        } else {
            // 桌面端：复制链接
            try {
                await navigator.clipboard.writeText(shareUrl)
                Message.success('分享链接已复制到剪贴板')
            } catch {
                // fallback
                const textArea = document.createElement('textarea')
                textArea.value = shareUrl
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
                Message.success('分享链接已复制到剪贴板')
            }
        }
    }

    const handleMakePublic = async (outfit: Outfit) => {
        try {
            await outfitApi.updateOutfit(outfit.id, { is_public: 1 } as any)
            outfit.is_public = 1
            setOutfits([...useOutfitStore.getState().outfits])
            Message.success('搭配已公开')
        } catch {
            Message.error('设置失败')
        }
    }

    const columns = [
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: '场合',
            dataIndex: 'occasion',
            key: 'occasion',
            render: (occasion: string) => {
                const occ = occasions.find(o => o.value === occasion)
                return occ?.label || occasion
            },
        },
        {
            title: '公开',
            dataIndex: 'is_public',
            key: 'is_public',
            render: (isPublic: number) => (isPublic ? '公开' : '私有'),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: Outfit) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    {!record.is_public ? (
                        <Button size="mini" type="text" icon={<LinkIcon size={14} />} onClick={() => handleMakePublic(record)} title="公开" />
                    ) : (
                        <Button size="mini" type="text" icon={<Share2 size={14} />} onClick={() => handleShare(record)} title="分享" />
                    )}
                    <Button size="mini" type="text" icon={<Eye size={14} />} onClick={() => handleView(record)} />
                    <Button size="mini" type="text" icon={<Edit size={14} />} onClick={() => handleEdit(record)} />
                    <Button size="mini" type="text" status="danger" icon={<Trash2 size={14} />} onClick={() => handleDelete(record.id)} />
                </div>
            ),
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title heading={2}>搭配方案</Title>
                    <Text type="secondary">创建和管理您的穿搭方案</Text>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={14} />}
                    onClick={handleCreate}
                    style={{ borderRadius: 8 }}
                >
                    创建搭配
                </Button>
            </div>

            <Card style={{ marginTop: 16, borderRadius: 12 }}>
                <Table
                    columns={columns}
                    data={outfits}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showTotal: true }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingOutfit ? '编辑搭配' : '创建搭配'}
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false)
                    setEditingOutfit(null)
                    form.resetFields()
                }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onSubmit={handleSubmit}>
                    <Form.Item
                        label="名称"
                        field="name"
                        rules={[{ required: true, message: '请输入名称' }]}
                    >
                        <Input placeholder="搭配名称" />
                    </Form.Item>
                    <Form.Item label="描述" field="description">
                        <Input.TextArea rows={3} placeholder="搭配描述" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="场合" field="occasion">
                                <Select placeholder="请选择场合">
                                    {occasions.map(occ => (
                                        <Select.Option key={occ.value} value={occ.value}>
                                            {occ.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="季节" field="season">
                                <Select placeholder="请选择季节">
                                    {seasons.map(s => (
                                        <Select.Option key={s.value} value={s.value}>
                                            {s.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="选择衣物"
                        field="item_ids"
                        rules={[{ required: true, message: '请选择至少一件衣物' }]}
                    >
                        <Select mode="multiple" placeholder="选择衣物">
                            {allClothing.map(item => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name} - {item.category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="公开" field="is_public" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} long style={{ borderRadius: 8 }}>
                            {editingOutfit ? '更新' : '创建'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Modal */}
            <Modal
                title={viewingOutfit?.name}
                visible={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={null}
                width={600}
            >
                <p><strong>描述:</strong> {viewingOutfit?.description}</p>
                <p><strong>场合:</strong> {viewingOutfit?.occasion}</p>
                <p><strong>季节:</strong> {viewingOutfit?.season}</p>
                <div style={{ marginTop: 16 }}>
                    <strong>包含衣物:</strong>
                    <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                        {viewingOutfit?.items.map(item => (
                            <Col xs={12} sm={8} key={item.id}>
                                <Card size="small" style={{ borderRadius: 8 }}>{item.name}</Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Modal>
        </div>
    )
}

export default OutfitsPage