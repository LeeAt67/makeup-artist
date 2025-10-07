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
- **后端服务**: Supabase (认证、数据库、存储)
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
│   ├── supabase/          # Supabase 配置
│   │   ├── client.ts      # 浏览器端客户端
│   │   ├── server.ts      # 服务端客户端
│   │   ├── middleware.ts  # 中间件客户端
│   │   └── types.ts       # 数据库类型定义
│   └── stores/            # Zustand 状态管理
│       ├── types.ts
│       └── useAppStore.ts
├── middleware.ts          # Next.js 中间件（处理认证）
├── docs/                  # 文档
│   ├── prd.md            # 产品需求文档
│   └── 项目架构.md       # 项目架构文档
└── public/               # 静态资源
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

#### 2.1 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project" 创建新项目
3. 填写项目信息并选择区域（推荐选择 **Singapore** 或 **Tokyo**，国内访问较快）
4. 等待项目初始化完成

#### 2.2 获取 API 密钥

1. 在项目 Dashboard 中，点击左侧菜单的 "Settings" → "API"
2. 找到以下信息：
   - **Project URL**: 你的项目 URL
   - **anon/public key**: 匿名公钥

#### 2.3 配置环境变量

在项目根目录创建 `.env.local` 文件，并填入以下内容：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名公钥
```

#### 2.4 创建数据库表

**⭐ 推荐方式：使用项目提供的 SQL 脚本**

详细说明请查看 [数据库设置指南](./docs/数据库设置指南.md)

在 Supabase Dashboard 中，点击左侧菜单的 "SQL Editor"，按顺序执行以下脚本：

1. **基础表结构**：复制并执行 `supabase-setup.sql`
2. **妆容帖子表**：复制并执行 `supabase-makeup-posts.sql`
3. **评论系统表**：复制并执行 `supabase-comments-system.sql`
4. **产品系统表**：复制并执行 `supabase-products-system.sql`
5. **RPC 函数**：复制并执行 `supabase-rpc-functions.sql`
6. **示例数据**：编辑并执行 `supabase-insert-sample-data.sql`（需替换用户 UUID）

**注意**：

- 必须按顺序执行，因为有表之间的依赖关系
- 如果遇到外键错误，请参考 `supabase-fix-makeup-posts-fk.sql` 修复脚本

或者手动执行以下 SQL 创建数据表：

```sql
-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- 用户资料表
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text,
  avatar_url text,
  skin_type text check (skin_type in ('dry', 'oily', 'combination', 'normal')),
  skin_tone text check (skin_tone in ('cool', 'warm', 'neutral')),
  face_shape text check (face_shape in ('round', 'square', 'oval', 'long', 'heart', 'diamond'))
);

-- 妆容表
create table makeups (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text not null,
  video_url text,
  face_shapes text[] default '{}',
  scenes text[] default '{}',
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')) default 'beginner',
  likes_count integer default 0,
  views_count integer default 0,
  author_id uuid references auth.users on delete cascade not null
);

-- 收藏表
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  makeup_id uuid references makeups on delete cascade not null,
  unique(user_id, makeup_id)
);

-- 脸型识别历史记录表
create table face_scans (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  image_url text not null,
  face_shape text check (face_shape in ('round', 'square', 'oval', 'long', 'heart', 'diamond')) not null,
  confidence numeric(3,2) not null,
  is_manually_adjusted boolean default false
);

-- 启用行级安全 (RLS)
alter table profiles enable row level security;
alter table makeups enable row level security;
alter table favorites enable row level security;
alter table face_scans enable row level security;

-- 用户资料表的 RLS 策略
create policy "用户可以查看所有资料" on profiles for select using (true);
create policy "用户只能更新自己的资料" on profiles for update using (auth.uid() = id);
create policy "用户注册时自动创建资料" on profiles for insert with check (auth.uid() = id);

