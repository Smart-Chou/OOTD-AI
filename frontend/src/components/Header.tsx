import { useState } from 'react'
import { Shirt, Sparkles, User, Menu, X, Camera } from 'lucide-react'

interface HeaderProps {
    activePage?: string
    onNavigate?: (page: string) => void
}

const Header = ({ activePage = 'home', onNavigate = () => {} }: HeaderProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navItems = [
        { key: 'home', label: '首页' },
        { key: 'wardrobe', label: '我的衣橱' },
        { key: 'recommend', label: '智能推荐' },
        { key: 'tryon', label: '虚拟试穿' },
        { key: 'profile', label: '个人中心' },
    ]

    const handleNav = (key: string) => {
        onNavigate(key)
        setMobileMenuOpen(false)
    }

    return (
        <header data-cmp="Header" className="bg-card border-b border-border sticky top-0 z-50">
            <div style={{ width: '1440px', margin: '0 auto' }} className="px-12 py-0">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => handleNav('home')}
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
                            <Shirt className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
                        </div>
                        <span className="text-lg font-bold text-foreground tracking-tight">
                            穿搭助手
                        </span>
                        <span className="text-xs text-gold font-medium ml-0.5">AI</span>
                    </button>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => handleNav(item.key)}
                                className={`nav-link rounded-lg ${activePage === item.key ? 'active text-forest font-semibold' : ''}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleNav('tryon')}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border hover:border-primary transition-colors duration-200 text-foreground"
                        >
                            <Camera className="w-4 h-4" />
                            虚拟试穿
                        </button>
                        <button
                            onClick={() => handleNav('recommend')}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-forest text-primary-foreground hover:opacity-90 transition-opacity duration-200"
                        >
                            <Sparkles className="w-4 h-4" />
                            开始搭配
                        </button>
                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => handleNav(item.key)}
                                className={`block w-full text-left px-4 py-3 text-sm rounded-lg mb-1 transition-colors duration-200 ${
                                    activePage === item.key
                                        ? 'bg-secondary text-forest font-semibold'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
