import { Message } from '@arco-design/web-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageReturn = any

interface MessageApi {
    loading: (content: string, duration?: number) => MessageReturn
    success: (content: string, duration?: number) => MessageReturn
    error: (content: string, duration?: number) => MessageReturn
    info: (content: string, duration?: number) => MessageReturn
    warning: (content: string, duration?: number) => MessageReturn
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
