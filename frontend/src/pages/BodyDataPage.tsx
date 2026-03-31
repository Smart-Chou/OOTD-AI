import React from 'react'
import { Card, Form, Select, Button, Typography, InputNumber, Grid } from '@arco-design/web-react'
import { useBodyData } from '../hooks/useBodyData'
import FormSection from '../components/FormSection'

const { Title, Text } = Typography
const { Row, Col } = Grid

const BodyDataPage: React.FC = () => {
    const [form] = Form.useForm()
    const { bodyData, save, loading } = useBodyData()

    const onFinish = async (values: any) => {
        await save(values)
    }

    return (
        <div>
            <Title heading={2}>体型数据</Title>
            <Text type="secondary">填写您的身体数据，获得更精准的穿搭推荐</Text>

            <Card style={{ maxWidth: 800, marginTop: 16, borderRadius: 12 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onSubmit={onFinish}
                    initialValues={bodyData || {}}
                    className="space-y-6"
                >
                    {/* 基础信息 */}
                    <FormSection title="基础信息" description="必填信息，用于计算尺码推荐">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="身高 (cm)"
                                    field="height"
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
                            <Col span={12}>
                                <Form.Item
                                    label="体重 (kg)"
                                    field="weight"
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
                            <Col span={12}>
                                <Form.Item label="年龄" field="age">
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={10}
                                        max={100}
                                        placeholder="25"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="性别" field="gender">
                                    <Select placeholder="请选择">
                                        <Select.Option value="male">男</Select.Option>
                                        <Select.Option value="female">女</Select.Option>
                                        <Select.Option value="other">其他</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </FormSection>

                    {/* 身体尺寸 */}
                    <FormSection title="身体尺寸" description="可选信息，用于更精准的尺码匹配">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="胸围 (cm)" field="chest">
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={50}
                                        max={150}
                                        placeholder="90"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="腰围 (cm)" field="waist">
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
                            <Col span={12}>
                                <Form.Item label="臀围 (cm)" field="hips">
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={50}
                                        max={150}
                                        placeholder="95"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="肩宽 (cm)" field="shoulder_width">
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        min={30}
                                        max={60}
                                        placeholder="42"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </FormSection>

                    {/* 风格偏好 */}
                    <FormSection title="风格偏好" description="选择您喜欢的穿搭风格">
                        <Form.Item label="偏好风格" field="preferred_style">
                            <Select placeholder="请选择您的穿衣风格">
                                <Select.Option value="casual">休闲</Select.Option>
                                <Select.Option value="formal">正式</Select.Option>
                                <Select.Option value="street">街头</Select.Option>
                                <Select.Option value="sporty">运动</Select.Option>
                                <Select.Option value="minimalist">简约</Select.Option>
                            </Select>
                        </Form.Item>
                    </FormSection>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ borderRadius: 8 }}
                        >
                            {bodyData ? '更新数据' : '保存数据'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default BodyDataPage