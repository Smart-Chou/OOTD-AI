import { Sparkles, Shirt, Camera, Users, ChevronRight, Star, Zap, ArrowRight } from 'lucide-react'
import { Button, Tag } from '@arco-design/web-react'

interface HomePageProps {
    onNavigate?: (page: string) => void
}

const FEATURES = [
    {
        icon: 'Sparkles',
        title: 'AI 智能推荐',
        desc: '基于你的体型、肤色和偏好，AI 生成专属穿搭方案，每天提供不同的搭配灵感。',
        tag: '核心功能',
    },
    {
        icon: 'Camera',
        title: '虚拟试穿',
        desc: '上传衣物照片，AI 为你生成虚拟试穿效果图，购买前预览上身效果，降低退货率。',
        tag: 'AI 生成',
    },
    {
        icon: 'Shirt',
        title: '衣橱管理',
        desc: '数字化管理你的全部衣物，智能分类标签，快速找到合适单品，盘活衣橱存量。',
        tag: '效率工具',
    },
    {
        icon: 'Users',
        title: '社区分享',
        desc: '与时尚达人互动，分享你的穿搭方案，发现更多灵感，建立个人风格档案。',
        tag: '社交功能',
    },
]

const TESTIMONIALS = [
    {
        name: 'Sarah L.',
        role: '设计师',
        content: '自从用了穿搭助手，每天早上选衣服只要 2 分钟。AI 推荐真的很懂我的风格！',
        rating: 5,
    },
    {
        name: 'James W.',
        role: '销售经理',
        content: '体型数据录入后，推荐的尺码非常准确，网购退货率从 40% 降到了 5%。',
        rating: 5,
    },
    {
        name: 'Emma Z.',
        role: '大学生',
        content: '虚拟试穿功能太实用了！终于不用担心买回来不合适的问题了。',
        rating: 5,
    },
]

const OCCASIONS = ['日常休闲', '职场通勤', '约会出行', '运动健身', '正式场合', '户外露营']

const FeatureIcon = ({ name }: { name: string }) => {
    if (name === 'Sparkles') return <Sparkles className="w-6 h-6" />
    if (name === 'Camera') return <Camera className="w-6 h-6" />
    if (name === 'Shirt') return <Shirt className="w-6 h-6" />
    if (name === 'Users') return <Users className="w-6 h-6" />
    return <Sparkles className="w-6 h-6" />
}

const HomePage = ({ onNavigate = () => {} }: HomePageProps) => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="gradient-hero py-24 container-main">
                    <div className="flex items-center gap-16">
                        {/* Left Content */}
                        <div className="flex-1 max-w-xl">
                            <div className="flex items-center gap-2 mb-6">
                                <Tag
                                    color="gold"
                                    style={{ borderRadius: '999px', padding: '4px 12px' }}
                                >
                                    <span className="text-xs font-medium">✨ AI 驱动穿搭革命</span>
                                </Tag>
                            </div>
                            <h1 className="text-5xl font-bold text-primary-foreground leading-tight mb-6">
                                让 AI 帮你
                                <br />
                                <span style={{ color: 'var(--gold-light)' }}>穿出自信</span>
                            </h1>
                            <p
                                className="text-lg leading-relaxed mb-8"
                                style={{ color: 'rgba(255,255,255,0.75)' }}
                            >
                                输入你的体型数据，上传衣物照片，AI 即刻生成专属穿搭方案。每天用 2
                                分钟，轻松搞定全周造型。
                            </p>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => onNavigate('recommend')}
                                    style={{
                                        backgroundColor: 'var(--gold)',
                                        borderColor: 'var(--gold)',
                                        color: 'var(--foreground)',
                                        borderRadius: '999px',
                                        padding: '0 28px',
                                        height: '48px',
                                        fontWeight: 600,
                                        fontSize: '15px',
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 mr-2 inline" />
                                    立即体验
                                </Button>
                                <Button
                                    size="large"
                                    onClick={() => onNavigate('wardrobe')}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'rgba(255,255,255,0.4)',
                                        color: 'rgba(255,255,255,0.9)',
                                        borderRadius: '999px',
                                        padding: '0 28px',
                                        height: '48px',
                                        fontWeight: 500,
                                        fontSize: '15px',
                                    }}
                                >
                                    管理衣橱
                                    <ChevronRight className="w-4 h-4 ml-1 inline" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="flex-1 flex justify-end">
                            <div className="relative w-80 h-96">
                                {/* Phone mockup */}
                                <div
                                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-hover"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}
                                >
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-primary-foreground opacity-50"></div>
                                            <div className="flex-1 h-1.5 rounded-full bg-primary-foreground opacity-20"></div>
                                        </div>
                                        {/* Outfit cards simulation */}
                                        {[0, 1, 2].map(i => (
                                            <div
                                                key={i}
                                                className="mb-3 p-3 rounded-xl"
                                                style={{ background: 'rgba(255,255,255,0.15)' }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.15)',
                                                        }}
                                                    >
                                                        {['👔', '👗', '🧥'][i]}
                                                    </div>
                                                    <div>
                                                        <div className="h-2.5 w-24 rounded-full bg-primary-foreground opacity-60 mb-1.5"></div>
                                                        <div className="h-2 w-16 rounded-full bg-primary-foreground opacity-30"></div>
                                                    </div>
                                                    <div className="ml-auto flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-primary-foreground opacity-80 fill-current" />
                                                        <span className="text-xs text-primary-foreground opacity-70">
                                                            {[97, 92, 88][i]}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div
                                            className="mt-4 p-3 rounded-xl text-center"
                                            style={{ background: 'rgba(196,168,122,0.3)' }}
                                        >
                                            <span className="text-xs text-primary-foreground opacity-80">
                                                ✨ AI 已为你生成 3 套搭配
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-card border-b border-border">
                <div className="container-main py-10">
                    <div className="flex items-center justify-around">
                        {[
                            { title: '注册用户', value: 128000, suffix: '+', prefix: '' },
                            { title: '每日推荐', value: 50000, suffix: '+', prefix: '' },
                            { title: '搭配成功率', value: 96, suffix: '%', prefix: '' },
                            { title: '品牌尺码库', value: 2000, suffix: '+', prefix: '' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-bold text-forest">
                                    {stat.value.toLocaleString()}
                                    {stat.suffix}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {stat.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 container-main">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 tag-pill mb-4 text-sm">
                        <Zap className="w-3.5 h-3.5" />
                        核心功能
                    </div>
                    <h2 className="section-title text-3xl mb-3">专业穿搭，触手可及</h2>
                    <p className="text-muted-foreground text-base max-w-md mx-auto">
                        四大核心功能，从体型管理到 AI 生成，全方位解决穿搭烦恼
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-2xl p-6 shadow-card hover-lift cursor-pointer border border-border"
                        >
                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 text-forest">
                                <FeatureIcon name={feature.icon} />
                            </div>
                            <div className="tag-pill text-xs mb-3 inline-block">{feature.tag}</div>
                            <h3 className="font-semibold text-foreground text-base mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Occasions Section */}
            <section className="py-16 container-main bg-muted">
                <div className="text-center mb-10">
                    <h2 className="section-title text-2xl mb-2">覆盖全场景穿搭</h2>
                    <p className="text-muted-foreground text-sm">
                        无论什么场合，AI 都能为你搭配出最合适的造型
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                    {OCCASIONS.map((occasion, i) => (
                        <button
                            key={i}
                            onClick={() => onNavigate('recommend')}
                            className="px-6 py-3 rounded-full bg-card text-sm font-medium text-foreground border border-border shadow-card hover-lift transition-all"
                        >
                            {occasion}
                        </button>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 container-main">
                <div className="text-center mb-12">
                    <h2 className="section-title text-2xl mb-2">用户真实评价</h2>
                    <p className="text-muted-foreground text-sm">来自真实用户的穿搭故事</p>
                </div>

                <div className="flex gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-card rounded-2xl p-6 shadow-card border border-border"
                        >
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(t.rating)].map((_, si) => (
                                    <Star
                                        key={si}
                                        className="w-4 h-4 text-gold fill-current"
                                        style={{ color: 'var(--gold)' }}
                                    />
                                ))}
                            </div>
                            <p className="text-foreground text-sm leading-relaxed mb-4">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-base font-bold text-forest">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-foreground">
                                        {t.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-hero container-main">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                        准备好改变你的穿搭了吗？
                    </h2>
                    <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        加入超过 12 万用户，开始你的 AI 穿搭之旅
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => onNavigate('profile')}
                        style={{
                            backgroundColor: 'var(--gold)',
                            borderColor: 'var(--gold)',
                            color: 'var(--foreground)',
                            borderRadius: '999px',
                            padding: '0 40px',
                            height: '52px',
                            fontWeight: 600,
                            fontSize: '16px',
                        }}
                    >
                        免费开始使用
                        <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-8 container-main">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">穿搭助手</span>
                        <span className="text-xs text-gold font-medium">AI</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © 2024 穿搭助手 · AI 智能穿搭推荐平台
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">
                            隐私政策
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            服务条款
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            联系我们
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage
