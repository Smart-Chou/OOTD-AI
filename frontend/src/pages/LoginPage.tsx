import React, { useState } from 'react'
import { Form, Input, Button, Typography } from '@arco-design/web-react'
import { User, Lock, Shirt, LogIn, Github, ArrowRight } from 'lucide-react'
import { authApi, tokenManager } from '../services/api'
import { useAuthPage } from '../hooks/useAuthPage'
import { Link } from 'react-router-dom'

const { Text } = Typography

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

            tokenManager.setTokens(access_token, refresh_token, expires_in)
            setToken(access_token)

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
        <div className="auth-page-split">
            {/* Left Side - Brand */}
            <div className="auth-brand">
                <div className="auth-brand-decoration top-right" />
                <div className="auth-brand-decoration bottom-left" />

                <div className="auth-brand-content">
                    <Link to="/" className="auth-brand-logo">
                        <div className="auth-brand-logo-icon">
                            <Shirt className="w-6 h-6" strokeWidth={2} />
                        </div>
                        <span className="auth-brand-logo-text">穿搭助手</span>
                        <span className="auth-brand-logo-badge">AI</span>
                    </Link>

                    <div className="auth-brand-hero">
                        <h1 className="auth-brand-title">
                            发现你的<br />
                            <span className="highlight">专属穿搭风格</span>
                        </h1>
                        <p className="auth-brand-desc">
                            加入超过 12 万用户的时尚社区。上传照片，获取 AI 量身定制的搭配方案。
                        </p>

                        <div className="auth-brand-testimonial">
                            <div className="auth-brand-stars">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <svg key={i} className="w-4 h-4" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="auth-brand-quote">
                                "这改变了我每天早上面对衣橱的焦虑。虚拟试穿功能简直是魔法！"
                            </p>
                            <p className="auth-brand-author">— Sarah, 时尚博主</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-form-side">
                {/* Mobile Header */}
                <div className="md:hidden auth-mobile-header">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
                            <Shirt className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
                        </div>
                        <span className="text-lg font-bold text-foreground">穿搭助手</span>
                        <span className="text-xs text-gold font-medium">AI</span>
                    </Link>
                </div>

                <div className="auth-form-container">
                    <div className="auth-header">
                        <h1 className="auth-title">欢迎回来</h1>
                        <p className="auth-subtitle">输入您的详细信息以访问您的个人衣橱</p>
                    </div>

                    <Form
                        name="login"
                        onSubmit={onFinish}
                        size="large"
                        layout="vertical"
                        className="auth-form"
                    >
                        <div className="form-item">
                            <div className="form-icon-wrapper">
                                <User className="w-4 h-4" />
                            </div>
                            <Form.Item
                                field="username"
                                rules={[{ required: true, message: '请输入用户名' }]}
                                className="form-item-field"
                            >
                                <Input
                                    placeholder="用户名"
                                    className="form-input"
                                />
                            </Form.Item>
                        </div>

                        <div className="form-item">
                            <div className="form-icon-wrapper">
                                <Lock className="w-4 h-4" />
                            </div>
                            <Form.Item
                                field="password"
                                rules={[{ required: true, message: '请输入密码' }]}
                                className="form-item-field"
                            >
                                <Input.Password
                                    placeholder="••••••••"
                                    className="form-input"
                                />
                            </Form.Item>
                        </div>

                        <div className="form-extra">
                            <label className="form-checkbox">
                                <input type="checkbox" />
                                <span>记住我</span>
                            </label>
                            <Link to="/forgot-password" className="form-link">
                                忘记密码？
                            </Link>
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            long
                            className={`btn-primary ${loading ? 'loading' : ''}`}
                        >
                            <LogIn className="w-5 h-5 mr-2 inline" />
                            登 录
                        </Button>
                    </Form>

                    <div className="auth-divider">
                        <span>或使用其他方式</span>
                    </div>

                    <div className="social-login">
                        <Button long size="large" className="social-btn">
                            <Github className="w-4 h-4 mr-2 inline" />
                            GitHub
                        </Button>
                        <Button long size="large" className="social-btn">
                            <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                            </svg>
                            Google
                        </Button>
                    </div>

                    <div className="auth-footer">
                        <Text type="secondary">还没有账号？ </Text>
                        <Link to="/register" className="auth-footer-link">
                            立即注册
                        </Link>
                    </div>

                    <div className="auth-footer-home">
                        <Link to="/" className="auth-home-link">
                            先去逛逛首页 <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage