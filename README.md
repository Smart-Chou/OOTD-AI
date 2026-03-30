# AI辅助穿搭Web应用

## 项目概述

一个帮助用户进行衣物搭配的Web应用，旨在解决用户因身高、体重等身体数据不协调导致的穿搭困难。目标用户为穿搭新手和时间紧张者。

## 核心功能

1. **用户体型分析** - 基于身高、体重、尺寸数据的个性化分析
2. **衣物管理** - 用户衣物库管理（上传、分类、标签）
3. **智能推荐** - 基于体型数据与衣物属性的匹配算法
4. **AI效果图生成** - 展示衣物在用户身上的穿着效果
5. **尺码建议** - 对接Zara、H&M等大牌尺码数据库
6. **搭配分享** - 用户分享搭配方案与心得

## 技术栈

### 前端

- **框架**: React + TypeScript + Vite
- **状态管理**: Zustand
- **UI组件**: Ant Design / Material-UI
- **构建工具**: Vite
- **测试**: Jest + React Testing Library

### 后端

- **框架**: Python FastAPI
- **数据库**: PostgreSQL
- **AI服务**: Google Cloud Vision API, Stable Diffusion API
- **认证**: JWT + OAuth2
- **部署**: Docker + Nginx

## 快速开始

1. 环境要求: Node.js 18+, Python 3.11+, Docker
2. 安装依赖: `npm install` (前端), `pip install -r requirements.txt` (后端)
3. 配置环境: 复制 `.env.example` 为 `.env` 并填写配置
4. 启动服务: `docker-compose up -d`
5. 访问应用: http://localhost:3000

## 项目文档

详细文档位于 `docs/` 目录:

1. **需求分析报告** (`docs/requirements-analysis.md`) - 详细的功能需求和技术要求
2. **SDD文档** (`docs/sdd-software-design-document.md`) - 完整的系统设计文档
3. **BMAD框架** (`docs/bmad-role-based-agents.md`) - 角色化智能体协作框架
4. **Harness Engineering** (`docs/harness-engineering-framework.md`) - 工程约束与安全保障框架
5. **开发指南** (`docs/development-guide.md`) - 详细的开发流程和规范
6. **API文档** (`docs/api-documentation.md`) - 完整的API接口文档

## 项目里程碑

### 已完成阶段

1. **需求分析阶段** - 用户痛点分析和功能定义
2. **SDD设计阶段** - 系统架构和技术方案设计
3. **BMAD定义阶段** - 角色化智能体协作框架
4. **Harness Engineering阶段** - 安全约束和质量保障框架

### 当前阶段

5. **开发阶段** - 按3个月时间表执行开发任务

### 后续阶段

6. **测试阶段** - 功能测试、性能测试、安全测试
7. **部署与运维** - 生产环境部署和监控
8. **文档整理与交付** - 最终项目交付

## 核心方法论

1. **SDD (Software Design Document)** - 非技术人员也能理解的设计文档
2. **BMAD (Role-based AI Agents)** - 角色化智能体协作架构
3. **Harness Engineering** - 安全约束与质量保障框架

## 联系方式

如有问题或建议，请联系项目负责人。

---

**项目版本**: v1.0  
**最后更新**: 2026年3月29日  
**状态**: 开发中
