import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}))

// Mock stores
vi.mock('../stores', () => ({
    useAuthStore: () => ({
        user: null,
        setUser: vi.fn(),
        setToken: vi.fn(),
        logout: vi.fn(),
        isAuthenticated: false,
    }),
}))

// Mock useMessage
vi.mock('./useMessage', () => ({
    useMessage: () => ({
        success: vi.fn(),
        error: vi.fn(),
        loading: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    }),
}))

import { renderHook } from '@testing-library/react'
import { useAuthPage } from '../hooks/useAuthPage'

describe('useAuthPage hook', () => {
    it('should return auth page utilities', () => {
        const { result } = renderHook(() => useAuthPage())

        expect(result.current).toHaveProperty('navigate')
        expect(result.current).toHaveProperty('user')
        expect(result.current).toHaveProperty('setUser')
        expect(result.current).toHaveProperty('setToken')
        expect(result.current).toHaveProperty('logout')
        expect(result.current).toHaveProperty('isAuthenticated')
        expect(result.current).toHaveProperty('message')
    })

    it('should have message API with required methods', () => {
        const { result } = renderHook(() => useAuthPage())

        expect(result.current.message).toHaveProperty('success')
        expect(result.current.message).toHaveProperty('error')
        expect(result.current.message).toHaveProperty('loading')
    })
})