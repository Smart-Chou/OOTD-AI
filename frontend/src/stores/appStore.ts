import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 全局应用错误类型
export interface AppError {
    code: string
    message: string
    details?: any
    timestamp: number
}

// App 全局状态 - 统一管理加载和错误
interface AppState {
    // 全局加载状态
    isLoading: boolean
    loadingMessage: string | null

    // 全局错误
    error: AppError | null

    // Actions
    setLoading: (loading: boolean, message?: string) => void
    setError: (error: AppError | null) => void
    clearError: () => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isLoading: false,
            loadingMessage: null,
            error: null,

            setLoading: (loading, message) =>
                set({
                    isLoading: loading,
                    loadingMessage: message || null,
                    error: loading ? null : undefined as any, // 清除错误
                }),

            setError: (error) =>
                set({
                    error: error
                        ? {
                              code: error.code,
                              message: error.message,
                              details: error.details,
                              timestamp: Date.now(),
                          }
                        : null,
                    isLoading: false,
                    loadingMessage: null,
                }),

            clearError: () => set({ error: null }),
        }),
        {
            name: 'app-storage',
            partialize: () => ({}), // 不持久化任何状态
        }
    )
)

// 错误创建辅助函数
export const createError = (
    code: string,
    message: string,
    details?: any
): AppError => ({
    code,
    message,
    details,
    timestamp: Date.now(),
})

// 提取错误消息辅助函数
export const extractErrorMessage = (error: any): string => {
    if (!error) return '未知错误'

    // FastAPI 错误格式
    if (error.response?.data?.detail) {
        const detail = error.response.data.detail
        if (typeof detail === 'string') return detail
        if (Array.isArray(detail)) {
            return detail.map((d: any) => d.msg || d).join(', ')
        }
        return detail.msg || JSON.stringify(detail)
    }

    // 自定义错误格式
    if (error.data?.detail) return error.data.detail

    // 直接返回 message
    if (error.message) return error.message

    // 兜底
    return '操作失败，请稍后重试'
}

// 统一错误处理 hook
import { useCallback } from 'react'

export const useErrorHandler = () => {
    const { setError, clearError, error } = useAppStore()

    const handleError = useCallback(
        (error: any, fallbackMessage?: string) => {
            const message = extractErrorMessage(error) || fallbackMessage || '操作失败'
            setError({ code: 'UNKNOWN', message, details: error })
        },
        [setError]
    )

    return {
        error,
        handleError,
        clearError,
    }
}