# 数据库脚本使用指南

本目录包含了妆娘 APP 所需的所有数据库 SQL 脚本。这些脚本用于在 Supabase 中创建表、索引、策略等。

## 📋 脚本执行顺序

**重要**：必须按照以下顺序执行脚本，因为表之间存在依赖关系。

### 1️⃣ 基础表结构

```sql
-- 执行顺序：1
database/supabase-setup.sql
```

**作用**：创建基础表和存储桶
- `profiles` 表（用户资料）
- `face_scans` 表（脸型识别记录）
- 存储桶（avatars, makeups, face-scans）
- RLS 策略和触发器

### 2️⃣ 妆容帖子系统

```sql
-- 执行顺序：2
database/supabase-makeup-posts.sql
```

**作用**：创建妆容帖子相关表
- `makeup_posts` 表（妆容帖子）
- `makeup_likes` 表（点赞）
- `makeup_favorites` 表（收藏）
- 自动更新点赞数和收藏数的触发器

### 3️⃣ 评论系统

```sql
-- 执行顺序：3
database/supabase-comments-system.sql
```

**作用**：创建评论系统表
- `makeup_comments` 表（评论）
- 支持嵌套评论（回复功能）
- 自动更新评论数的触发器

### 4️⃣ 产品系统

```sql
-- 执行顺序：4
database/supabase-products-system.sql
```

**作用**：创建产品系统表
- `products` 表（美妆产品）
- `product_categories` 表（产品分类）
- 全文搜索索引

### 5️⃣ 社交功能系统 ⭐ 新增

```sql
-- 执行顺序：5
database/supabase-social-system.sql
```

**作用**：创建社交功能表
- `user_follows` 表（用户关注关系）
- 在 `profiles` 表中添加关注数、粉丝数、帖子数字段
- 自动更新关注/粉丝数的触发器

### 6️⃣ RPC 函数

```sql
-- 执行顺序：6
database/supabase-rpc-functions.sql
```

**作用**：创建数据库函数
- 搜索函数
- 统计函数
- 其他辅助函数

### 7️⃣ 示例数据（可选）

```sql
-- 执行顺序：7（可选）
database/supabase-insert-sample-data-auto.sql
```

**作用**：插入示例数据用于测试
- ⚠️ 执行前需要先注册一个测试用户
- ⚠️ 替换脚本中的 `YOUR_USER_ID_HERE` 为实际的用户 UUID

## 🚀 如何执行脚本

### 方法一：在 Supabase Dashboard 中执行（推荐）

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New Query** 创建新查询
5. 复制脚本内容并粘贴
6. 点击 **Run** 执行
7. 按照上面的顺序依次执行所有脚本

### 方法二：使用 Supabase CLI

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接到你的项目
supabase link --project-ref <your-project-ref>

# 执行脚本
supabase db execute -f database/supabase-setup.sql
supabase db execute -f database/supabase-makeup-posts.sql
supabase db execute -f database/supabase-comments-system.sql
supabase db execute -f database/supabase-products-system.sql
supabase db execute -f database/supabase-social-system.sql
supabase db execute -f database/supabase-rpc-functions.sql
```

## 🔧 修复脚本

如果遇到问题，可以使用以下修复脚本：

### 修复妆容帖子外键

```sql
database/supabase-fix-makeup-posts-fk.sql
```

**使用场景**：当查询 `makeup_posts` 表时出现外键关系错误

### 修复评论系统外键

```sql
database/supabase-fix-comments-fk.sql
```

**使用场景**：当创建或查询评论时出现外键关系错误

⚠️ **注意**：执行修复脚本会删除并重新创建表，现有数据将丢失！

## 📊 验证安装

执行以下 SQL 查看已创建的表：

```sql
-- 查看所有表
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 查看存储桶
SELECT id, name, public 
FROM storage.buckets 
ORDER BY name;

-- 查看各表的记录数
SELECT 
  'profiles' as table_name, 
  COUNT(*) as row_count 
