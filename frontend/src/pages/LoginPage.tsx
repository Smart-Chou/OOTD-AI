import React, { useState } from 'react'
import { Form, Input, Button, Typography } from '@arco-design/web-react'
import { User, Lock, Shirt, LogIn } from 'lucide-react'
import { authApi, tokenManager } from '../services/api'
import { useAuthPage } from '../hooks/useAuthPage'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const { navigate, setUser, setToken, message } = useAuthPage()

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true)
        try {
            const response = await authApi.login({
                username: values.username,
                password: values.password,
            })
            const { access_token, refresh_token, expires_in } = response.data

            // 使用 tokenManager 存储 token
            tokenManager.setTokens(access_token, refresh_token, expires_in)
            setToken(access_token)

            // Fetch user info
            const userResponse = await authApi.getMe()
            setUser(userResponse.data)

            message.success('登录成功')
            navigate('/dashboard')
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || '登录失败'
            message.error(typeof errorMsg === 'string' ? errorMsg : '登录失败')
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

                {/* Login Card */}
                <div className="bg-card rounded-2xl shadow-card border border-border p-8">
                    <Title heading={3} style={{ textAlign: 'center', marginBottom: 8 }}>
                        欢迎回来
                    </Title>
                    <Text
                        type="secondary"
                        style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}
                    >
                        登录你的账号开始 AI 穿搭之旅
                    </Text>

                    <Form name="login" onSubmit={onFinish} size="large">
                        <Form.Item
                            field="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input
                                prefix={<User className="w-5 h-5 text-muted-foreground" />}
                                placeholder="用户名"
                                style={{ borderRadius: 8, height: 48 }}
                            />
                        </Form.Item>
                        <Form.Item
                            field="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password
                                prefix={<Lock className="w-5 h-5 text-muted-foreground" />}
                                placeholder="密码"
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
                                <LogIn className="w-5 h-5 mr-2 inline" />
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                        <Text type="secondary">还没有账号？ </Text>
                        <Link to="/register" className="text-forest font-medium hover:underline">
                            立即注册
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

export default LoginPage
