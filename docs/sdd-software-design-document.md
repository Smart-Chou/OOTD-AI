# SDD (软件设计文档)

## 系统架构

### 技术栈选择

- **前端**: React 18 + TypeScript + Vite + Ant Design
- **后端**: FastAPI (Python 3.11+) + PostgreSQL + Redis
- **AI服务**: Google Cloud Vision API + Stable Diffusion API
- **部署**: Docker + Nginx + Kubernetes (生产环境)

### 架构图

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   前端应用   │    │  后端API    │    │   数据库    │
│  (React)    │    │ (FastAPI)   │    │ (PostgreSQL)│
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
┌──────▼──────────────────▼──────────────────▼──────┐
│                 Docker容器编排                     │
│         (开发: Docker Compose, 生产: K8s)         │
└───────────────────────┬───────────────────────────┘
                        │
                  ┌─────▼─────┐
                  │   用户    │
                  └───────────┘
```

## 数据库设计

### 核心表结构

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    body_measurements JSONB,
    style_preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 衣物表
CREATE TABLE clothing_items (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255),
    category VARCHAR(100),
    color VARCHAR(50),
    size VARCHAR(50),
    image_urls TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 搭配表
CREATE TABLE outfits (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255),
    items JSONB, -- [{item_id, type, position}]
    occasion VARCHAR(100),
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API设计

### RESTful API规范

- 资源命名: 复数名词 (`/users`, `/clothing-items`, `/outfits`)
- HTTP方法: GET(获取), POST(创建), PUT(更新), DELETE(删除)
- 状态码: 200(成功), 201(创建成功), 400(客户端错误), 401(未认证), 404(未找到), 500(服务器错误)

### 认证机制

- JWT Token认证
- Access Token (15分钟过期)
- Refresh Token (7天过期)
- 多设备登录管理

## 安全设计

### 数据安全

- 密码: bcrypt哈希存储
- 个人数据: 加密存储
- 传输: HTTPS强制启用
- 访问控制: RBAC权限模型

### 合规要求

- 用户数据隐私保护 (GDPR/CCPA合规)
- 数据最小化原则
- 用户数据控制权 (访问、更正、删除)

## 部署架构

### 开发环境

```yaml
# docker-compose.yml
version: "3.8"
services:
    postgres:
        image: postgres:15
        environment:
            POSTGRES_DB: fashion_db
            POSTGRES_USER: fashion_user
            POSTGRES_PASSWORD: fashion_password

    redis:
        image: redis:7

    backend:
        build: ./src/backend
        ports:
            - "8000:8000"

    frontend:
        build: ./src/frontend
        ports:
            - "3000:3000"
```

### 生产环境

- 多可用区部署 (高可用)
- 自动伸缩 (基于负载)
- 蓝绿部署 (零停机更新)
- 监控告警 (Prometheus + Grafana)

## 监控与运维

### 监控指标

- 应用性能: 响应时间、错误率、吞吐量
- 基础设施: CPU、内存、磁盘、网络
- 业务指标: 用户活跃度、功能使用率、转化率

### 告警策略

- **紧急告警**: 系统不可用、数据丢失风险
- **重要告警**: 性能严重下降、错误率升高
- **通知告警**: 服务重启、部署完成

## 项目里程碑

### 开发阶段划分

1. **第一阶段 (1个月)**: 基础架构搭建
2. **第二阶段 (1.5个月)**: 核心功能开发
3. **第三阶段 (0.5个月)**: 优化与测试

### 交付成果

- 完整的源代码仓库
- 详细的文档集
- 可运行的系统
- 部署和运维手册