-- 妆容表的 RLS 策略
create policy "所有人可以查看妆容" on makeups for select using (true);
create policy "认证用户可以创建妆容" on makeups for insert with check (auth.uid() = author_id);
create policy "作者可以更新自己的妆容" on makeups for update using (auth.uid() = author_id);
create policy "作者可以删除自己的妆容" on makeups for delete using (auth.uid() = author_id);

-- 收藏表的 RLS 策略
create policy "用户可以查看自己的收藏" on favorites for select using (auth.uid() = user_id);
create policy "用户可以添加收藏" on favorites for insert with check (auth.uid() = user_id);
create policy "用户可以删除自己的收藏" on favorites for delete using (auth.uid() = user_id);

-- 脸型识别历史记录表的 RLS 策略
create policy "用户可以查看自己的识别记录" on face_scans for select using (auth.uid() = user_id);
create policy "用户可以创建识别记录" on face_scans for insert with check (auth.uid() = user_id);
create policy "用户可以更新自己的识别记录" on face_scans for update using (auth.uid() = user_id);

-- 创建存储桶用于图片上传
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('makeups', 'makeups', true);
insert into storage.buckets (id, name, public) values ('face-scans', 'face-scans', false);

-- 存储桶的访问策略
create policy "所有人可以查看头像" on storage.objects for select using (bucket_id = 'avatars');
create policy "用户可以上传自己的头像" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "用户可以更新自己的头像" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "所有人可以查看妆容图片" on storage.objects for select using (bucket_id = 'makeups');
create policy "认证用户可以上传妆容图片" on storage.objects for insert with check (bucket_id = 'makeups' and auth.role() = 'authenticated');

create policy "用户可以查看自己的脸型扫描图片" on storage.objects for select using (bucket_id = 'face-scans' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "用户可以上传自己的脸型扫描图片" on storage.objects for insert with check (bucket_id = 'face-scans' and auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. 启动开发服务器

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

在 Vercel 项目设置中添加 Supabase 环境变量：

1. 进入项目 Settings → Environment Variables
2. 添加以下变量：
   - `NEXT_PUBLIC_SUPABASE_URL`: 你的 Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 你的 Supabase 匿名公钥
3. 重新部署项目

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

### 公开页面（无需登录）

- `/login` - 登录页面
- `/register` - 注册页面
- `/forgot-password` - 忘记密码
- `/auth/reset-password` - 重置密码
- `/auth/callback` - 认证回调（邮箱验证）

### 需要登录的页面

- `/` - 首页（妆容推荐）
- `/shop` - 商城
- `/scan` - 脸型识别上传
- `/messages` - 消息通知
- `/profile` - 个人中心
- `/profile/edit` - 编辑资料

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

- [x] 脸型识别功能（含模拟 AI 识别）- ✅ 已完成
- [x] 用户认证系统（使用 Supabase Auth）- ✅ 已完成
- [x] 数据库集成 (Supabase) - ✅ 已完成
- [x] 图片上传和存储（使用 Supabase Storage）- ✅ 已完成
- [x] 用户资料编辑功能 - ✅ 已完成
- [x] 妆容详情页 - ✅ 已完成
- [x] 搜索功能 - ✅ 已完成
- [x] 分享功能 - ✅ 已完成
- [x] 产品详情页 - ✅ 已完成
- [x] 评论系统 - ✅ 已完成
- [x] 产品数据库和管理 - ✅ 已完成
- [x] Zustand 状态管理 - ✅ 已完成
- [ ] AI 脸型识别 API 对接（目前使用模拟数据）
- [ ] 虚拟试妆功能（需要 AR 技术支持）

## 💾 Supabase 使用指南

### 在客户端组件中使用

```typescript
"use client";

import { createClient } from "@/lib/supabase/client";

export default function ClientComponent() {
  const supabase = createClient();

  // 使用 Supabase 客户端
  const fetchData = async () => {
    const { data, error } = await supabase.from("makeups").select("*");
  };

  return <div>...</div>;
}
```

### 在服务端组件中使用

```typescript
import { createClient } from "@/lib/supabase/server";

export default async function ServerComponent() {
  const supabase = await createClient();

  // 使用 Supabase 客户端
  const { data: makeups } = await supabase.from("makeups").select("*");

  return <div>...</div>;
}
```

### 在 Server Actions 中使用

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";

export async function createMakeup(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("makeups").insert({
    title: formData.get("title"),
    // ...
  });

  return { data, error };
}
```

### 用户认证

项目已实现完整的用户认证系统，包括：

#### 功能列表

- ✅ 用户注册（邮箱 + 密码）
- ✅ 用户登录
- ✅ 忘记密码
- ✅ 重置密码
- ✅ 邮箱验证
- ✅ 自动登录态管理
- ✅ 路由保护（middleware）

#### 使用 Server Actions

```typescript
// 在客户端组件中使用认证
"use client";

import { login, signup, logout } from "@/lib/actions/auth";

// 登录
async function handleLogin(formData: FormData) {
  const result = await login(formData);
  if (result?.error) {
    // 处理错误
  }
}

// 注册
async function handleSignup(formData: FormData) {
  const result = await signup(formData);
  if (result?.error) {
    // 处理错误
  }
}

// 登出
<form action={logout}>
  <button type="submit">退出登录</button>
</form>;
```

#### 获取当前用户

```typescript
// 在服务端组件中
import { createClient } from "@/lib/supabase/server";

export default async function ServerComponent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 用户未登录
    redirect("/login");
  }

  return <div>欢迎，{user.email}</div>;
}
```

#### 认证流程

1. **用户注册**：

   - 访问 `/register` 填写邮箱和密码
   - 提交后会收到验证邮件
   - 点击邮件中的链接完成验证
   - 自动跳转到首页

2. **用户登录**：

   - 访问 `/login` 输入邮箱和密码
   - 登录成功后跳转到首页或原访问页面

3. **忘记密码**：

   - 访问 `/forgot-password` 输入邮箱
   - 收到重置密码邮件
   - 点击邮件链接跳转到 `/auth/reset-password`
   - 设置新密码

4. **路由保护**：
   - 未登录用户访问受保护页面会自动跳转到登录页
   - 已登录用户访问登录/注册页会自动跳转到首页

### 文件上传

```typescript
// 上传头像
const { data, error } = await supabase.storage
  .from("avatars")
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: "3600",
    upsert: true,
  });

