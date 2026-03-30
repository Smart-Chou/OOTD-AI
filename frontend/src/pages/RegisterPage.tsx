import React, { useState } from 'react'
import { Form, Input, Button, Typography } from '@arco-design/web-react'
import { User, Lock, Mail, Shirt, UserPlus } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuthPage } from '../hooks/useAuthPage'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography

const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const { navigate, setUser, setToken, message } = useAuthPage()

    const onFinish = async (values: {
        email: string
        username: string
        password: string
        full_name?: string
    }) => {
        setLoading(true)
        try {
            const response = await authApi.register(values)
            const user = response.data

            // Auto login after register
            const loginResponse = await authApi.login({
                username: values.username,
                password: values.password,
            })
            const { access_token } = loginResponse.data

            localStorage.setItem('token', access_token)
            setToken(access_token)
            setUser(user)

            message.success('注册成功')
            navigate('/dashboard')
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || '注册失败'
            message.error(typeof errorMsg === 'string' ? errorMsg : '注册失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-forest flex items-center justify-center">
                        <Shirt className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
                    </div>
                    <span className="text-2xl font-bold text-foreground">穿搭助手</span>
                    <span className="text-sm text-gold font-medium">AI</span>
                </div>

                {/* Register Card */}
                <div className="bg-card rounded-2xl shadow-card border border-border p-8">
                    <Title heading={3} style={{ textAlign: 'center', marginBottom: 8 }}>
                        创建账号
                    </Title>
                    <Text
                        type="secondary"
                        style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}
                    >
                        注册后开启你的 AI 穿搭之旅
                    </Text>

                    <Form name="register" onSubmit={onFinish} size="large">
                        <Form.Item
                            field="email"
                            rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
                        >
                            <Input
                                prefix={<Mail className="w-5 h-5 text-muted-foreground" />}
                                placeholder="邮箱"
                                style={{ borderRadius: 8, height: 48 }}
                            />
                        </Form.Item>
                        <Form.Item
                            field="username"
                            rules={[{ required: true, minLength: 3, message: '用户名至少3个字符' }]}
                        >
                            <Input
                                prefix={<User className="w-5 h-5 text-muted-foreground" />}
                                placeholder="用户名"
                                style={{ borderRadius: 8, height: 48 }}
                            />
                        </Form.Item>
                        <Form.Item
                            field="password"
                            rules={[{ required: true, minLength: 6, message: '密码至少6个字符' }]}
                        >
                            <Input.Password
                                prefix={<Lock className="w-5 h-5 text-muted-foreground" />}
                                placeholder="密码"
                                style={{ borderRadius: 8, height: 48 }}
                            />
                        </Form.Item>
                        <Form.Item field="full_name">
                            <Input
                                prefix={<User className="w-5 h-5 text-muted-foreground" />}
                                placeholder="姓名（可选）"
                                style={{ borderRadius: 8, height: 48 }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                long
                                style={{ borderRadius: 8, height: 48, fontSize: 16 }}
                            >
                                <UserPlus className="w-5 h-5 mr-2 inline" />
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                        <Text type="secondary">已有账号？ </Text>
                        <Link to="/login" className="text-forest font-medium hover:underline">
                            立即登录
                        </Link>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                        ← 返回首页
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
