import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMessage } from '../hooks/useMessage'

describe('useMessage hook', () => {
    it('should return message API', () => {
        const { result } = renderHook(() => useMessage())

        expect(result.current).toHaveProperty('loading')
        expect(result.current).toHaveProperty('success')
        expect(result.current).toHaveProperty('error')
        expect(result.current).toHaveProperty('info')
        expect(result.current).toHaveProperty('warning')
    })

    it('should have functions as values', () => {
        const { result } = renderHook(() => useMessage())

        expect(typeof result.current.loading).toBe('function')
        expect(typeof result.current.success).toBe('function')
        expect(typeof result.current.error).toBe('function')
        expect(typeof result.current.info).toBe('function')
        expect(typeof result.current.warning).toBe('function')
    })
})