import React, { useState } from 'react'
import { Card, Form, Input, Select, Button, Row, Col, Typography, InputNumber } from 'antd'
import { userApi } from '../services/api'
import { useBodyDataStore } from '../stores'
import { useMessage } from '../hooks/useMessage'

const { Title, Paragraph } = Typography
const { Option } = Select

const BodyDataPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { bodyData, setBodyData } = useBodyDataStore()
    const message = useMessage()

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            if (bodyData) {
                const response = await userApi.updateBodyData(values)
                setBodyData(response.data)
                message.success('体型数据更新成功')
            } else {
                const response = await userApi.createBodyData(values)
                setBodyData(response.data)
                message.success('体型数据创建成功')
            }
        } catch (error: any) {
            message.error(error.response?.data?.detail || '操作失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Title level={2}>体型数据</Title>
            <Paragraph>填写您的身体数据，获得更精准的穿搭推荐</Paragraph>

            <Card style={{ maxWidth: 800 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={bodyData || {}}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="身高 (cm)"
                                name="height"
                                rules={[{ required: true, message: '请输入身高' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={100}
                                    max={250}
                                    placeholder="170"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="体重 (kg)"
                                name="weight"
                                rules={[{ required: true, message: '请输入体重' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={30}
                                    max={200}
                                    placeholder="60"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="年龄" name="age">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={10}
                                    max={100}
                                    placeholder="25"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="性别" name="gender">
                                <Select placeholder="请选择">
                                    <Option value="male">男</Option>
                                    <Option value="female">女</Option>
                                    <Option value="other">其他</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="胸围 (cm)" name="chest">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={50}
                                    max={150}
                                    placeholder="90"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="腰围 (cm)" name="waist">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={40}
                                    max={150}
                                    placeholder="75"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="臀围 (cm)" name="hips">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={50}
                                    max={150}
                                    placeholder="95"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="肩宽 (cm)" name="shoulder_width">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={30}
                                    max={60}
                                    placeholder="42"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="偏好风格" name="preferred_style">
                        <Select placeholder="请选择您的穿衣风格">
                            <Option value="casual">休闲</Option>
                            <Option value="formal">正式</Option>
                            <Option value="street">街头</Option>
                            <Option value="sporty">运动</Option>
                            <Option value="minimalist">简约</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {bodyData ? '更新数据' : '保存数据'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default BodyDataPage
