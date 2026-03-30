import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore, useBodyDataStore, useWardrobeStore, useOutfitStore } from '../stores'

describe('useAuthStore', () => {
    it('should have initial state', () => {
        const { result } = renderHook(() => useAuthStore())
        expect(result.current.user).toBeNull()
        expect(result.current.token).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })

    it('should set user and update authentication state', () => {
        const { result } = renderHook(() => useAuthStore())

        act(() => {
            result.current.setUser({
                id: 1,
                username: 'test',
                email: 'test@test.com',
                role: 'user',
                avatar_url: undefined,
                created_at: '',
            })
        })

        expect(result.current.user).toBeDefined()
        expect(result.current.isAuthenticated).toBe(true)
    })

    it('should set token', () => {
        const { result } = renderHook(() => useAuthStore())

        act(() => {
            result.current.setToken('test-token')
        })

        expect(result.current.token).toBe('test-token')
    })

    it('should logout and clear state', () => {
        const { result } = renderHook(() => useAuthStore())

        act(() => {
            result.current.setUser({
                id: 1,
                username: 'test',
                email: 'test@test.com',
                role: 'user',
                avatar_url: null,
                created_at: '',
            })
            result.current.setToken('test-token')
            result.current.logout()
        })

        expect(result.current.user).toBeNull()
        expect(result.current.token).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })
})

describe('useBodyDataStore', () => {
    it('should have initial state', () => {
        const { result } = renderHook(() => useBodyDataStore())
        expect(result.current.bodyData).toBeNull()
    })

    it('should set body data', () => {
        const { result } = renderHook(() => useBodyDataStore())
        const mockBodyData = {
            id: 1,
            user_id: 1,
            height: 175,
            weight: 70,
            age: 25,
            gender: 'male',
            chest: 95,
            waist: 80,
            hips: 95,
            shoulder_width: 45,
            preferred_style: 'casual',
            created_at: '',
            updated_at: '',
        }

        act(() => {
            result.current.setBodyData(mockBodyData)
        })

        expect(result.current.bodyData).toEqual(mockBodyData)
    })
})

describe('useWardrobeStore', () => {
    it('should have initial empty clothing', () => {
        const { result } = renderHook(() => useWardrobeStore())
        expect(result.current.clothing).toEqual([])
    })

    it('should add clothing item', () => {
        const { result } = renderHook(() => useWardrobeStore())
        const mockClothing = {
            id: 1,
            user_id: 1,
            name: 'Test Shirt',
            category: 'tops' as const,
            color: 'blue',
            season: 'summer',
            image_url: undefined,
            brand: undefined,
            created_at: '',
            is_favorite: 0,
        }

        act(() => {
            result.current.addClothing(mockClothing)
        })

        expect(result.current.clothing).toHaveLength(1)
        expect(result.current.clothing[0]).toEqual(mockClothing)
    })

    it('should update clothing item', () => {
        const { result } = renderHook(() => useWardrobeStore())
        const mockClothing = {
            id: 1,
            user_id: 1,
            name: 'Test Shirt',
            category: 'tops' as const,
            color: 'blue',
            season: 'summer',
            image_url: undefined,
            brand: undefined,
            created_at: '',
            is_favorite: 0,
        }

        act(() => {
            result.current.addClothing(mockClothing)
            result.current.updateClothing(1, { name: 'Updated Shirt' })
        })

        expect(result.current.clothing[0].name).toBe('Updated Shirt')
    })

    it('should remove clothing item', () => {
        const { result } = renderHook(() => useWardrobeStore())
        const mockClothing = {
            id: 1,
            user_id: 1,
            name: 'Test Shirt',
            category: 'tops' as const,
            color: 'blue',
            season: 'summer',
            image_url: undefined,
            brand: undefined,
            created_at: '',
            is_favorite: 0,
        }

        act(() => {
            result.current.addClothing(mockClothing)
            result.current.removeClothing(1)
        })

        expect(result.current.clothing).toHaveLength(0)
    })
})

describe('useOutfitStore', () => {
    it('should have initial empty outfits', () => {
        const { result } = renderHook(() => useOutfitStore())
        expect(result.current.outfits).toEqual([])
    })

    it('should add outfit', () => {
        const { result } = renderHook(() => useOutfitStore())
        const mockOutfit = {
            id: 1,
            user_id: 1,
            name: 'Test Outfit',
            description: 'Test',
            occasion: 'casual',
            season: 'summer',
            is_public: 0,
            likes_count: 0,
            items: [],
            created_at: '',
        }

        act(() => {
            result.current.addOutfit(mockOutfit)
        })

        expect(result.current.outfits).toHaveLength(1)
    })

    it('should update outfit', () => {
        const { result } = renderHook(() => useOutfitStore())
        const mockOutfit = {
            id: 1,
            user_id: 1,
            name: 'Test Outfit',
            description: 'Test',
            occasion: 'casual',
            season: 'summer',
            is_public: 0,
            likes_count: 0,
            items: [],
            created_at: '',
        }

        act(() => {
            result.current.addOutfit(mockOutfit)
            result.current.updateOutfit(1, { name: 'Updated Outfit' })
        })

        expect(result.current.outfits[0].name).toBe('Updated Outfit')
    })

    it('should remove outfit', () => {
        const { result } = renderHook(() => useOutfitStore())
        const mockOutfit = {
            id: 1,
            user_id: 1,
            name: 'Test Outfit',
            description: 'Test',
            occasion: 'casual',
            season: 'summer',
            is_public: 0,
            likes_count: 0,
            items: [],
            created_at: '',
        }

        act(() => {
            result.current.addOutfit(mockOutfit)
            result.current.removeOutfit(1)
        })

        expect(result.current.outfits).toHaveLength(0)
    })
})
