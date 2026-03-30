import { useState } from 'react'
import { Sparkles, SlidersHorizontal, RefreshCw, ChevronRight, CheckCircle } from 'lucide-react'
import { Button, Slider, Spin } from '@arco-design/web-react'
import OutfitCard from '../components/OutfitCard'

interface RecommendationPageProps {
    onNavigate?: (page: string) => void
}

// Mock outfit data
const DEFAULT_UTFITS = [
    {
        id: 1,
        title: '春日通勤简约风',
        occasion: '通勤',
        style: '简约',
        matchScore: 97,
        itemCount: 3,
        imageIndex: 0,
    },
    {
        id: 2,
        title: '周末休闲出游搭',
        occasion: '休闲',
        style: '随性',
        matchScore: 94,
        itemCount: 4,
        imageIndex: 1,
    },
    {
        id: 3,
        title: '约会精致优雅感',
        occasion: '约会',
        style: '优雅',
        matchScore: 91,
        itemCount: 3,
        imageIndex: 2,
    },
    {
        id: 4,
        title: '运动健身活力系',
        occasion: '运动',
        style: '运动',
        matchScore: 89,
        itemCount: 3,
        imageIndex: 3,
    },
    {
        id: 5,
        title: '商务正式沉稳风',
        occasion: '商务',
        style: '正式',
        matchScore: 95,
        itemCount: 4,
        imageIndex: 0,
    },
    {
        id: 6,
        title: '户外露营探索感',
        occasion: '户外',
        style: '休闲',
        matchScore: 88,
        itemCount: 5,
        imageIndex: 1,
    },
]

const OCCASIONS = ['全部场合', '通勤', '休闲', '约会', '运动', '商务', '户外']
const STYLES = ['全部风格', '简约', '随性', '优雅', '运动', '正式', '休闲']

const RecommendationPage = ({ onNavigate = () => {} }: RecommendationPageProps) => {
    const [outfits] = useState(DEFAULT_UTFITS)
    const [activeOccasion, setActiveOccasion] = useState('全部场合')
    const [activeStyle, setActiveStyle] = useState('全部风格')
    const [isGenerating, setIsGenerating] = useState(false)
    const [minScore, setMinScore] = useState(80)
    const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null)

    const filteredOutfits = outfits.filter(outfit => {
        const matchOccasion = activeOccasion === '全部场合' || outfit.occasion === activeOccasion
        const matchStyle = activeStyle === '全部风格' || outfit.style === activeStyle
        const matchScore = outfit.matchScore >= minScore
        return matchOccasion && matchStyle && matchScore
    })

    const handleGenerate = () => {
        setIsGenerating(true)
        console.log('开始生成 AI 搭配推荐...')
        setTimeout(() => {
            setIsGenerating(false)
            console.log('AI 搭配生成完成')
        }, 2000)
    }

    const handleSelectOutfit = (id: number) => {
        setSelectedOutfit(id === selectedOutfit ? null : id)
        console.log('选中搭配 ID:', id)
    }

    return (
        <div className="min-h-screen bg-background">
            <div style={{ width: '1440px', margin: '0 auto' }} className="px-12 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">智能推荐</h1>
                        <p className="text-muted-foreground text-sm">
                            AI 根据你的体型和偏好，从衣橱中智能匹配最佳搭配方案
                        </p>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleGenerate}
                        loading={isGenerating}
                        style={{
                            backgroundColor: 'var(--primary)',
                            borderColor: 'var(--primary)',
                            borderRadius: '999px',
                            padding: '0 24px',
                            height: '44px',
                            fontWeight: 600,
                        }}
                    >
                        <Sparkles className="w-4 h-4 mr-2 inline" />
                        {isGenerating ? 'AI 生成中...' : '重新生成'}
                    </Button>
                </div>

                <div className="flex gap-8">
                    {/* Filter Panel */}
                    <div className="w-64 flex-shrink-0">
                        {/* AI Generate Card */}
                        <div className="gradient-hero rounded-2xl p-5 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-primary-foreground" />
                                <span className="font-semibold text-primary-foreground text-sm">
                                    AI 智能搭配
                                </span>
                            </div>
                            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
                                基于你的体型数据和风格偏好，AI 已生成 {outfits.length}{' '}
                                套专属搭配方案
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="w-full py-2.5 rounded-xl text-sm font-medium text-foreground flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                                style={{ backgroundColor: 'var(--gold)' }}
                            >
                                <RefreshCw
                                    className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`}
                                />
                                {isGenerating ? '生成中...' : '刷新搭配'}
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
                            <div className="flex items-center gap-2 mb-4">
                                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-foreground">
                                    筛选条件
                                </span>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-medium text-muted-foreground block mb-2">
                                    穿搭场合
                                </label>
                                {OCCASIONS.map(occ => (
                                    <button
                                        key={occ}
                                        onClick={() => setActiveOccasion(occ)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 mb-1 ${
                                            activeOccasion === occ
                                                ? 'bg-secondary text-forest font-semibold'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        {occ}
                                    </button>
                                ))}
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-medium text-muted-foreground block mb-2">
                                    穿搭风格
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {STYLES.map(style => (
                                        <button
                                            key={style}
                                            onClick={() => setActiveStyle(style)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                                activeStyle === style
                                                    ? 'bg-forest text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                                            }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-3">
                                    最低匹配度：
                                    <span className="text-forest font-semibold">{minScore}%</span>
                                </label>
                                <Slider
                                    min={60}
                                    max={100}
                                    value={minScore}
                                    onChange={val => setMinScore(val as number)}
                                    style={
                                        {
                                            '--slider-color': 'var(--primary)',
                                        } as React.CSSProperties
                                    }
                                />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-card rounded-2xl p-5 shadow-card">
                            <h3 className="text-sm font-semibold text-foreground mb-3">快速操作</h3>
                            <button
                                onClick={() => onNavigate('wardrobe')}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 mb-1"
                            >
                                <span>管理衣橱</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onNavigate('profile')}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                            >
                                <span>更新体型数据</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Outfit Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-sm text-muted-foreground">
                                共找到{' '}
                                <span className="text-foreground font-semibold">
                                    {filteredOutfits.length}
                                </span>{' '}
                                套搭配方案
                            </span>
                            {selectedOutfit && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-forest" />
                                    <span className="text-sm text-forest font-medium">
                                        已选择搭配 #{selectedOutfit}
                                    </span>
                                </div>
                            )}
                        </div>

                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <Spin size={40} style={{ color: 'var(--primary)' }} />
                                <p className="text-muted-foreground text-sm mt-4">
                                    AI 正在为你生成专属搭配方案...
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    分析体型数据 · 匹配单品 · 生成效果图
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-5">
                                {filteredOutfits.map(outfit => (
                                    <div key={outfit.id} style={{ width: 'calc(33.333% - 14px)' }}>
                                        <OutfitCard
                                            id={outfit.id}
                                            title={outfit.title}
                                            occasion={outfit.occasion}
                                            style={outfit.style}
                                            matchScore={outfit.matchScore}
                                            itemCount={outfit.itemCount}
                                            imageIndex={outfit.imageIndex}
                                            onSelect={handleSelectOutfit}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecommendationPage
