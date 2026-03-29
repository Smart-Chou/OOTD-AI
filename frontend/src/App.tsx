import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useAuthStore } from './stores';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WardrobePage from './pages/WardrobePage';
import BodyDataPage from './pages/BodyDataPage';
import OutfitsPage from './pages/OutfitsPage';
import RecommendationPage from './pages/RecommendationPage';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="wardrobe"
              element={
                <ProtectedRoute>
                  <WardrobePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="body-data"
              element={
                <ProtectedRoute>
                  <BodyDataPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="outfits"
              element={
                <ProtectedRoute>
                  <OutfitsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="recommendations"
              element={
                <ProtectedRoute>
                  <RecommendationPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
