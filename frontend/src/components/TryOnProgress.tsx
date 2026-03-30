import { useEffect, useState } from 'react'
import { Sparkles, Cpu, Wand2, CheckCircle } from 'lucide-react'

interface TryOnProgressProps {
    isGenerating?: boolean
    progress?: number
    onComplete?: () => void
}

const STEPS = [
    { icon: 'Upload', label: '分析人体姿态', desc: '识别关键节点' },
    { icon: 'Cpu', label: 'AI 深度学习处理', desc: '服装融合建模' },
    { icon: 'Wand2', label: '生成试穿效果', desc: '细节渲染优化' },
    { icon: 'CheckCircle', label: '完成！', desc: '效果图已就绪' },
]

const TryOnProgress = ({
    isGenerating = false,
    progress = 0,
    onComplete = () => {},
}: TryOnProgressProps) => {
    const [dots, setDots] = useState('.')

    useEffect(() => {
        if (!isGenerating) return
        const interval = setInterval(() => {
            setDots(d => (d.length >= 3 ? '.' : d + '.'))
        }, 500)
        return () => clearInterval(interval)
    }, [isGenerating])

    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => onComplete(), 600)
        }
    }, [progress, onComplete])

    const currentStep = Math.floor((progress / 100) * STEPS.length)

    if (!isGenerating) return null

    return (
        <div data-cmp="TryOnProgress" className="w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        AI 正在生成试穿效果{dots}
                    </p>
                    <p className="text-xs text-muted-foreground">请耐心等待，大约需要 3-5 秒</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-xs text-muted-foreground">处理进度</span>
                    <span className="text-xs font-semibold text-primary">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                            width: `${progress}%`,
                            background:
                                'linear-gradient(90deg, var(--forest) 0%, var(--gold) 100%)',
                        }}
                    />
                </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3">
                {STEPS.map((step, i) => {
                    const isDone = i < currentStep
                    const isActive = i === currentStep && progress < 100
                    return (
                        <div
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                ${isDone ? 'bg-secondary opacity-60' : isActive ? 'bg-secondary border border-primary' : 'bg-muted opacity-40'}
              `}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${isDone ? 'bg-primary' : isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground/20'}
              `}
                            >
                                {isDone ? (
                                    <CheckCircle className="w-4 h-4 text-primary-foreground" />
                                ) : isActive ? (
                                    <Cpu className="w-4 h-4 text-primary-foreground" />
                                ) : (
                                    <Wand2 className="w-4 h-4 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <p
                                    className={`text-xs font-semibold ${isActive ? 'text-primary' : isDone ? 'text-foreground' : 'text-muted-foreground'}`}
                                >
                                    {step.label}
                                </p>
                                <p className="text-xs text-muted-foreground">{step.desc}</p>
                            </div>
                            {isActive && (
                                <div className="ml-auto flex gap-1">
                                    {[0, 1, 2].map(j => (
                                        <div
                                            key={j}
                                            className="w-1.5 h-1.5 rounded-full bg-primary"
                                            style={{
                                                animation: `bounce 0.8s ease-in-out ${j * 0.15}s infinite alternate`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <style>{`
        @keyframes bounce {
          from { transform: translateY(0); opacity: 0.5; }
          to { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
        </div>
    )
}

export default TryOnProgress
