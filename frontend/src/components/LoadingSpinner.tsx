import React from 'react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
}

// 骨架屏变体
const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text,
}) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
            <div
                className={`${sizes[size]} border-2 border-muted border-t-primary rounded-full animate-spin`}
            />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
    )
}

// 通用骨架屏
interface SkeletonProps {
    className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div
            className={`animate-pulse bg-muted rounded ${className}`}
        />
    )
}

// 卡片骨架屏
export const CardSkeleton: React.FC = () => {
    return (
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    )
}

// 网格骨架屏
interface GridSkeletonProps {
    count?: number
    viewMode?: 'grid' | 'list'
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
    count = 8,
    viewMode = 'grid',
}) => {
    return (
        <div
            className={
                viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-2'
            }
        >
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    )
}

// 列表骨架屏
export const ListSkeleton: React.FC = () => {
    return (
        <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border"
                >
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// 文本骨架屏
export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
                />
            ))}
        </div>
    )
}

export default LoadingSpinner