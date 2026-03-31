import { useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Shirt, Sparkles, Camera } from 'lucide-react'

// 页面路由映射
const PAGE_MAP: Record<string, string> = {
  home: '/',
  wardrobe: '/wardrobe',
  recommend: '/recommend',
  tryon: '/tryon',
}

// 路径到页面的反向映射
const PATH_TO_PAGE: Record<string, string> = Object.entries(PAGE_MAP).reduce(
  (acc, [page, path]) => {
    acc[path] = page
    return acc
  },
  {} as Record<string, string>
)

export interface NavItem {
  key: string
  label: string
  icon: React.ReactNode
  path: string
}

// 导航项配置
export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '首页', icon: <Shirt size={18} />, path: '/' },
  { key: 'wardrobe', label: '我的衣橱', icon: <Shirt size={18} />, path: '/wardrobe' },
  { key: 'recommend', label: '智能推荐', icon: <Sparkles size={18} />, path: '/recommend' },
  { key: 'tryon', label: '虚拟试穿', icon: <Camera size={18} />, path: '/tryon' },
]

export const useNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 从路径获取当前页面 key
  const activePage = useMemo(() => {
    return PATH_TO_PAGE[location.pathname] || 'home'
  }, [location.pathname])

  // 导航处理函数
  const handleNavigate = useCallback(
    (page: string) => {
      const path = PAGE_MAP[page] || '/'
      navigate(path)
    },
    [navigate]
  )

  // 获取导航项
  const navItems = useMemo(() => NAV_ITEMS, [])

  return {
    navItems,
    activePage,
    handleNavigate,
    PAGE_MAP,
  }
}