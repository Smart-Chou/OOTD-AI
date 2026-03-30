import React, { useState } from 'react'
import {
    User,
    Settings,
    Bell,
    Shield,
    LogOut,
    ChevronRight,
    Award,
    TrendingUp,
    Heart,
} from 'lucide-react'
import { Button, Avatar, Progress, Tabs } from '@arco-design/web-react'
import BodyDataForm from '../components/BodyDataForm'

interface ProfilePageProps {
    onNavigate?: (page: string) => void
}

const ACHIEVEMENTS = [
    { icon: 'Award', label: '穿搭达人', desc: '完成 10 套搭配', unlocked: true },
    { icon: 'TrendingUp', label: '时尚先锋', desc: '分享 5 次穿搭', unlocked: true },
    { icon: 'Heart', label: '品味生活', desc: '收藏 20 套方案', unlocked: false },
    { icon: 'User', label: '完美体型', desc: '录入完整数据', unlocked: true },
]

const RECENT_OUTFITS = [
    { title: '通勤简约风', date: '今天', score: 97 },
    { title: '周末休闲搭', date: '昨天', score: 94 },
    { title: '约会精致感', date: '3天前', score: 91 },
]

const MENU_ITEMS = [
    { icon: 'Bell', label: '消息通知', badge: 3 },
    { icon: 'Shield', label: '账号安全', badge: 0 },
    { icon: 'Settings', label: '偏好设置', badge: 0 },
]

const MenuIcon = ({ name }: { name: string }) => {
    if (name === 'Bell') return <Bell className="w-4 h-4" />
    if (name === 'Shield') return <Shield className="w-4 h-4" />
    if (name === 'Settings') return <Settings className="w-4 h-4" />
    return <Settings className="w-4 h-4" />
}

const AchievementIcon = ({ name }: { name: string }) => {
    if (name === 'Award') return <Award className="w-5 h-5" />
    if (name === 'TrendingUp') return <TrendingUp className="w-5 h-5" />
    if (name === 'Heart') return <Heart className="w-5 h-5" />
    if (name === 'User') return <User className="w-5 h-5" />
    return <Award className="w-5 h-5" />
}

