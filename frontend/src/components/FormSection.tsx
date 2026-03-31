import React from 'react'

interface FormSectionProps {
    title: string
    description?: string
    children: React.ReactNode
}

export const FormSection: React.FC<FormSectionProps> = ({
    title,
    description,
    children,
}) => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">{children}</div>
        </div>
    )
}

export default FormSection