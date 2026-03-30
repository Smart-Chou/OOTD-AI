import { useState, useEffect, useRef } from 'react'
import {
    Plus,
    Search,
    Grid3X3,
    List,
    Upload,
    Shirt,
    Download,
    FileUp,
    AlertCircle,
} from 'lucide-react'
import { Button, Input, Empty, Form, Input as FormInput, Message } from '@arco-design/web-react'
import ClothingCard from '../components/ClothingCard'
import { wardrobeApi, bulkApi } from '../services/api'

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
    const [showBulkModal, setShowBulkModal] = useState(false)
    const [csvInput, setCsvInput] = useState('')
    const [importing, setImporting] = useState(false)
    const [importResult, setImportResult] = useState<{
        success: boolean
        imported_count: number
        total_errors: number
        errors: string[]
    } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load clothing from API on mount
    useEffect(() => {
        loadClothing()
    }, [])

    const loadClothing = async () => {
        try {
            const response = await wardrobeApi.getClothingList()
            if (response.data && response.data.length > 0) {
                // Convert API response to local format
                const categoryMap: Record<string, string> = {
                    tops: '上衣',
                    bottoms: '下装',
                    outerwear: '外套',
                    dresses: '连衣裙',
                    shoes: '鞋子',
                    accessories: '配件',
                }
                const seasonMap: Record<string, string> = {
                    spring: '春季',
                    summer: '夏季',
                    fall: '秋冬',
                    winter: '冬季',
                }
                const converted = response.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: categoryMap[item.category] || item.category,
                    color: item.color || '',
                    season: seasonMap[item.season] || item.season || '',
                    imageIndex: 0,
                }))
                setClothing(converted)
            }
        } catch (error) {
            console.log('Using default clothing data')
        }
    }

    const handleImport = async () => {
        if (!csvInput.trim()) {
            Message.warning('请输入CSV数据')
            return
        }
        setImporting(true)
        setImportResult(null)
        try {
            const response = await bulkApi.importClothing(csvInput)
            setImportResult(response.data)
            if (response.data.success) {
                Message.success(`成功导入 ${response.data.imported_count} 件衣物`)
                loadClothing()
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || '导入失败'
            Message.error(errorMsg)
        } finally {
            setImporting(false)
        }
    }

    const handleExport = async (category?: string) => {
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
    }

    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = event => {
            const csvData = event.target?.result as string
            setCsvInput(csvData)
        }
        reader.readAsText(file)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

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
                            onClick={() => setShowBulkModal(true)}
                            style={{
                                borderRadius: '999px',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <FileUp className="w-4 h-4 mr-2 inline" />
                            批量导入
                        </Button>
                        <Button
                            onClick={() => handleExport()}
                            style={{
                                borderRadius: '999px',
                                borderColor: 'var(--border)',
                            }}
                        >
                            <Download className="w-4 h-4 mr-2 inline" />
                            导出CSV
                        </Button>
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

                {/* Bulk Import Modal */}
                {showBulkModal && (
                    <div
                        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowBulkModal(false)}
                    >
                        <div
                            className="bg-card rounded-2xl p-8 shadow-hover max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold text-foreground mb-2">批量导入衣物</h2>
                            <p className="text-muted-foreground text-sm mb-4">
                                请输入CSV格式数据，或上传CSV文件
                            </p>

                            {/* CSV Template */}
                            <div className="bg-muted rounded-xl p-4 mb-4">
                                <h4 className="text-sm font-semibold text-foreground mb-2">
                                    CSV格式 (header必填)
                                </h4>
                                <code className="text-xs text-muted-foreground block">
                                    name,category,color,season,brand,size,tags
                                </code>
                                <h4 className="text-sm font-semibold text-foreground mt-3 mb-2">
                                    示例数据
                                </h4>
                                <code className="text-xs text-muted-foreground block whitespace-pre-wrap">
                                    name,category,color,season,brand,size,tags
                                    T恤,TOPS,红色,spring,Uniqlo,M,休闲
                                    牛仔裤,BOTTOMS,蓝色,fall,Levis,30,百搭
                                </code>
                                <h4 className="text-sm font-semibold text-foreground mt-3 mb-2">
                                    有效分类
                                </h4>
                                <code className="text-xs text-muted-foreground block">
                                    TOPS, BOTTOMS, OUTERWEAR, DRESSES, SHOES, ACCESSORIES
                                </code>
                            </div>

                            {/* File Input */}
                            <div className="mb-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileImport}
                                    className="hidden"
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ borderRadius: '999px' }}
                                >
                                    <FileUp className="w-4 h-4 mr-2 inline" />
                                    选择CSV文件
                                </Button>
                            </div>

                            {/* CSV Input */}
                            <Form.Item label="或粘贴CSV数据">
                                <FormInput.TextArea
                                    value={csvInput}
                                    onChange={setCsvInput}
                                    placeholder="name,category,color,season,brand,size,tags&#10;T恤,TOPS,红色,spring,Uniqlo,M,休闲"
                                    style={{ fontFamily: 'monospace', fontSize: '12px' }}
                                    rows={8}
                                />
                            </Form.Item>

                            {/* Import Result */}
                            {importResult && (
                                <div
                                    className={`rounded-xl p-4 mb-4 ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle
                                            className={`w-4 h-4 ${importResult.success ? 'text-green-600' : 'text-red-600'}`}
                                        />
                                        <span
                                            className={`font-semibold ${importResult.success ? 'text-green-700' : 'text-red-700'}`}
                                        >
                                            {importResult.success ? '导入成功' : '导入部分成功'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        成功导入 {importResult.imported_count} 件衣物
                                        {importResult.total_errors > 0 &&
                                            `，${importResult.total_errors} 个错误`}
                                    </p>
                                    {importResult.errors.length > 0 && (
                                        <div className="mt-2 text-xs text-red-600 max-h-20 overflow-y-auto">
                                            {importResult.errors.map((err, idx) => (
                                                <div key={idx}>{err}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        setShowBulkModal(false)
                                        setCsvInput('')
                                        setImportResult(null)
                                    }}
                                    long
                                    style={{ borderRadius: '999px' }}
                                >
                                    取消
                                </Button>
                                <Button
                                    type="primary"
                                    loading={importing}
                                    onClick={handleImport}
                                    long
                                    style={{
                                        backgroundColor: 'var(--primary)',
                                        borderColor: 'var(--primary)',
                                        borderRadius: '999px',
                                    }}
                                >
                                    开始导入
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
