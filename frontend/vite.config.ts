import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import AutoImport from 'unplugin-auto-import/vite'
import * as lucideIcons from 'lucide-react'

// 获取所有 lucide-react 导出的符号名
const allLucideExports = Object.keys(lucideIcons).filter(key => key !== 'default')

// 扫描 src 目录，找出实际使用的 lucide 图标
function getUsedLucideIcons() {
    const usedIcons = new Set<string>()
    const srcPath = path.resolve(__dirname, './src')

    function scanDirectory(dir: string) {
        if (!fs.existsSync(dir)) return

        const files = fs.readdirSync(dir)
        for (const file of files) {
            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)

            if (stat.isDirectory()) {
                scanDirectory(filePath)
            } else if (/\.(tsx?|jsx?)$/.test(file)) {
                const content = fs.readFileSync(filePath, 'utf-8')

                // 匹配 JSX 标签和标识符使用
                for (const icon of allLucideExports) {
                    // 匹配: <IconName、{IconName、= IconName、: IconName 等
                    const patterns = [
                        new RegExp(`<${icon}[\\s/>]`, 'g'),
                        new RegExp(`[{\\s,=:]${icon}[\\s,})]`, 'g'),
                    ]

                    if (patterns.some(pattern => pattern.test(content))) {
                        usedIcons.add(icon)
                    }
                }
            }
        }
    }

    scanDirectory(srcPath)
    return Array.from(usedIcons)
}

const usedLucideIcons = getUsedLucideIcons()

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        AutoImport({
            dts: 'auto-imports.d.ts',
            include: [/\.[tj]sx?$/],
            imports: [
                'react',
                {
                    'lucide-react': usedLucideIcons,
                },
            ],
            eslintrc: {
                enabled: false,
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
    preview: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        setupFiles: ['./src/test/setup.ts'],
    },
})
