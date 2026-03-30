import { useState } from 'react'
import { Shirt, Sparkles, Menu, X, Camera, LogIn, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
    activePage?: string
    onNavigate?: (page: string) => void
}

const Header = ({ activePage = 'home', onNavigate = () => {} }: HeaderProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    const navItems = [
        { key: 'home', label: '首页', icon: <Shirt size={18} /> },
        { key: 'wardrobe', label: '我的衣橱', icon: <Shirt size={18} /> },
        { key: 'recommend', label: '智能推荐', icon: <Sparkles size={18} /> },
        { key: 'tryon', label: '虚拟试穿', icon: <Camera size={18} /> },
    ]

    const handleNav = (key: string) => {
        onNavigate(key)
        setMobileMenuOpen(false)
    }

    return (
        <header data-cmp="Header" className="bg-card border-b border-border sticky top-0 z-50">
            <div className="container-main py-0">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => handleNav('home')}
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-forest flex items-center justify-center">
                            <Shirt className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
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
                                className={`nav-link rounded-lg flex items-center gap-2 ${activePage === item.key ? 'active text-forest font-semibold' : ''}`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-foreground hover:text-forest transition-colors duration-200"
                        >
                            <LogIn className="w-5 h-5" />
                            登录
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-forest text-primary-foreground hover:opacity-90 transition-opacity duration-200"
                        >
                            <UserPlus className="w-5 h-5" />
                            注册
                        </button>
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
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
                        <div className="border-t border-border mt-3 pt-3">
                            <button
                                onClick={() => {
                                    navigate('/login')
                                    setMobileMenuOpen(false)
                                }}
                                className="block w-full text-left px-4 py-3 text-sm rounded-lg mb-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
                            >
                                登录
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/register')
                                    setMobileMenuOpen(false)
                                }}
                                className="block w-full text-left px-4 py-3 text-sm rounded-lg mb-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
                            >
                                注册
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
