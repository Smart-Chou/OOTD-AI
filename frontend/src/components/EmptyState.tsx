import React from 'react'
import { Button } from '@arco-design/web-react'
import { Search, Package } from 'lucide-react'

interface EmptyStateProps {
    icon?: 'search' | 'package'
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
}

const icons = {
    search: Search,
    package: Package,
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'search',
    title,
    description,
    action,
}) => {
    const Icon = icons[icon]

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    {description}
                </p>
            )}
            {action && (
                <Button type="primary" onClick={() => action.onClick()}>
                    {action.label}
                </Button>
            )}
        </div>
    )
}

export default EmptyState