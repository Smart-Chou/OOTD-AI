import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi, tokenManager } from '../services/api'
import { useAuthStore } from '../stores'
import { useMessage } from './useMessage'

interface LoginCredentials {
    username: string
    password: string
}

export const useLogin = () => {
    const navigate = useNavigate()
    const { setUser, setToken } = useAuthStore()
    const message = useMessage()
    const [loading, setLoading] = useState(false)

    const login = async (credentials: LoginCredentials) => {
        setLoading(true)
        try {
            const response = await authApi.login({
                username: credentials.username,
                password: credentials.password,
            })

            const { access_token, refresh_token, expires_in } = response.data

            // 存储 token
            tokenManager.setTokens(access_token, refresh_token, expires_in)
            setToken(access_token)

            // 获取用户信息
            const userResponse = await authApi.getMe()
            setUser(userResponse.data)

            message.success('登录成功')
            navigate('/dashboard')
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || '登录失败'
            message.error(typeof errorMsg === 'string' ? errorMsg : '登录失败')
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        login,
        loading,
    }
}