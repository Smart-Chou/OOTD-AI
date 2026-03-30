import axios from 'axios'
import type {
    LoginRequest,
    RegisterRequest,
    User,
    BodyData,
    ClothingItem,
    Outfit,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add token to requests
api.interceptors.request.use(config => {
    const token = tokenManager.getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth API
export const authApi = {
    login: (data: LoginRequest) =>
        api.post<{
            access_token: string;
            refresh_token: string;
            token_type: string;
            expires_in: number;
        }>('/auth/login', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
    register: (data: RegisterRequest) => api.post<User>('/auth/register', data),
    getMe: () => api.get<User>('/auth/me'),
    updateProfile: (data: Partial<User>) => api.put<User>('/auth/me', data),
    refreshToken: (refreshToken: string) =>
        api.post<{ access_token: string; token_type: string; expires_in: number }>(
            '/auth/refresh',
            { refresh_token: refreshToken }
        ),
    revokeToken: (refreshToken: string) =>
        api.post('/auth/revoke', { refresh_token: refreshToken }),
}

// Token 管理
export const tokenManager = {
    getAccessToken: () => localStorage.getItem('access_token'),
    getRefreshToken: () => localStorage.getItem('refresh_token'),
    setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
        localStorage.setItem('token_expires_at', String(Date.now() + expiresIn * 1000))
    },
    clearTokens: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('token_expires_at')
    },
    isTokenExpired: () => {
        const expiresAt = localStorage.getItem('token_expires_at')
        if (!expiresAt) return true
        return Date.now() > parseInt(expiresAt)
    },
}

// Response interceptor for token refresh
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const refreshToken = tokenManager.getRefreshToken()
                if (!refreshToken || tokenManager.isTokenExpired()) {
                    tokenManager.clearTokens()
                    window.location.href = '/login'
                    return Promise.reject(error)
                }
                const response = await authApi.refreshToken(refreshToken)
                tokenManager.setTokens(
                    response.data.access_token,
                    refreshToken,
                    response.data.expires_in
                )
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`
                return api(originalRequest)
            } catch {
                tokenManager.clearTokens()
                window.location.href = '/login'
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)

// User API
export const userApi = {
    getBodyData: () => api.get<BodyData>('/users/body-data'),
    createBodyData: (data: Omit<BodyData, 'id' | 'user_id' | 'created_at'>) =>
        api.post<BodyData>('/users/body-data', data),
    updateBodyData: (data: Omit<BodyData, 'id' | 'user_id' | 'created_at'>) =>
        api.put<BodyData>('/users/body-data', data),
    deleteBodyData: () => api.delete('/users/body-data'),
}

// Wardrobe API
export const wardrobeApi = {
    getClothingList: (category?: string) =>
        api.get<ClothingItem[]>('/wardrobe/', { params: { category } }),
    getClothing: (id: number) => api.get<ClothingItem>(`/wardrobe/${id}`),
    createClothing: (data: Omit<ClothingItem, 'id' | 'user_id' | 'created_at'>) =>
        api.post<ClothingItem>('/wardrobe/', data),
    updateClothing: (id: number, data: Partial<ClothingItem>) =>
        api.put<ClothingItem>(`/wardrobe/${id}`, data),
    deleteClothing: (id: number) => api.delete(`/wardrobe/${id}`),
    uploadImage: (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return api.post<{ image_url: string }>('/wardrobe/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
}

// Outfit API
export const outfitApi = {
    getOutfits: () => api.get<Outfit[]>('/outfits/'),
    getPublicOutfits: () => api.get<Outfit[]>('/outfits/public'),
    getOutfit: (id: number) => api.get<Outfit>(`/outfits/${id}`),
    createOutfit: (data: Omit<Outfit, 'id' | 'user_id' | 'created_at' | 'likes_count'>) =>
        api.post<Outfit>('/outfits/', data),
    updateOutfit: (id: number, data: Partial<Outfit>) => api.put<Outfit>(`/outfits/${id}`, data),
    deleteOutfit: (id: number) => api.delete(`/outfits/${id}`),
}

// Virtual Try-On API
export const tryOnApi = {
    generateTryOn: (userPhotoBase64: string, clothingItemId: number) =>
        api.post<{
            generation_id: string;
            status: string;
            result_image_url: string | null;
            message: string;
        }>('/recommendations/virtual-tryon', {
            user_photo_base64: userPhotoBase64,
            clothing_item_id: clothingItemId,
        }),
    checkStatus: (generationId: string) =>
        api.get<{
            generation_id: string;
            status: string;
            result_image_url: string | null;
            message: string;
        }>(`/recommendations/virtual-tryon/${generationId}/status`),
}

export default api
