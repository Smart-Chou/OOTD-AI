import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authApi, tokenManager } from '../services/api'
import { useAuthStore } from '../stores'
import { useMessage } from '../hooks/useMessage'

const { Title } = Typography

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { setUser, setToken } = useAuthStore()
    const message = useMessage()

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true)
        try {
            const formData = new URLSearchParams()
            formData.append('username', values.username)
            formData.append('password', values.password)

            const response = await authApi.login(formData.toString())
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
            <Card style={{ width: 400 }}>
                <Title level={3} style={{ textAlign: 'center' }}>
                    登录
                </Title>
                <Form name="login" onFinish={onFinish} size="large">
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center' }}>
                    还没有账号？ <a href="/register">立即注册</a>
                </div>
            </Card>
        </div>
    )
}

export default LoginPage
