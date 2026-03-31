import { useState } from 'react'
import { userApi } from '../services/api'
import { useBodyDataStore } from '../stores'
import { useMessage } from './useMessage'

export const useBodyData = () => {
    const [loading, setLoading] = useState(false)
    const { bodyData, setBodyData } = useBodyDataStore()
    const message = useMessage()

    const save = async (values: any) => {
        setLoading(true)
        try {
            if (bodyData) {
                const response = await userApi.updateBodyData(values)
                setBodyData(response.data)
                message.success('体型数据更新成功')
            } else {
                const response = await userApi.createBodyData(values)
                setBodyData(response.data)
                message.success('体型数据创建成功')
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || '操作失败'
            message.error(errorMsg)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        bodyData,
        save,
        loading,
    }
}