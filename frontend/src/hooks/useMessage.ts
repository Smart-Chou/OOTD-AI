import { Message } from '@arco-design/web-react'

export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

interface MessageApi {
    loading: (content: string, duration?: number) => Promise<() => void>
    success: (content: string, duration?: number) => Promise<() => void>
    error: (content: string, duration?: number) => Promise<() => void>
    info: (content: string, duration?: number) => Promise<() => void>
    warning: (content: string, duration?: number) => Promise<() => void>
}

export const useMessage = (): MessageApi => {
    return {
        loading: (content: string, duration = 2000) => Message.loading({ content, duration }),
        success: (content: string, duration = 2000) => Message.success({ content, duration }),
        error: (content: string, duration = 3000) => Message.error({ content, duration }),
        info: (content: string, duration = 2000) => Message.info({ content, duration }),
        warning: (content: string, duration = 2000) => Message.warning({ content, duration }),
    }
}
