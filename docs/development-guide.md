# 开发指南

## 环境搭建

### 系统要求

- **操作系统**: macOS 10.15+, Windows 10+, Ubuntu 20.04+
- **Node.js**: 18.x 或更高版本
- **Python**: 3.11.x 或更高版本
- **Docker**: 20.10+ 和 Docker Compose 2.0+
- **Git**: 2.30+ 版本

### 开发环境配置

```bash
# 1. 克隆项目
git clone <repository-url>
cd ai-fashion-assistant

# 2. 环境变量配置
cp .env.example .env
# 编辑.env文件填写配置

# 3. 启动依赖服务
docker-compose up -d postgres redis minio

# 4. 启动开发服务器
# 后端
cd src/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 前端 (新终端)
cd src/frontend
npm run dev
```

### 使用Docker开发

```bash
# 启动所有开发服务
docker-compose up -d

# 访问地址
前端应用: http://localhost:3000
后端API: http://localhost:8000
API文档: http://localhost:8000/docs
```

## 项目结构

### 前端项目结构

```
src/frontend/
├── src/
│   ├── pages/          # 页面组件
│   ├── components/     # 通用组件
│   ├── hooks/         # 自定义Hooks
│   ├── stores/        # 状态管理
│   ├── services/      # API服务
│   └── utils/         # 工具函数
└── package.json       # 依赖管理
```

### 后端项目结构

```
src/backend/
├── app/
│   ├── api/           # API路由
│   ├── core/          # 核心功能
│   ├── models/        # 数据模型
│   ├── schemas/       # Pydantic模式
│   ├── services/      # 业务服务
│   └── crud/          # 数据库操作
├── migrations/        # 数据库迁移
└── requirements.txt   # Python依赖
```

## 开发流程

### 功能开发步骤

1. **需求分析**: 阅读文档，理解需求，技术方案设计
2. **技术设计**: API接口设计，数据库模型设计，组件结构设计
3. **环境准备**: 创建功能分支，更新依赖
4. **后端开发**: 数据模型 → Pydantic模式 → CRUD操作 → API路由
5. **前端开发**: 页面组件 → 子组件 → 状态管理 → API集成
6. **集成测试**: 前后端联调，功能测试，性能测试
7. **代码审查**: Pull Request，代码审查，CI/CD通过
8. **部署上线**: 合并主分支，自动化部署，监控验证

### 编码规范

#### 前端 (TypeScript/React)

```typescript
// 使用明确的类型定义
interface User {
  id: string;
  email: string;
  name: string;
}

// 使用函数组件和Hooks
const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 副作用逻辑
  }, [user.id]);

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  );
};
```

#### 后端 (Python/FastAPI)

```python
# 遵循PEP 8，使用类型注解
from typing import List, Optional
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=8)
    name: Optional[str] = Field(None, max_length=100)

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """创建新用户"""
    try:
        user = UserService.create_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

## API开发指南

### RESTful API设计

- 使用HTTP方法表示操作 (GET, POST, PUT, DELETE, PATCH)
- 使用名词复数表示资源 (`/users`, `/clothing-items`)
- 使用查询参数进行过滤、排序、分页
- 统一的响应格式和错误处理

### 认证和授权

- JWT Token认证 (access_token + refresh_token)
- 基于角色的权限控制 (RBAC)
- API速率限制
- 敏感操作审计日志

### 文件上传

```python
@router.post("/clothing-items/{item_id}/images")
async def upload_clothing_image(
    item_id: str,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """上传衣物图片"""
    # 验证文件类型和大小
    if not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    # 上传到对象存储
    file_url = await StorageService.upload_image(
        file=image.file,
        filename=image.filename,
        user_id=current_user.id
    )

    return {"image_url": file_url}
```

## AI服务集成

### 图像识别 (Google Cloud Vision)

```python
from google.cloud import vision

class ImageRecognitionService:
    def detect_clothing_attributes(self, image_content: bytes) -> Dict:
        """识别衣物属性"""
        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=image_content)

        # 物体检测、标签检测、颜色检测
        objects = client.object_localization(image=image)
        labels = client.label_detection(image=image)
        colors = client.image_properties(image=image)

        return {
            "objects": [obj.name for obj in objects],
            "labels": [label.description for label in labels],
            "colors": [color.color for color in colors]
        }
```

### 图像生成 (Stable Diffusion)

```python
import stability_sdk

class ImageGenerationService:
    def generate_clothing_image(self, prompt: str) -> bytes:
        """生成衣物图像"""
        client = stability_sdk.client.StabilityInference(key=API_KEY)

        answers = client.generate(
            prompt=prompt,
            width=512,
            height=512,
            steps=30
        )

        for resp in answers:
            for artifact in resp.artifacts:
                if artifact.type == stability_sdk.generation.ARTIFACT_IMAGE:
                    return artifact.binary
```

### 推荐算法

```python
class RecommendationService:
    def content_based_filtering(self, user_preferences, clothing_items):
        """基于内容的过滤推荐"""
        # 提取特征，计算相似度
        item_features = self.extract_features(clothing_items)
        user_features = self.extract_user_features(user_preferences)

        similarities = self.calculate_similarity(user_features, item_features)
        return self.get_top_recommendations(similarities, clothing_items)
```

## 部署和运维

### 本地开发部署

```bash
# 完整开发环境
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend

# 停止服务
docker-compose down
```

### 生产环境部署

```bash
# 设置生产环境变量
export ENVIRONMENT=production

# 构建生产镜像
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# 启动生产服务
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 数据库管理

```bash
# 执行数据库迁移
docker-compose exec backend alembic upgrade head

# 创建新迁移
docker-compose exec backend alembic revision --autogenerate -m "描述变更"

# 数据库备份
docker-compose exec postgres pg_dump -U fashion_user fashion_db > backup.sql
```

## 故障排除

### 常见问题

1. **数据库连接失败**: 检查PostgreSQL服务状态，验证连接字符串
2. **服务启动失败**: 查看Docker日志，检查端口冲突
3. **内存不足**: 清理Docker资源，增加内存限制
4. **API认证失败**: 验证JWT Token，检查过期时间

### 性能调优

- **数据库优化**: 创建索引，优化查询，定期分析表统计
- **应用优化**: 使用连接池，启用缓存，异步处理耗时任务
- **监控分析**: 使用Prometheus监控，分析性能瓶颈

## 扩展和定制

### 添加新功能

1. 功能规划和需求分析
2. 数据库模型设计和API接口设计
3. 后端服务实现和前端组件开发
4. 集成测试和部署验证

### 自定义AI算法

- 修改推荐算法权重
- 添加新的特征提取方法
- 集成第三方AI服务
- 实现个性化推荐策略

### 多语言支持

- 使用react-i18next实现前端国际化
- 支持中英文界面切换
- 动态加载语言资源
