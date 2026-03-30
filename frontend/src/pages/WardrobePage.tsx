import { useState, useEffect } from 'react'
import { Plus, Search, Grid3X3, List, Upload, Shirt } from 'lucide-react'
import {
    Button,
    Input,
    Empty,
    Modal,
    Form,
    Input as FormInput,
    Select,
} from '@arco-design/web-react'
import ClothingCard from '../components/ClothingCard'

interface WardrobePageProps {
    onNavigate?: (page: string) => void
}

// Mock clothing data - replace with API call
const DEFAULT_CLOTHING = [
    { id: 1, name: '白色简约衬衫', category: '上衣', color: '白色', season: '四季', imageIndex: 0 },
    {
        id: 2,
        name: '深绿色西装外套',
        category: '外套',
        color: '深绿',
        season: '秋冬',
        imageIndex: 1,
    },
    { id: 3, name: '米色直筒裤', category: '下装', color: '米色', season: '四季', imageIndex: 2 },
    { id: 4, name: '藏青针织毛衣', category: '上衣', color: '藏青', season: '秋冬', imageIndex: 3 },
    { id: 5, name: '黑色修身裤', category: '下装', color: '黑色', season: '四季', imageIndex: 4 },
    { id: 6, name: '格纹羊毛大衣', category: '外套', color: '格纹', season: '冬季', imageIndex: 5 },
    { id: 7, name: '白色运动T恤', category: '上衣', color: '白色', season: '夏季', imageIndex: 0 },
    { id: 8, name: '牛仔直筒裤', category: '下装', color: '蓝色', season: '四季', imageIndex: 1 },
]

const CATEGORIES = ['全部', '上衣', '下装', '外套', '鞋子', '配件']
const SEASONS = ['全部季节', '春季', '夏季', '秋冬', '四季']

const WardrobePage = ({ onNavigate = () => {} }: WardrobePageProps) => {
    const [clothing, setClothing] = useState(DEFAULT_CLOTHING)
    const [activeCategory, setActiveCategory] = useState('全部')
    const [activeSeason, setActiveSeason] = useState('全部季节')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showUpload, setShowUpload] = useState(false)

    const filteredClothes = clothing.filter(item => {
        const matchCategory = activeCategory === '全部' || item.category === activeCategory
        const matchSeason =
            activeSeason === '全部季节' || item.season === activeSeason || item.season === '四季'
        const matchSearch = item.name.includes(searchQuery) || item.category.includes(searchQuery)
        return matchCategory && matchSeason && matchSearch
    })

    const categoryCounts: Record<string, number> = { 全部: clothing.length }
    clothing.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
    })

    return (
        <div className="min-h-screen bg-background">
            <div style={{ width: '1440px', margin: '0 auto' }} className="px-12 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">我的衣橱</h1>
                        <p className="text-muted-foreground text-sm">
                            共 <span className="text-forest font-semibold">{clothing.length}</span>{' '}
                            件衣物， 智能分类管理你的全部单品
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowUpload(true)}
                            style={{
                                borderRadius: '999px',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <Upload className="w-4 h-4 mr-2 inline" />
                            上传衣物
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => onNavigate('recommend')}
                            style={{
                                backgroundColor: 'var(--primary)',
                                borderColor: 'var(--primary)',
                                borderRadius: '999px',
                            }}
                        >
                            <Shirt className="w-4 h-4 mr-2 inline" />
                            智能搭配
                        </Button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-52 flex-shrink-0">
                        {/* Category Filter */}
                        <div className="bg-card rounded-2xl p-4 shadow-card mb-4">
                            <h3 className="text-sm font-semibold text-foreground mb-3">衣物类别</h3>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mb-1 ${
                                        activeCategory === cat
                                            ? 'bg-secondary text-forest font-semibold'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    <span
                                        className={`text-xs rounded-full px-2 py-0.5 ${
                                            activeCategory === cat
                                                ? 'bg-forest text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {categoryCounts[cat] || 0}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Season Filter */}
                        <div className="bg-card rounded-2xl p-4 shadow-card">
                            <h3 className="text-sm font-semibold text-foreground mb-3">适用季节</h3>
                            {SEASONS.map(season => (
                                <button
                                    key={season}
                                    onClick={() => setActiveSeason(season)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mb-1 ${
                                        activeSeason === season
                                            ? 'bg-secondary text-forest font-semibold'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {season}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search & View Controls */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1">
                                <Input
                                    prefix={<Search className="w-4 h-4 text-muted-foreground" />}
                                    placeholder="搜索衣物名称、类别..."
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    style={{ borderRadius: '12px', height: '40px' }}
                                    allowClear
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        viewMode === 'grid'
                                            ? 'bg-card shadow-card text-forest'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        viewMode === 'list'
                                            ? 'bg-card shadow-card text-forest'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Clothes Grid */}
                        {filteredClothes.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {filteredClothes.map(item => (
                                    <div key={item.id} style={{ width: 'calc(25% - 12px)' }}>
                                        <ClothingCard
                                            id={item.id}
                                            name={item.name}
                                            category={item.category}
                                            color={item.color}
                                            season={item.season}
                                            imageIndex={item.imageIndex}
                                        />
                                    </div>
                                ))}
                                {/* Add new item card */}
                                <div
                                    style={{ width: 'calc(25% - 12px)' }}
                                    onClick={() => setShowUpload(true)}
                                    className="bg-muted border-2 border-dashed border-border rounded-xl h-52 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-secondary transition-all duration-200 group"
                                >
                                    <Plus className="w-8 h-8 text-muted-foreground group-hover:text-forest transition-colors" />
                                    <span className="text-sm text-muted-foreground group-hover:text-forest mt-2 transition-colors">
                                        添加新衣物
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-20">
                                <Empty
                                    description={
                                        <span
                                            style={{
                                                color: 'var(--muted-foreground)',
                                                fontSize: '14px',
                                            }}
                                        >
                                            没有找到符合条件的衣物
                                        </span>
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Modal */}
                {showUpload && (
                    <div
                        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowUpload(false)}
                    >
                        <div
                            className="bg-card rounded-2xl p-8 shadow-hover max-w-md w-full mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold text-foreground mb-2">上传衣物</h2>
                            <p className="text-muted-foreground text-sm mb-6">
                                上传照片后，AI 将自动识别衣物类型和颜色
                            </p>

                            <div className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary hover:bg-secondary transition-all duration-200 mb-6">
                                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                <p className="text-sm font-medium text-foreground">
                                    点击或拖拽上传图片
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    支持 JPG、PNG、HEIC 格式
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setShowUpload(false)}
                                    long
                                    style={{ borderRadius: '999px' }}
                                >
                                    取消
                                </Button>
                                <Button
                                    type="primary"
                                    long
                                    style={{
                                        backgroundColor: 'var(--primary)',
                                        borderColor: 'var(--primary)',
                                        borderRadius: '999px',
                                    }}
                                >
                                    确认上传
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WardrobePage