// 获取公开 URL
const {
  data: { publicUrl },
} = supabase.storage.from("avatars").getPublicUrl(`${userId}/avatar.png`);
```

### 脸型识别功能

项目已实现完整的脸型识别功能，包括：

#### 功能列表

- ✅ 拍照/相册选择上传
- ✅ 图片预览
- ✅ 上传到 Supabase Storage（face-scans 存储桶）
- ✅ AI 脸型识别（目前使用模拟数据，支持 6 种脸型）
- ✅ 识别结果展示（含置信度）
- ✅ 妆容建议展示
- ✅ 手动调整脸型结果
- ✅ 识别历史记录查看
- ✅ 删除识别记录
- ✅ 自动同步到用户资料

#### 支持的脸型

- 圆形脸 (round)
- 方形脸 (square)
- 鹅蛋脸 (oval)
- 长形脸 (long)
- 心形脸 (heart)
- 菱形脸 (diamond)

#### 使用 Server Actions

```typescript
// 上传并识别脸型
import { uploadAndRecognizeFace } from "@/lib/actions/face-scan";

const formData = new FormData();
formData.append("file", file);

const result = await uploadAndRecognizeFace(formData);
if (result.success) {
  console.log("识别结果:", result.data);
}

// 获取识别历史
import { getFaceScanHistory } from "@/lib/actions/face-scan";

const history = await getFaceScanHistory(10);

// 手动调整脸型
import { updateFaceShape } from "@/lib/actions/face-scan";

await updateFaceShape(scanId, "oval");

// 删除识别记录
import { deleteFaceScan } from "@/lib/actions/face-scan";

