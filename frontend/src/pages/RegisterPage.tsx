import React, { useState, useEffect, useCallback } from 'react'
import { Form, Input, Button, Typography } from '@arco-design/web-react'
import { User, Lock, Mail, Shirt, UserPlus, Github, ArrowRight, CheckCircle, Loader } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuthPage } from '../hooks/useAuthPage'
import { Link } from 'react-router-dom'

const { Text } = Typography

// 防抖 Hook
function useDebounce(value: string, delay: number = 500): string {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}

// 密码强度组件
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
    const getStrength = useCallback(() => {
        if (!password) return 0
        let score = 0
        if (password.length >= 6) score++
        if (/[A-Z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++
        return score
    }, [password])

    const strength = getStrength()
    const labels = ['太弱', '较弱', '一般', '强']
    const colors = ['#e5484d', '#f59e0b', '#3b82f6', '#2fb344']

    if (!password) return null

    return (
        <div className="strength-container">
            <div className="strength-bar">
                <div
                    className={`strength-bar-fill level-${strength}`}
                    style={{ width: `${strength * 25}%` }}
                />
            </div>
            <span className="strength-label" style={{ color: colors[strength - 1] || '#999' }}>
                {strength > 0 ? labels[strength - 1] : '太弱'}
            </span>
        </div>
    )
}

// 表单完成度进度条
const ProgressBar: React.FC<{ form: { username: string; email: string; password: string } }> = ({ form }) => {
    const filled = Object.values(form).filter(Boolean).length
    const total = 3
    const percent = (filled / total) * 100

    return (
        <div className="progress-container">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <span className="progress-text">{Math.round(percent)}% 完成</span>
        </div>
    )
}

// 状态图标组件
const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
    if (status === 'success') {
        return <CheckCircle className="status-icon status-success" size={18} />
    }
    if (status === 'error') {
        return <span className="status-icon status-error">!</span>
    }
    if (status === 'loading') {
        return <Loader className="status-icon status-loading" size={18} />
    }
    return null
}

// 模拟用户名检查API
const checkUsernameExists = async (username: string): Promise<{ ok: boolean; msg?: string }> => {
    // 模拟网络延迟
    await new Promise((r) => setTimeout(r, 600))

    // 模拟已存在的用户名
    const existsUsers = ['admin', 'test', 'root', 'administrator']
    if (existsUsers.includes(username.toLowerCase())) {
        return { ok: false, msg: '用户名已被注册' }
    }
    return { ok: true }
}

const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [status, setStatus] = useState<Record<string, string>>({})
    const [passwordVisible, setPasswordVisible] = useState(false)

    const { navigate, setUser, setToken, message } = useAuthPage()

    // 防抖用户名
    const debouncedUsername = useDebounce(form.username, 600)

    // 用户名远程校验
    useEffect(() => {
        if (!debouncedUsername || debouncedUsername.length < 3) return

        setStatus((s) => ({ ...s, username: 'loading' }))

        checkUsernameExists(debouncedUsername).then((res) => {
            if (!res.ok) {
                setErrors((e) => ({ ...e, username: res.msg || '用户名已存在' }))
                setStatus((s) => ({ ...s, username: 'error' }))
            } else {
                setErrors((e) => ({ ...e, username: '' }))
                setStatus((s) => ({ ...s, username: 'success' }))
            }
        })
    }, [debouncedUsername])

    // 输入处理
    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value })

        // 本地校验
        if (field === 'email' && value) {
            const valid = /^\S+@\S+\.\S+$/.test(value)
            setErrors((e) => ({ ...e, email: valid ? '' : '邮箱格式错误' }))
        }
    }

    const onFinish = async (values: {
        email: string
        username: string
        password: string
        full_name?: string
    }) => {
        // 提交前检查
        if (errors.username || errors.email || values.password.length < 6) {
            message.error('请检查表单信息')
            return
        }

        setLoading(true)
        try {
            const response = await authApi.register(values)
            const user = response.data

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
                        <h1 className="auth-title">创建新账号</h1>
                        <p className="auth-subtitle">注册以体验 AI 驱动的智能穿搭推荐</p>
                    </div>

                    <Form
                        name="register"
                        onSubmit={onFinish}
                        size="large"
                        layout="vertical"
                        className="auth-form"
                        validateTrigger={['onBlur', 'onChange']}
                    >
                        <div className={`form-item ${errors.username ? 'shake' : ''}`}>
                            <div className="form-icon-wrapper">
                                <User className="w-4 h-4" />
                            </div>
                            <Form.Item
                                field="username"
                                rules={[
                                    { required: true, message: '请输入用户名' },
                                    { minLength: 3, message: '用户名至少3位' }
                                ]}
                                className="form-item-field"
                            >
                                <Input
                                    placeholder="用户名（至少3位）"
                                    value={form.username}
                                    onChange={(value) => handleChange('username', value)}
                                />
                            </Form.Item>
                            <div className="form-status-icon">
                                <StatusIcon status={status.username} />
                            </div>
                        </div>

                        <div className={`form-item ${errors.email ? 'shake' : ''}`}>
                            <div className="form-icon-wrapper">
                                <Mail className="w-4 h-4" />
                            </div>
                            <Form.Item
                                field="email"
                                rules={[
                                    { required: true, message: '请输入邮箱' },
                                    { type: 'email', message: '请输入有效邮箱格式' }
                                ]}
                                className="form-item-field"
                            >
                                <Input
                                    placeholder="邮箱地址"
                                    value={form.email}
                                    onChange={(value) => handleChange('email', value)}
                                />
                            </Form.Item>
                        </div>

                        <div className="form-item">
                            <div className="form-icon-wrapper">
                                <Lock className="w-4 h-4" />
                            </div>
                            <Form.Item
                                field="password"
                                rules={[
                                    { required: true, message: '请输入密码' },
                                    { minLength: 6, message: '密码至少6位' }
                                ]}
                                className="form-item-field"
                            >
                                <div className="password-input-wrapper">
                                    <Input.Password
                                        placeholder="设置密码（至少6位）"
                                        value={form.password}
                                        onChange={(value) => handleChange('password', value)}
                                        visibilityToggle={false}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.72a3 3 0 0 0-4.18 4.18M1 1l22 22" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </Form.Item>
                            <PasswordStrength password={form.password} />
                        </div>

                        <div className="form-item">
                            <div className="form-icon-wrapper">
                                <User className="w-4 h-4" />
                            </div>
                            <Form.Item
                                field="full_name"
                                className="form-item-field"
                            >
                                <Input
                                    placeholder="姓名（可选）"
                                />
                            </Form.Item>
                        </div>

                        {/* 完成度进度条 */}
                        <ProgressBar form={form} />

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            long
                            className={`btn-primary ${loading ? 'loading' : ''}`}
                            style={{ marginTop: 8 }}
                        >
                            {loading ? '注册中...' : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2 inline" />
                                    注 册 账 号
                                </>
                            )}
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
                        <Text type="secondary">已有账号？ </Text>
                        <Link to="/login" className="auth-footer-link">
                            立即登录
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

export default RegisterPage