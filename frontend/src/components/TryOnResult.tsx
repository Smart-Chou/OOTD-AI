import { useState, useEffect } from 'react'
import { Download, Share2, RefreshCw, Star, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface TryOnResultProps {
    originalUrl?: string
    resultUrl?: string
    clothingName?: string
    onRetry?: () => void
}

// Simulated result image using canvas-style gradient overlay
const RESULT_OVERLAYS = [
    'linear-gradient(135deg, rgba(45,80,60,0.15) 0%, rgba(196,168,122,0.2) 100%)',
    'linear-gradient(160deg, rgba(100,140,110,0.1) 0%, rgba(180,130,90,0.18) 100%)',
    'linear-gradient(120deg, rgba(196,168,122,0.12) 0%, rgba(45,80,60,0.2) 100%)',
]

const TryOnResult = ({
    originalUrl = '',
    resultUrl = '',
    clothingName = '选中服装',
    onRetry = () => {},
}: TryOnResultProps) => {
    const [sliderPos, setSliderPos] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const [overlayIndex] = useState(0)
    const [rating, setRating] = useState(0)
    const [saved, setSaved] = useState(false)
    const [showHint, setShowHint] = useState(true)

    // Auto-hide gesture hint after 3 seconds
    useEffect(() => {
        console.log('TryOnResult: 手势提示显示，3秒后自动消失')
        const timer = setTimeout(() => {
            console.log('TryOnResult: 手势提示自动消失')
            setShowHint(false)
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    // Hide hint immediately when user starts dragging
    const handleDragStart = () => {
        setIsDragging(true)
        if (showHint) {
            console.log('TryOnResult: 用户开始拖动，手势提示消失')
            setShowHint(false)
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        setSliderPos(Math.max(5, Math.min(95, x)))
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
        setSliderPos(Math.max(5, Math.min(95, x)))
    }

    const handleSave = () => {
        setSaved(true)
        console.log('TryOnResult: 保存效果图')
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div data-cmp="TryOnResult" className="w-full">
            {/* Title */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-bold text-foreground">试穿效果对比</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">拖动中间分割线查看效果</p>
                </div>
                <button
                    onClick={onRetry}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-200"
                >
                    <RefreshCw className="w-3 h-3" />
                    重新生成
                </button>
            </div>

            {/* Side-by-side comparison + Slider */}
            <div
                className="relative w-full rounded-2xl overflow-hidden shadow-custom select-none"
                style={{ aspectRatio: '3/4' }}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setIsDragging(false)}
            >
                {/* Original photo (full width behind) */}
                <div className="absolute inset-0">
                    {originalUrl ? (
                        <img
                            src={originalUrl}
                            alt="原始照片"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-4xl">👤</span>
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-card/80 backdrop-blur-sm">
                        <span className="text-xs font-medium text-foreground">原始照片</span>
                    </div>
                </div>

                {/* Result photo (clipped to right portion) */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                >
                    {originalUrl ? (
                        <div className="relative w-full h-full">
                            <img
                                src={originalUrl}
                                alt="试穿效果"
                                className="w-full h-full object-cover"
                            />
                            {/* Simulated AI clothing overlay */}
                            <div
                                className="absolute inset-0"
                                style={{ background: RESULT_OVERLAYS[overlayIndex] }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        'radial-gradient(ellipse 60% 40% at 50% 35%, rgba(196,168,122,0.25) 0%, transparent 70%)',
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className="text-4xl">✨</span>
                        </div>
                    )}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-primary/90 backdrop-blur-sm">
                        <span className="text-xs font-medium text-primary-foreground">
                            AI 试穿 · {clothingName}
                        </span>
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 z-10 flex items-center"
                    style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                >
                    {/* Vertical line */}
                    <div className="w-0.5 h-full bg-card/80" />
                    {/* Handle circle */}
                    <div
                        className="absolute w-10 h-10 rounded-full bg-card shadow-custom flex items-center justify-center cursor-ew-resize"
                        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="flex items-center gap-0.5">
                            <ChevronLeft className="w-3 h-3 text-foreground" />
                            <ChevronRight className="w-3 h-3 text-foreground" />
                        </div>
                    </div>

                    {/* Gesture Hint */}
                    {showHint && (
                        <div
                            className="gesture-hint-container absolute flex flex-col items-center pointer-events-none"
                            style={{
                                left: '50%',
                                bottom: 'calc(50% + 32px)',
                                transform: 'translateX(-50%)',
                                zIndex: 20,
                            }}
                        >
                            <div className="mb-2 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-card/90 backdrop-blur-sm text-foreground shadow-custom">
                                左右拖动对比
                            </div>
                            <div className="gesture-hint-arrows flex items-center gap-1 mb-2">
                                <ChevronLeft className="w-4 h-4 text-primary" />
                                <ChevronLeft className="w-3 h-3 text-primary opacity-60" />
                                <span className="w-1" />
                                <ChevronRight className="w-3 h-3 text-primary opacity-60" />
                                <ChevronRight className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Zoom hint */}
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-3.5 h-3.5 text-foreground" />
                </div>
            </div>

            {/* Static Side-by-Side Below */}
            <div className="flex gap-3 mt-4">
                <div
                    className="flex-1 rounded-xl overflow-hidden border border-border"
                    style={{ aspectRatio: '2/3' }}
                >
                    {originalUrl ? (
                        <img src={originalUrl} alt="原图" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                        </div>
                    )}
                </div>
                <div
                    className="flex-1 rounded-xl overflow-hidden border border-primary"
                    style={{ aspectRatio: '2/3' }}
                >
                    {originalUrl ? (
                        <div className="relative w-full h-full">
                            <img
                                src={originalUrl}
                                alt="试穿效果"
                                className="w-full h-full object-cover"
                            />
                            <div
                                className="absolute inset-0"
                                style={{ background: RESULT_OVERLAYS[overlayIndex] }}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className="text-2xl">✨</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex mt-2">
                <p className="flex-1 text-center text-xs text-muted-foreground">原图</p>
                <p className="flex-1 text-center text-xs text-primary font-medium">试穿效果</p>
            </div>

            {/* Rating */}
            <div className="mt-5 p-4 rounded-xl bg-muted">
                <p className="text-xs font-semibold text-foreground mb-2">
                    对这件服装的试穿效果满意吗？
                </p>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform duration-100 active:scale-125"
                        >
                            <Star
                                className={`w-6 h-6 ${rating >= star ? 'text-accent fill-accent' : 'text-border'}`}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground self-center">
                            {['', '不太满意', '一般', '还不错', '很满意', '非常满意！'][rating]}
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleSave}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200
            ${saved ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
                >
                    <Download className="w-4 h-4" />
                    {saved ? '已保存！' : '保存效果图'}
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-200">
                    <Share2 className="w-4 h-4" />
                    分享
                </button>
            </div>
        </div>
    )
}

export default TryOnResult
