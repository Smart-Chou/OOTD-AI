import React, { useState } from 'react'
import { Heart, Share2, Star } from 'lucide-react'

interface OutfitCardProps {
    id?: number
    title?: string
    occasion?: string
    style?: string
    matchScore?: number
    itemCount?: number
    imageIndex?: number
    liked?: boolean
    onLike?: (id: number) => void
    onShare?: (id: number) => void
    onSelect?: (id: number) => void
}

const OUTFIT_GRADIENTS = [
    'linear-gradient(160deg, rgba(240, 228, 200, 1) 0%, rgba(200, 180, 155, 1) 50%, rgba(170, 145, 120, 1) 100%)',
    'linear-gradient(160deg, rgba(210, 230, 220, 1) 0%, rgba(160, 195, 175, 1) 50%, rgba(100, 145, 120, 1) 100%)',
    'linear-gradient(160deg, rgba(230, 215, 200, 1) 0%, rgba(195, 170, 150, 1) 50%, rgba(155, 130, 105, 1) 100%)',
    'linear-gradient(160deg, rgba(225, 215, 235, 1) 0%, rgba(185, 165, 200, 1) 50%, rgba(145, 120, 165, 1) 100%)',
]

const OutfitCard = ({
    id = 1,
    title = '春日清新通勤搭',
    occasion = '通勤',
    style = '简约',
    matchScore = 95,
    itemCount = 3,
    imageIndex = 0,
    liked = false,
    onLike = () => {},
    onShare = () => {},
    onSelect = () => {},
}: OutfitCardProps) => {
    const [isLiked, setIsLiked] = useState(liked)

    const gradient = OUTFIT_GRADIENTS[imageIndex % OUTFIT_GRADIENTS.length]

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsLiked(!isLiked)
        onLike(id)
    }

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation()
        onShare(id)
    }

    return (
        <div
            data-cmp="OutfitCard"
            className="bg-card rounded-2xl overflow-hidden shadow-card hover-lift cursor-pointer"
            onClick={() => onSelect(id)}
        >
            {/* Outfit Preview */}
            <div className="relative h-64 flex items-end p-4" style={{ background: gradient }}>
                {/* Clothes layout simulation */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 opacity-70">
                        <span className="text-4xl">👔</span>
                        <span className="text-3xl">👖</span>
                        <span className="text-2xl">👟</span>
                    </div>
                </div>

                {/* Match Score Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1.5 bg-card rounded-full shadow-card">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span className="text-xs font-bold text-foreground">{matchScore}%</span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                        onClick={handleLike}
                        className="w-8 h-8 rounded-full bg-card flex items-center justify-center shadow-card hover:scale-110 transition-transform duration-200"
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors duration-200 ${
                                isLiked
                                    ? 'fill-destructive text-destructive'
                                    : 'text-muted-foreground'
                            }`}
                        />
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-8 h-8 rounded-full bg-card flex items-center justify-center shadow-card hover:scale-110 transition-transform duration-200"
                    >
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className="tag-pill">{occasion}</span>
                    <span className="tag-pill">{style}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">{itemCount} 件单品</span>
                    <button className="text-xs font-medium text-forest hover:opacity-80 transition-opacity">
                        查看详情 →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OutfitCard