await deleteFaceScan(scanId);
```

#### AI 识别集成

目前使用模拟识别（随机返回脸型和置信度）。要集成真实的 AI 识别服务：

1. 打开 `lib/actions/face-scan.ts`
2. 找到 `simulateAIRecognition` 函数
3. 替换为实际的 AI API 调用

示例（使用第三方 AI 服务）：

```typescript
async function recognizeFace(imageUrl: string) {
  const response = await fetch("https://ai-api.example.com/face-analysis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });

  const data = await response.json();
  return {
    face_shape: data.faceShape,
    confidence: data.confidence,
  };
}
```

#### 页面访问

- `/scan` - 脸型识别页面
  - 上传照片
  - 查看识别结果
  - 手动调整脸型
  - 查看历史记录

### 用户资料编辑

项目已实现完整的用户资料编辑功能，包括：

#### 功能列表

- ✅ 头像上传和更新（使用 Supabase Storage）
- ✅ 昵称修改
- ✅ 个性签名编辑
- ✅ 肤质选择（油性/混合性/干性/敏感性）
- ✅ 肤色选择（8 种肤色色阶）
- ✅ 实时预览
- ✅ 表单验证

#### 使用说明

访问 `/profile/edit` 即可编辑个人资料。页面特性：

1. **头像上传**：点击头像右下角的编辑按钮选择图片，支持实时预览
2. **肤质选择**：下拉菜单选择最符合的肤质类型
3. **肤色选择**：点击色块选择最接近的肤色
4. **自动保存**：点击底部保存按钮，数据将自动同步到 Supabase

#### 数据库字段

编辑资料功能使用 `profiles` 表，包含以下字段：

- `username` - 用户昵称
- `bio` - 个性签名
- `avatar_url` - 头像 URL
- `skin_type` - 肤质类型
- `skin_tone` - 肤色代码

### 妆容详情页

项目已实现完整的妆容详情页功能，包括：

#### 功能列表

- ✅ 妆容图片展示（支持多图轮播）
- ✅ 作者信息展示
- ✅ 点赞、收藏、分享功能
- ✅ 妆容步骤教程（支持 JSON 格式）
- ✅ 标签和分类展示
- ✅ 互动数据统计
- ✅ 评论系统集成
- ✅ 视频教程支持

#### 页面访问

访问 `/makeup/[id]` 查看妆容详情，其中 `[id]` 是妆容帖子的 UUID。

#### 数据格式

妆容步骤教程使用 JSON 格式存储在 `content` 字段：

```json
[
  {
    "title": "步骤一：底妆",
    "description": "使用粉底液均匀涂抹...",
    "image": "https://example.com/step1.jpg"
  },
  {
    "title": "步骤二：眼妆",
    "description": "选择大地色眼影...",
    "image": "https://example.com/step2.jpg"
  }
]
```

### 评论系统

项目已实现完整的评论系统，包括：

#### 功能列表

- ✅ 发布评论
- ✅ 回复评论（嵌套评论）
- ✅ 删除自己的评论
- ✅ 评论点赞
- ✅ 实时评论数统计
- ✅ 评论列表分页

#### 数据库设置

在 Supabase SQL Editor 中执行 `supabase-comments-system.sql` 脚本创建评论表。

#### 使用 Server Actions

```typescript
import {
  createComment,
  getComments,
  deleteComment,
} from "@/lib/actions/comments";

// 获取评论列表
const comments = await getComments(postId, 50);

// 创建评论
await createComment(postId, "这个妆容真好看！");

// 回复评论
await createComment(postId, "谢谢！", parentCommentId);

// 删除评论
await deleteComment(commentId);
```

### 搜索功能

项目已实现完整的搜索功能，包括：

#### 功能列表

- ✅ 妆容搜索（标题、描述、标签）
- ✅ 实时搜索建议
- ✅ 热门搜索关键词
- ✅ 分类和脸型筛选
- ✅ 搜索历史记录（本地存储）

#### 页面访问

访问 `/search` 进入搜索页面。

#### 使用 Server Actions

```typescript
import {
  searchMakeupPosts,
  getHotSearchKeywords,
  getSearchSuggestions,
} from "@/lib/actions/search";

// 搜索妆容
const results = await searchMakeupPosts("日系妆容", "daily", "oval");

// 获取热门关键词
const hotKeywords = await getHotSearchKeywords(10);

// 获取搜索建议
const suggestions = await getSearchSuggestions("日系");
```

### 产品系统

项目已实现完整的产品系统，包括：

#### 功能列表

- ✅ 产品列表展示
- ✅ 产品详情页
- ✅ 产品搜索和筛选
- ✅ 产品分类管理
- ✅ 价格、评分、销量展示
- ✅ 外链购买支持
- ✅ 适配肤质和脸型推荐

#### 数据库设置

在 Supabase SQL Editor 中执行 `supabase-products-system.sql` 脚本创建产品表。

#### 使用 Server Actions

```typescript
import {
  getProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  getRecommendedProducts,
} from "@/lib/actions/products";

// 获取产品列表
const products = await getProducts("foundation", "base", 20);

// 获取产品详情
const product = await getProductById(productId);

// 搜索产品
const results = await searchProducts("粉底液", "foundation", 100, 500);

// 获取精选产品
const featured = await getFeaturedProducts(10);

// 获取推荐产品（基于肤质和脸型）
const recommended = await getRecommendedProducts("oily", "round");
```

#### 页面访问

- `/shop` - 产品列表（商城）
- `/shop/product/[id]` - 产品详情页

### Zustand 状态管理

项目使用 Zustand 进行客户端状态管理，包括：

#### 功能列表

- ✅ 搜索历史记录
- ✅ 用户主题偏好
- ✅ 浏览历史记录
- ✅ 产品浏览历史
- ✅ 筛选条件状态
- ✅ 本地持久化存储

#### 使用方法

```typescript
"use client";

import { useAppStore } from "@/lib/stores/useAppStore";

function Component() {
  const { searchHistory, addSearchHistory, theme, setTheme } = useAppStore();

  // 添加搜索历史
  function handleSearch(keyword: string) {
    addSearchHistory(keyword);
    // 执行搜索...
  }

  // 切换主题
  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return <div>...</div>;
}
```

## 🔍 数据库状态检查

如果遇到"表不存在"或数据查询错误，可以访问数据库状态检查工具：

**检查工具页面：** `/test-db/check-tables`

该页面会显示：

- ✅ 所有数据表的存在状态
- ✅ 每个表的记录数量
- ✅ 当前登录用户信息
- ✅ 详细的错误信息
- ✅ 数据库设置指南

**常见问题排查：**

1. **表不存在** → 按顺序执行 SQL 脚本
2. **表为空** → 执行示例数据脚本
3. **权限错误** → 检查 RLS 策略
4. **外键错误** → 执行修复脚本

## ⚠️ 已知问题和修复

### 1. makeup_posts 外键关系错误

**问题描述**：在查询 `makeup_posts` 表时出现外键关系找不到的错误。

**修复方法**：在 Supabase SQL Editor 中执行 `supabase-fix-makeup-posts-fk.sql` 脚本。

详细信息请查看：[修复 makeup_posts 外键问题](./docs/修复makeup_posts外键问题.md)

### 2. 获取妆容详情失败

**问题描述**：访问妆容详情页时提示"获取妆容详情失败"。

**可能原因：**

- `makeup_posts` 表未创建
- 表中没有数据
- 传入的 ID 不存在

**解决方法：**

1. 访问 `/test-db/check-tables` 检查表状态
2. 确保已执行 `supabase-makeup-posts.sql` 脚本
3. 执行 `supabase-insert-sample-data.sql` 添加示例数据
4. 检查 URL 中的 ID 是否正确

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC License

---

**妆娘 APP** - 让每个人都能找到最适合自己的妆容 💄✨
