import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Message } from '@arco-design/web-react'
import { wardrobeApi, bulkApi } from '../services/api'

// 类型定义
export interface ClothingItem {
    id: number
    name: string
    category: string
    color: string
    season: string
    imageIndex: number
}

export interface WardrobeFilters {
    category: string
    season: string
    searchQuery: string
}

export interface ImportResult {
    success: boolean
    imported_count: number
    total_errors: number
    errors: string[]
}

// 分类映射 - API 到前端的转换
const CATEGORY_MAP: Record<string, string> = {
    tops: '上衣',
    bottoms: '下装',
    outerwear: '外套',
    dresses: '连衣裙',
    shoes: '鞋子',
    accessories: '配件',
}

const SEASON_MAP: Record<string, string> = {
    spring: '春季',
    summer: '夏季',
    fall: '秋冬',
    winter: '冬季',
}

// 常量
export const CATEGORIES = ['全部', '上衣', '下装', '外套', '鞋子', '配件']
export const SEASONS = ['全部季节', '春季', '夏季', '秋冬', '四季']

// 将 API 响应转换为本地格式
const convertApiResponse = (data: any[]): ClothingItem[] => {
    return data.map((item) => ({
        id: item.id,
        name: item.name,
        category: CATEGORY_MAP[item.category] || item.category,
        color: item.color || '',
        season: SEASON_MAP[item.season] || item.season || '',
        imageIndex: 0,
    }))
}

export const useWardrobe = () => {
    const queryClient = useQueryClient()

    // 筛选状态
    const [filters, setFilters] = useState<WardrobeFilters>({
        category: '全部',
        season: '全部季节',
        searchQuery: '',
    })

    // 视图模式
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // 获取衣物列表 - 使用 React Query
    const {
        data: clothing = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['wardrobe', filters.category],
        queryFn: async () => {
            const response = await wardrobeApi.getClothingList()
            if (response.data && response.data.length > 0) {
                return convertApiResponse(response.data)
            }
            return []
        },
        staleTime: 5 * 60 * 1000, // 5 分钟内数据视为新鲜
    })

    // 批量导入 mutation
    const importMutation = useMutation({
        mutationFn: async (csvData: string) => {
            const response = await bulkApi.importClothing(csvData)
            return response.data as ImportResult
        },
        onSuccess: (data) => {
            if (data.success) {
                Message.success(`成功导入 ${data.imported_count} 件衣物`)
                queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
            } else {
                Message.warning(`导入部分成功，成功 ${data.imported_count} 件，${data.total_errors} 个错误`)
            }
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.detail || '导入失败'
            Message.error(errorMsg)
        },
    })

    // 导出功能
    const exportClothing = useCallback(async (category?: string) => {
        try {
            const response = await bulkApi.exportClothing(category)
            const blob = new Blob([response.data as any], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `wardrobe_export${category ? '_' + category : ''}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            Message.success('导出成功')
        } catch (error) {
            Message.error('导出失败')
        }
    }, [])

    // 过滤后的衣物
    const filteredClothing = useMemo(() => {
        return clothing.filter((item) => {
            const matchCategory = filters.category === '全部' || item.category === filters.category
            const matchSeason =
                filters.season === '全部季节' || item.season === filters.season || item.season === '四季'
            const matchSearch =
                item.name.includes(filters.searchQuery) || item.category.includes(filters.searchQuery)
            return matchCategory && matchSeason && matchSearch
        })
    }, [clothing, filters])

    // 各类别的数量统计
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { 全部: clothing.length }
        clothing.forEach((item) => {
            counts[item.category] = (counts[item.category] || 0) + 1
        })
        return counts
    }, [clothing])

    // 更新筛选条件
    const updateFilters = useCallback((updates: Partial<WardrobeFilters>) => {
        setFilters((prev) => ({ ...prev, ...updates }))
    }, [])

    return {
        // 数据
        clothing: filteredClothing,
        allClothing: clothing,
        isLoading,
        refetch,

        // 筛选
        filters,
        updateFilters,
        categoryCounts,

        // 视图
        viewMode,
        setViewMode,

        // 操作
        importCsv: importMutation.mutate,
        exporting: importMutation.isPending,
        exportClothing,
    }
}