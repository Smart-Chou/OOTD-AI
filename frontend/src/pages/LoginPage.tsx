import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography } from '@arco-design/web-react'
import { User, Lock } from 'lucide-react'
import { authApi, tokenManager } from '../services/api'
import { useAuthPage } from '../hooks/useAuthPage'

const { Title } = Typography

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
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 200px)',
            }}
        >
            <Card style={{ width: 400, borderRadius: 12 }}>
                <Title heading={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                    登录
                </Title>
                <Form name="login" onSubmit={onFinish} size="large">
                    <Form.Item
                        field="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input
                            prefix={<User className="w-4 h-4" />}
                            placeholder="用户名"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item field="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password
                            prefix={<Lock className="w-4 h-4" />}
                            placeholder="密码"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            long
                            style={{ borderRadius: 8, height: 44 }}
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    还没有账号？ <a href="/register">立即注册</a>
                </div>
            </Card>
        </div>
    )
}

export default LoginPage
