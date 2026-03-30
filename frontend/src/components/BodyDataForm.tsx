import { useState } from 'react'
import { Button, Form, InputNumber, Select, Typography } from '@arco-design/web-react'

const { Title, Text } = Typography

interface BodyDataFormProps {
    onSave?: (data: BodyData) => void
}

interface BodyData {
    height: number
    weight: number
    gender: string
    bodyShape: string
    stylePreference: string[]
}

const STYLE_TAGS = ['简约', '休闲', '商务', '运动', '街头', '复古', '文艺', '优雅']

const BodyDataForm = ({ onSave = () => {} }: BodyDataFormProps) => {
    const [form] = Form.useForm()
    const [selectedStyles, setSelectedStyles] = useState<string[]>(['简约', '休闲'])

    const toggleStyle = (style: string) => {
        setSelectedStyles(prev =>
            prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
        )
    }

    const handleSubmit = () => {
        form.validate().then((values: Record<string, unknown>) => {
            const data: BodyData = {
                height: values.height as number,
                weight: values.weight as number,
                gender: values.gender as string,
                bodyShape: values.bodyShape as string,
                stylePreference: selectedStyles,
            }
            console.log('保存体型数据:', data)
            onSave(data)
        })
    }

    return (
        <div data-cmp="BodyDataForm" className="bg-card rounded-2xl p-6 shadow-card">
            <div className="mb-6">
                <Title heading={5} style={{ margin: 0, color: 'var(--foreground)' }}>
                    体型数据录入
                </Title>
                <Text style={{ color: 'var(--muted-foreground)', fontSize: '13px' }}>
                    准确的体型数据有助于更精准的穿搭推荐
                </Text>
            </div>

            <Form form={form} layout="vertical" autoComplete="off">
                <div className="flex gap-4">
                    <Form.Item
                        field="gender"
                        label="性别"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: '请选择性别' }]}
                        initialValue="male"
                    >
                        <Select placeholder="请选择">
                            <Select.Option value="male">男</Select.Option>
                            <Select.Option value="female">女</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        field="bodyShape"
                        label="体型"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: '请选择体型' }]}
                        initialValue="standard"
                    >
                        <Select placeholder="请选择">
                            <Select.Option value="slim">偏瘦型</Select.Option>
                            <Select.Option value="standard">标准型</Select.Option>
                            <Select.Option value="athletic">运动型</Select.Option>
                            <Select.Option value="curvy">丰满型</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="flex gap-4">
                    <Form.Item
                        field="height"
                        label="身高 (cm)"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: '请输入身高' }]}
                        initialValue={170}
                    >
                        <InputNumber
                            min={140}
                            max={220}
                            placeholder="请输入身高"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        field="weight"
                        label="体重 (kg)"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: '请输入体重' }]}
                        initialValue={60}
                    >
                        <InputNumber
                            min={30}
                            max={150}
                            placeholder="请输入体重"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </div>

                <div className="mb-4">
                    <Text
                        style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'var(--foreground)',
                            display: 'block',
                            marginBottom: '10px',
                        }}
                    >
                        风格偏好
                    </Text>
                    <div className="flex flex-wrap gap-2">
                        {STYLE_TAGS.map(style => (
                            <button
                                key={style}
                                type="button"
                                onClick={() => toggleStyle(style)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                    selectedStyles.includes(style)
                                        ? 'bg-forest text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                                }`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    type="primary"
                    onClick={handleSubmit}
                    long
                    style={{
                        backgroundColor: 'var(--primary)',
                        borderColor: 'var(--primary)',
                        height: '42px',
                        borderRadius: '21px',
                        fontWeight: 600,
                    }}
                >
                    保存体型数据
                </Button>
            </Form>
        </div>
    )
}

export default BodyDataForm
