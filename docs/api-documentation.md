# API文档

## 基础信息

### API端点
- **开发环境**: `http://localhost:8000/api/v1`
- **生产环境**: `https://api.fashion-assistant.com/api/v1`

### 认证机制
大部分API需要Bearer Token认证：
```http
Authorization: Bearer <access_token>
```

### 响应格式
```json
{
  "status": "success",  // 或 "error"
  "data": { /* 具体数据 */ },
  "error": { /* 错误信息 */ },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 认证API

### 用户注册
`POST /auth/register`
```json
请求体: {
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "name": "John Doe"
}
```

### 用户登录
`POST /auth/login`
```json
请求体: {
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
响应: {
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "expires_in": 900
}
```

### 刷新令牌
`POST /auth/refresh`
```json
请求体: {
  "refresh_token": "eyJhbGci..."
}
```

### 获取当前用户
`GET /auth/me`
需要Bearer Token

## 用户管理API

### 更新用户资料
`PUT /users/me`
```json
请求体: {
  "name": "John Updated",
  "body_measurements": {
    "height_cm": 176.0,
    "weight_kg": 71.0
  }
}
```

### 更新密码
`PUT /users/me/password`
```json
请求体: {
  "current_password": "OldPassword123!",
  "new_password": "NewPassword456!"
}
```

## 衣物管理API

### 获取衣物列表
`GET /clothing-items`
**查询参数**: `page`, `page_size`, `category`, `color`, `search`

### 创建衣物
`POST /clothing-items`
```json
请求体: {
  "name": "White Cotton T-shirt",
  "category": "top",
  "subcategory": "t-shirt",
  "color": "white",
  "size": "M",
  "material": "cotton"
}
```

### 上传衣物图片
`POST /clothing-items/{item_id}/images`
**内容类型**: `multipart/form-data`
**表单参数**: `image` (图片文件)

### AI衣物分析
`POST /clothing-items/analyze`
上传图片自动分析衣物属性

## 搭配管理API

### 获取搭配列表
`GET /outfits`
**查询参数**: `page`, `page_size`, `occasion`, `season`

### 创建搭配
`POST /outfits`
```json
请求体: {
  "name": "Business Meeting Outfit",
  "occasion": "business formal",
  "items": [
    {"item_id": "clothing-123", "type": "top"},
    {"item_id": "clothing-456", "type": "bottom"}
  ]
}
```

### 上传搭配图片
`POST /outfits/{outfit_id}/image`

## 推荐API

### 获取推荐搭配
`GET /recommendations/outfits`
**查询参数**: `occasion`, `weather`, `temperature_c`, `limit`

### 获取衣物推荐
`GET /recommendations/clothing`
**查询参数**: `category`, `max_price`, `brands`, `limit`

### AI生成搭配效果图
`POST /recommendations/ai-outfits`
```json
请求体: {
  "items": ["clothing-123", "clothing-456"],
  "style": "realistic"
}
```

### 检查AI生成状态
`GET /recommendations/ai-outfits/{generation_id}/status`

## 尺码数据库API

### 获取品牌尺码表
`GET /size-guides/{brand}`
**查询参数**: `category`, `gender`

### 获取尺码推荐
`POST /size-guides/recommend`
```json
请求体: {
  "brand": "Levi's",
  "category": "jeans",
  "body_measurements": {
    "height_cm": 175,
    "weight_kg": 70,
    "waist_cm": 81
  }
}
```

## 分析统计API

### 获取衣物统计
`GET /analytics/wardrobe`

### 获取穿搭习惯分析
`GET /analytics/wearing-habits`
**查询参数**: `time_range` (7d, 30d, 90d, 1y)

### 获取推荐效果分析
`GET /analytics/recommendation-performance`

## 系统API

### 健康检查
`GET /health`

### 系统指标
`GET /metrics` (Prometheus格式)

### API速率限制信息
`GET /rate-limit`

## WebSocket API

### 实时推荐更新
`ws://localhost:8000/ws/recommendations`
连接时提供Bearer Token

## 批量操作API

### 批量导入衣物
`POST /bulk/clothing-items/import`
上传CSV或JSON文件

### 批量导出数据
`GET /bulk/export`
**查询参数**: `data_types`, `format`

## 错误代码

| 错误码 | 描述 | HTTP状态码 |
|--------|------|------------|
| `VALIDATION_ERROR` | 输入验证失败 | 400 |
| `AUTH_REQUIRED` | 需要认证 | 401 |
| `INVALID_CREDENTIALS` | 无效凭据 | 401 |
| `INSUFFICIENT_PERMISSIONS` | 权限不足 | 403 |
| `RESOURCE_NOT_FOUND` | 资源不存在 | 404 |
| `RATE_LIMIT_EXCEEDED` | 请求超限 | 429 |
| `INTERNAL_SERVER_ERROR` | 服务器错误 | 500 |

## 分页参数

- `page`: 页码（从1开始）
- `page_size`: 每页数量（1-100，默认20）

## 时间格式

所有时间字段使用ISO 8601格式：
- `2024-01-01T00:00:00Z`

## 文件限制

- 图片上传: 最大10MB
- 批量导入: 最大50MB
- 支持格式: JPEG, PNG, WebP, CSV, JSON
