import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography } from '@arco-design/web-react'
import { User, Lock, Mail } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuthPage } from '../hooks/useAuthPage'

const { Title } = Typography

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
                    注册
                </Title>
                <Form name="register" onSubmit={onFinish} size="large">
                    <Form.Item
                        field="email"
                        rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
                    >
                        <Input
                            prefix={<Mail className="w-4 h-4" />}
                            placeholder="邮箱"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                        field="username"
                        rules={[{ required: true, minLength: 3, message: '用户名至少3个字符' }]}
                    >
                        <Input
                            prefix={<User className="w-4 h-4" />}
                            placeholder="用户名"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                        field="password"
                        rules={[{ required: true, minLength: 6, message: '密码至少6个字符' }]}
                    >
                        <Input.Password
                            prefix={<Lock className="w-4 h-4" />}
                            placeholder="密码"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item field="full_name">
                        <Input placeholder="姓名（可选）" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            long
                            style={{ borderRadius: 8, height: 44 }}
                        >
                            注册
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    已有账号？ <a href="/login">立即登录</a>
                </div>
            </Card>
        </div>
    )
}

export default RegisterPage
