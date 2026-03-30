# Frontend Docker
FROM node:22-alpine

WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

EXPOSE 3000

# 生产模式使用 preview，指定端口 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
