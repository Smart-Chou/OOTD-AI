import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores'
import { useMessage } from './useMessage'

/**
 * Common hook for authenticated pages
 * Combines navigate, auth store, and message API into one hook
 */
export const useAuthPage = () => {
    const navigate = useNavigate()
    const { user, setUser, setToken, logout, isAuthenticated } = useAuthStore()
    const message = useMessage()

    return {
        navigate,
        user,
        setUser,
        setToken,
        logout,
        isAuthenticated,
        message,
    }
}
