import axios from 'axios'
import type {
    Token,
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
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth API
export const authApi = {
    login: (data: LoginRequest) =>
        api.post<Token>('/auth/login', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
    register: (data: RegisterRequest) => api.post<User>('/auth/register', data),
    getMe: () => api.get<User>('/auth/me'),
    updateProfile: (data: Partial<User>) => api.put<User>('/auth/me', data),
}

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

export default api
