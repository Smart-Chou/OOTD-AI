import { useState } from 'react'
import { Check, Tag } from 'lucide-react'

export interface ClothingItem {
    id: string
    name: string
    brand: string
    category: string
    color: string
    emoji: string
    tag: string
}

interface ClothingSelectorProps {
    selectedId?: string
    onSelect?: (item: ClothingItem) => void
}

const CLOTHING_LIST: ClothingItem[] = [
    {
        id: 'c1',
        name: '白色基础T恤',
        brand: 'UNIQLO',
        category: '上衣',
        color: 'bg-secondary',
        emoji: '👕',
        tag: '基础款',
    },
    {
        id: 'c2',
        name: '黑色修身西装',
        brand: 'ZARA',
        category: '外套',
        color: 'bg-foreground',
        emoji: '🧥',
        tag: '正式',
    },
    {
        id: 'c3',
        name: '米色针织毛衣',
        brand: 'COS',
        category: '上衣',
        color: 'bg-accent',
        emoji: '🧶',
        tag: '温柔系',
    },
    {
        id: 'c4',
        name: '牛仔直筒裤',
        brand: "Levi's",
        category: '裤装',
        color: 'bg-primary',
        emoji: '👖',
        tag: '休闲',
    },
    {
        id: 'c5',
        name: '碎花连衣裙',
        brand: 'MANGO',
        category: '裙装',
        color: 'bg-secondary',
        emoji: '👗',
        tag: '清新',
    },
    {
        id: 'c6',
        name: '格纹短裙',
        brand: 'H&M',
        category: '裙装',
        color: 'bg-muted',
        emoji: '🪄',
        tag: '学院',
    },
    {
        id: 'c7',
        name: 'oversize卫衣',
        brand: 'Champion',
        category: '上衣',
        color: 'bg-muted',
        emoji: '👚',
        tag: '街头',
    },
    {
        id: 'c8',
        name: '皮质机车夹克',
        brand: 'AllSaints',
        category: '外套',
        color: 'bg-accent-foreground',
        emoji: '🧣',
        tag: '酷感',
    },
]

const CATEGORIES = ['全部', '上衣', '外套', '裤装', '裙装']

const ClothingSelector = ({ selectedId = '', onSelect = () => {} }: ClothingSelectorProps) => {
    const [activeCategory, setActiveCategory] = useState('全部')

    const filtered =
        activeCategory === '全部'
            ? CLOTHING_LIST
            : CLOTHING_LIST.filter(c => c.category === activeCategory)

    return (
        <div data-cmp="ClothingSelector" className="w-full">
            <p className="text-sm font-semibold text-foreground mb-3">选择要试穿的衣物</p>

            {/* Category Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border
              ${
                  activeCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary'
              }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Clothing Grid */}
            <div className="flex flex-col gap-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filtered.map(item => {
                    const isSelected = selectedId === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left w-full
                ${
                    isSelected
                        ? 'border-primary bg-secondary shadow-custom'
                        : 'border-border bg-card hover:border-primary hover:bg-muted'
                }`}
                        >
                            {/* Emoji Icon */}
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 bg-muted`}
                            >
                                {item.emoji}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}
                                >
                                    {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-muted-foreground">
                                        {item.brand}
                                    </span>
                                    <span className="text-xs text-muted-foreground">·</span>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Tag className="w-3 h-3" />
                                        {item.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Check Mark */}
                            {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ClothingSelector
export { CLOTHING_LIST }
