# 项目结构说明

## 目录结构

```
ai-fashion-assistant/
├── docs/                           # 项目文档
│   ├── requirements-analysis.md    # 需求分析报告
│   ├── sdd-software-design-document.md  # 软件设计文档
│   ├── bmad-role-based-agents.md  # 角色化智能体框架
│   ├── harness-engineering-framework.md # 工程约束框架
│   ├── development-guide.md        # 开发指南
│   └── api-documentation.md       # API文档
├── src/
│   ├── frontend/                  # 前端代码
│   │   ├── package.json          # 前端依赖
│   │   └── (其他前端文件)
│   └── backend/                   # 后端代码
│       ├── requirements.txt       # Python依赖
│       └── (其他后端文件)
├── .env.example                   # 环境变量示例
├── docker-compose.yml             # Docker编排配置
├── README.md                      # 项目说明
└── PROJECT-STRUCTURE.md           # 本项目结构说明
```

## 文件说明

### 核心文档
1. **需求分析报告** (`docs/requirements-analysis.md`)
   - 项目背景和目标用户分析
   - 功能需求和非功能需求
   - 技术约束和商业约束
   - 成功指标和风险评估

2. **SDD文档** (`docs/sdd-software-design-document.md`)
   - 系统架构和技术栈选择
   - 数据库设计和API规范
   - 安全设计和部署架构
   - 监控运维和项目里程碑

3. **BMAD框架** (`docs/bmad-role-based-agents.md`)
   - 角色化智能体协作框架
   - 架构师、开发、测试、部署角色定义
   - 协作