const ProfilePage = ({ onNavigate = () => {} }: ProfilePageProps) => {
    const [activeTab, setActiveTab] = useState('overview')

    const handleSaveBodyData = (data: unknown) => {
        console.log('保存体型数据:', data)
    }

    return (
        <div className="min-h-screen bg-background">
            <div style={{ width: '1440px', margin: '0 auto' }} className="px-12 py-8">
                <div className="flex gap-8">
                    {/* Left Profile Card */}
                    <div className="w-72 flex-shrink-0">
                        {/* User Card */}
                        <div className="bg-card rounded-2xl p-6 shadow-card mb-4 text-center">
                            <div className="relative inline-block mb-4">
                                <Avatar size={80} style={{ backgroundColor: 'var(--primary)' }}>
                                    <span className="text-2xl text-primary-foreground">S</span>
                                </Avatar>
                                <div
                                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--gold)' }}
                                >
                                    <Award className="w-3 h-3 text-foreground" />
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-foreground">Sarah L.</h2>
                            <p className="text-sm text-muted-foreground mb-4">穿搭探索者 · 北京</p>

                            {/* Profile Completion */}
                            <div className="text-left mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">
                                        资料完善度
                                    </span>
                                    <span className="text-xs font-semibold text-forest">78%</span>
                                </div>
                                <Progress
                                    percent={78}
                                    showText={false}
                                    style={
                                        {
                                            '--color-primary-6': 'var(--primary)',
                                        } as React.CSSProperties
                                    }
                                />
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center justify-around pt-4 border-t border-border">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-foreground">24</div>
                                    <div className="text-xs text-muted-foreground">搭配数</div>
                                </div>
                                <div className="w-px h-8 bg-border"></div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-foreground">8</div>
                                    <div className="text-xs text-muted-foreground">衣物件</div>
                                </div>
                                <div className="w-px h-8 bg-border"></div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-foreground">3</div>
                                    <div className="text-xs text-muted-foreground">成就</div>
                                </div>
                            </div>
                        </div>

                        {/* Body Data Summary */}
                        <div className="bg-card rounded-2xl p-5 shadow-card mb-4">
                            <h3 className="text-sm font-semibold text-foreground mb-4">体型数据</h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    { icon: 'Ruler', label: '身高', value: '168 cm' },
                                    { icon: 'Weight', label: '体重', value: '55 kg' },
                                    { icon: 'User', label: '体型', value: '标准型' },
                                    { icon: 'Calendar', label: '年龄', value: '26 岁' },
                                ].map(item => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-medium text-foreground">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="bg-card rounded-2xl p-4 shadow-card">
                            {MENU_ITEMS.map(item => (
                                <button
                                    key={item.label}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted transition-all duration-200 group mb-1"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-forest transition-colors">
                                            <MenuIcon name={item.icon} />
                                        </div>
                                        <span className="text-sm text-foreground">
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.badge > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-destructive text-primary-foreground text-xs flex items-center justify-center">
                                                {item.badge}
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </button>
                            ))}
                            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-all duration-200 text-destructive mt-2">
                                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                <span className="text-sm">退出登录</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1">
                        <Tabs
                            activeTab={activeTab}
                            onChange={setActiveTab}
                            style={{ '--color-primary-6': 'var(--primary)' } as React.CSSProperties}
                        >
                            <Tabs.TabPane key="overview" title="概览">
                                {/* Recent Outfits */}
                                <div className="bg-card rounded-2xl p-6 shadow-card mb-5">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-semibold text-foreground">最近搭配</h3>
                                        <button
                                            onClick={() => onNavigate('recommend')}
                                            className="text-sm text-forest hover:opacity-80 transition-opacity"
                                        >
                                            查看全部 →
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {RECENT_OUTFITS.map((outfit, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-secondary transition-all duration-200 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                                        style={{ background: 'var(--gold-light)' }}
                                                    >
                                                        👔
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-foreground">
                                                            {outfit.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {outfit.date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-forest">
                                                        {outfit.score}%
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        匹配度
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="bg-card rounded-2xl p-6 shadow-card">
                                    <h3 className="font-semibold text-foreground mb-5">我的成就</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {ACHIEVEMENTS.map((ach, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 min-w-36 p-4 rounded-xl border transition-all duration-200 ${
                                                    ach.unlocked
                                                        ? 'border-border bg-muted'
                                                        : 'border-border bg-card opacity-50'
                                                }`}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                                                        ach.unlocked
                                                            ? 'bg-secondary text-forest'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    <AchievementIcon name={ach.icon} />
                                                </div>
                                                <div className="text-sm font-semibold text-foreground">
                                                    {ach.label}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {ach.desc}
                                                </div>
                                                {ach.unlocked && (
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <div className="w-2 h-2 rounded-full bg-forest"></div>
                                                        <span className="text-xs text-forest">
                                                            已解锁
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Tabs.TabPane>

                            <Tabs.TabPane key="body" title="体型数据">
                                <BodyDataForm onSave={handleSaveBodyData} />
                            </Tabs.TabPane>

                            <Tabs.TabPane key="style" title="风格偏好">
                                <div className="bg-card rounded-2xl p-6 shadow-card">
                                    <h3 className="font-semibold text-foreground mb-2">风格标签</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        选择你喜欢的风格，AI 将更准确地推荐搭配方案
                                    </p>

                                    {[
                                        {
                                            category: '穿搭风格',
                                            tags: [
                                                '简约',
                                                '休闲',
                                                '商务',
                                                '运动',
                                                '街头',
                                                '复古',
                                                '文艺',
                                                '优雅',
                                                '波西米亚',
                                                '极简',
                                            ],
                                            selected: ['简约', '休闲', '商务'],
                                        },
                                        {
                                            category: '颜色偏好',
                                            tags: [
                                                '黑白灰',
                                                '大地色',
                                                '蓝绿色调',
                                                '暖色系',
                                                '撞色',
                                                '低饱和',
                                            ],
                                            selected: ['黑白灰', '大地色'],
                                        },
                                        {
                                            category: '版型偏好',
                                            tags: ['修身', '宽松', 'Oversize', '合体', '收腰'],
                                            selected: ['修身', '合体'],
                                        },
                                    ].map(group => (
                                        <div key={group.category} className="mb-6">
                                            <label className="text-sm font-medium text-foreground block mb-3">
                                                {group.category}
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {group.tags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                                            group.selected.includes(tag)
                                                                ? 'bg-forest text-primary-foreground'
                                                                : 'bg-secondary text-secondary-foreground hover:bg-muted'
                                                        }`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="primary"
                                        style={{
                                            backgroundColor: 'var(--primary)',
                                            borderColor: 'var(--primary)',
                                            borderRadius: '999px',
                                            padding: '0 32px',
                                        }}
                                    >
                                        保存偏好设置
                                    </Button>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
