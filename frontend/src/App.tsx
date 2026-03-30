import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'

// Layout
import Header from './components/Header'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import WardrobePage from './pages/WardrobePage'
import BodyDataPage from './pages/BodyDataPage'
import OutfitsPage from './pages/OutfitsPage'
import RecommendationPage from './pages/RecommendationPage'
import ProfilePage from './pages/ProfilePage'
import VirtualTryOnPage from './pages/VirtualTryOnPage'

// Stores
import { useAuthStore } from './stores'

const queryClient = new QueryClient()

const PAGE_MAP: Record<string, string> = {
    home: '/',
    wardrobe: '/wardrobe',
    recommend: '/recommend',
    profile: '/profile',
    tryon: '/tryon',
}

const PATH_TO_PAGE: Record<string, string> = {
    '/': 'home',
    '/wardrobe': 'wardrobe',
    '/recommend': 'recommend',
    '/profile': 'profile',
    '/tryon': 'tryon',
}

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuthStore()
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}

// App Layout with Header
const AppLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const activePage = PATH_TO_PAGE[location.pathname] || 'home'

    const handleNavigate = (page: string) => {
        const path = PAGE_MAP[page] || '/'
        console.log('导航至:', page, '->', path)
        navigate(path)
    }

    return (
        <div className="min-w-full">
            <div style={{ width: '1440px', margin: '0 auto', minHeight: '100vh' }}>
                <Header activePage={activePage} onNavigate={handleNavigate} />
                <Routes>
                    <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
                    <Route
                        path="/wardrobe"
                        element={<WardrobePage onNavigate={handleNavigate} />}
                    />
                    <Route
                        path="/recommend"
                        element={<RecommendationPage onNavigate={handleNavigate} />}
                    />
                    <Route path="/profile" element={<ProfilePage onNavigate={handleNavigate} />} />
                    <Route
                        path="/tryon"
                        element={<VirtualTryOnPage onNavigate={handleNavigate} />}
                    />
                </Routes>
            </div>
        </div>
    )
}

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#2D503C',
                        borderRadius: 6,
                    },
                }}
            >
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Protected Routes with Layout */}
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </ConfigProvider>
        </QueryClientProvider>
    )
}

export default App
