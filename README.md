# 妆娘 APP - AI 脸型识别妆容推荐系统

一款以 AI 脸型识别为核心，为用户提供"脸型适配妆容+场景化妆造"双维度推荐的工具类 APP。

## 🎯 产品定位

解决用户"不知适合什么妆""不同场合不会化妆"的核心痛点，兼顾实用性与个性化。

## ✨ 核心功能

### 1. 人脸上传与脸型识别

- 支持拍照或从相册选择照片
- AI 自动识别 6 种常见脸型（圆脸、方脸、鹅蛋脸、长脸、心形脸、菱形脸）
- 生成脸型分析报告
- 识别结果手动修正

### 2. 妆容推荐

- **脸型适配推荐**：基于识别出的脸型推荐 3-5 款"扬长避短"的妆容
- **场景化推荐**：日常通勤、商务会议、约会、派对/音乐节、面试等场景定制化方案
- 分步教程（图文+短视频）
- 产品推荐（平价/中端/高端分类）

### 3. 社交功能

- 妆容内容瀑布流
- 发布/收藏/分享妆容
- 点赞和评论互动
- 关注其他用户

### 4. 个人中心

- 用户信息管理（昵称、头像、肤质、肤色）
- 历史记录、收藏、浏览记录
- 发布内容管理

### 5. 商城

- 美妆产品分类展示
- 产品搜索和筛选
- 跳转第三方电商平台

## 🛠️ 技术栈

- **框架**: Next.js 15.5.4 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand 5.0.8
- **UI 组件**: Material Symbols Icons
- **字体**: Plus Jakarta Sans

## 📦 项目结构

```
makeup-artist/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页（妆容推荐瀑布流）
│   ├── shop/              # 商城页面
│   ├── profile/           # 个人中心
│   ├── messages/          # 消息页面
│   ├── scan/              # 脸型识别上传页面
│   └── globals.css        # 全局样式
├── components/            # 公共组件
│   └── bottom-nav.tsx     # 底部导航栏
├── lib/                   # 工具库
│   └── stores/            # Zustand 状态管理
│       ├── types.ts
│       └── useAppStore.ts
├── docs/                  # 文档
│   ├── prd.md            # 产品需求文档
│   └── 项目架构.md       # 项目架构文档
└── public/               # 静态资源
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

### 代码检查

```bash
npm run lint
```

## 🌐 一键部署

### 部署到 Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/makeup-artist)

**步骤：**

1. 点击上方按钮或访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 导入你的仓库
4. 点击 "Deploy"
5. 等待 1-2 分钟，完成！

**配置说明：**

- 项目已包含 `vercel.json` 配置文件
- 自动启用 HTTPS 和全球 CDN
- 每次推送代码自动部署
- 区域默认为香港（hkg1），国内访问更快

### 环境变量设置

如果需要配置环境变量（如 API 密钥），在 Vercel 项目设置中添加：

```
Settings → Environment Variables
```

### 其他部署选项

- **Netlify**: [netlify.com](https://netlify.com)
- **Railway**: [railway.app](https://railway.app)
- **Render**: [render.com](https://render.com)

## 🎨 设计系统

### 颜色主题

- **Primary**: #f04299 （品牌粉色）
- **Background Light**: #f8f6f7
- **Background Dark**: #221019
- **Content Light**: #1f1f1f
- **Content Dark**: #e0e0e0
- **Subtle Light**: #888888
- **Subtle Dark**: #a0a0a0
- **Surface Light**: #ffffff
- **Surface Dark**: #2c1c24

### 字体

- **Display**: Plus Jakarta Sans (400, 500, 700, 800)

### 圆角

- **Default**: 0.5rem
- **Large**: 1rem
- **Extra Large**: 1.5rem
- **Full**: 9999px

## 📱 页面路由

- `/` - 首页（妆容推荐）
- `/shop` - 商城
- `/scan` - 脸型识别上传
- `/messages` - 消息通知
- `/profile` - 个人中心

## 🔧 开发规范

### 代码风格

- 使用 TypeScript 进行类型安全开发
- 函数式和声明式编程范式
- 优先使用具名导出
- 组件使用 PascalCase，文件使用 kebab-case

### 组件开发

- 优先使用 Server Components
- 需要交互的使用 `"use client"`
- 保持组件职责单一
- 合理使用记忆化（useMemo、useCallback）

### 样式规范

- 使用 Tailwind CSS 工具类
- 响应式设计（移动优先）
- 支持深色模式
- 统一使用设计系统中的颜色和间距

## 📝 待实现功能

- [ ] AI 脸型识别接口集成
- [ ] 用户认证系统
- [ ] 数据库集成 (Supabase)
- [ ] 图片上传和存储
- [ ] 搜索功能
- [ ] 分享功能
- [ ] 产品详情页
- [ ] 妆容详情页
- [ ] 评论系统
- [ ] 虚拟试妆功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC License

---

**妆娘 APP** - 让每个人都能找到最适合自己的妆容 💄✨