FROM public.profiles
UNION ALL
SELECT 'makeup_posts', COUNT(*) FROM public.makeup_posts
UNION ALL
SELECT 'makeup_likes', COUNT(*) FROM public.makeup_likes
UNION ALL
SELECT 'makeup_favorites', COUNT(*) FROM public.makeup_favorites
UNION ALL
SELECT 'makeup_comments', COUNT(*) FROM public.makeup_comments
UNION ALL
SELECT 'user_follows', COUNT(*) FROM public.user_follows
UNION ALL
SELECT 'products', COUNT(*) FROM public.products;
```

## 📝 表结构说明

### 核心表

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `profiles` | 用户资料 | username, avatar_url, followers_count, following_count, posts_count |
| `makeup_posts` | 妆容帖子 | title, cover_image, likes_count, favorites_count, comments_count |
| `makeup_likes` | 点赞记录 | user_id, post_id |
| `makeup_favorites` | 收藏记录 | user_id, post_id |
| `makeup_comments` | 评论 | user_id, post_id, parent_id, content |
| `user_follows` | 关注关系 | follower_id, following_id |
| `products` | 美妆产品 | name, price, category |
| `face_scans` | 脸型识别记录 | user_id, face_shape, confidence |

### 数据关系

```
profiles (用户)
  ├─ makeup_posts (1:N) - 发布的帖子
  ├─ makeup_likes (1:N) - 点赞的帖子
  ├─ makeup_favorites (1:N) - 收藏的帖子
  ├─ makeup_comments (1:N) - 发表的评论
  ├─ user_follows (follower) (1:N) - 关注的人
  ├─ user_follows (following) (1:N) - 粉丝
  └─ face_scans (1:N) - 脸型识别记录

makeup_posts (帖子)
  ├─ makeup_likes (1:N) - 点赞
  ├─ makeup_favorites (1:N) - 收藏
  └─ makeup_comments (1:N) - 评论

makeup_comments (评论)
  └─ makeup_comments (parent) (1:N) - 子评论（回复）
```

## 🔐 Row Level Security (RLS)

所有表都启用了 RLS，确保数据安全：

- **读取**：大部分表允许所有人查看已发布的内容
- **创建**：只能创建属于自己的记录
- **更新**：只能更新自己的记录
- **删除**：只能删除自己的记录

## ⚡ 触发器

自动维护计数字段：

- 点赞时自动更新 `makeup_posts.likes_count`
- 收藏时自动更新 `makeup_posts.favorites_count`
- 评论时自动更新 `makeup_posts.comments_count`
- 关注时自动更新 `profiles.followers_count` 和 `profiles.following_count`
- 发帖时自动更新 `profiles.posts_count`

## 🆘 常见问题

### Q1: 表已存在错误

**错误信息**: `relation "xxx" already exists`

**解决方法**: 脚本中使用了 `CREATE TABLE IF NOT EXISTS`，如果表已存在会跳过。如果需要重新创建，先删除表：

```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

### Q2: 外键关系错误

**错误信息**: `Could not find a relationship between...`

**解决方法**: 按照修复脚本章节执行对应的修复脚本。

### Q3: 用户 UUID 如何获取

在 Supabase Dashboard 中：
1. 点击左侧 **Authentication** → **Users**
2. 找到对应用户，点击查看详情
3. 复制 **User UID**

或者在应用中登录后，通过代码获取：

```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log(user.id); // 这就是 UUID
```

### Q4: 如何清空所有数据

```sql
-- 清空所有表（保留表结构）
TRUNCATE TABLE makeup_comments CASCADE;
TRUNCATE TABLE makeup_favorites CASCADE;
TRUNCATE TABLE makeup_likes CASCADE;
TRUNCATE TABLE makeup_posts CASCADE;
TRUNCATE TABLE user_follows CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE face_scans CASCADE;
-- profiles 表不要清空，会删除用户资料
```

## 📚 更多文档

- [项目架构文档](../docs/项目架构.md)
- [数据库设置指南](../docs/数据库设置指南.md)
- [故障排查](./TROUBLESHOOTING.md)
- [更新日志](./CHANGELOG.md)

## 🔄 更新记录

查看 [CHANGELOG.md](./CHANGELOG.md) 了解数据库结构的变更历史。

---

**妆娘 APP** - 数据库脚本管理 📦
