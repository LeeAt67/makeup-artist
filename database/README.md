# 数据库 SQL 脚本说明

本目录包含所有 Supabase 数据库的 SQL 脚本。请按照以下顺序执行脚本以正确设置数据库。

## 📋 执行顺序

### 第一步：基础设置

#### 1. `supabase-setup.sql` - 基础表结构 ⭐ 必须先执行

创建以下基础表：

- `profiles` - 用户资料表
- `makeups` - 旧版妆容表（已弃用）
- `favorites` - 收藏表
- `face_scans` - 脸型识别记录表

**执行时机**：项目初始化时第一个执行

---

### 第二步：核心功能表

#### 2. `supabase-makeup-posts.sql` - 妆容帖子系统 ⭐ 核心功能

创建以下表：

- `makeup_posts` - 妆容帖子表（主表）
- `makeup_likes` - 帖子点赞表
- `makeup_favorites` - 帖子收藏表

**功能**：支持妆容内容的发布、点赞、收藏

**执行时机**：在 `supabase-setup.sql` 之后执行

---

#### 3. `supabase-comments-system.sql` - 评论系统 ⭐ 核心功能

创建以下表：

- `makeup_comments` - 评论表（支持嵌套评论）
- `comment_likes` - 评论点赞表

**功能**：支持评论、回复、点赞评论

**注意**：此脚本已修复外键关系问题，`user_id` 引用 `public.profiles`

**执行时机**：在 `supabase-makeup-posts.sql` 之后执行

---

#### 4. `supabase-products-system.sql` - 产品系统 ⭐ 核心功能

创建以下表：

- `products` - 产品表
- `product_reviews` - 产品评价表
- `makeup_products` - 妆容产品关联表

**功能**：支持美妆产品展示、评价、与妆容关联

**执行时机**：在 `supabase-makeup-posts.sql` 之后执行

---

#### 5. `supabase-rpc-functions.sql` - RPC 函数

创建数据库函数：

- `increment_view_count()` - 增加浏览数（如果使用）
- 其他辅助函数

**功能**：提供数据库级别的功能函数

**执行时机**：在所有表创建完成后执行

---

### 第三步：数据迁移（可选）

#### 6. `supabase-migration-phone.sql` - 手机号认证迁移

添加手机号认证相关字段和功能

**执行时机**：仅在需要手机号认证时执行

---

#### 7. `supabase-migration-profile-update.sql` - 用户资料字段更新

更新用户资料表字段（如添加 `bio` 字段）

**执行时机**：在 `supabase-setup.sql` 之后，需要扩展用户资料功能时执行

---

### 第四步：示例数据（开发测试）

#### 8. `supabase-insert-sample-data.sql` - 示例数据（手动版）

插入测试数据，包括：

- 示例妆容帖子
- 示例产品
- 示例评论

**注意**：需要手动替换脚本中的用户 UUID

**执行时机**：开发测试时执行，生产环境不要执行

---

#### 9. `supabase-insert-sample-data-auto.sql` - 示例数据（自动版）

自动插入测试数据（无需手动修改 UUID）

**执行时机**：开发测试时执行，生产环境不要执行

---

## 🔧 修复脚本（故障排查）

### `supabase-fix-makeup-posts-fk.sql` - 修复妆容表外键

**问题**：`makeup_posts` 表外键关系错误

**症状**：查询妆容时出现外键关系找不到的错误

**解决**：删除并重新创建 `makeup_posts` 相关表

**⚠️ 警告**：会删除所有妆容数据

**执行时机**：仅在遇到相关错误时执行

---

### `supabase-fix-comments-fk.sql` - 修复评论表外键

**问题**：`makeup_comments` 表的 `user_id` 引用 `auth.users` 导致关系识别失败

**症状**：创建评论时提示 "Could not find a relationship between 'makeup_comments' and 'user_id'"

**解决**：删除并重新创建评论表，使用正确的外键引用（`public.profiles`）

**⚠️ 警告**：会删除所有评论数据

**执行时机**：仅在遇到相关错误时执行

---

## 🚀 完整初始化流程

### 新项目初始化

```bash
# 1. 基础表
执行: supabase-setup.sql

# 2. 核心功能表
执行: supabase-makeup-posts.sql
执行: supabase-comments-system.sql
执行: supabase-products-system.sql

# 3. RPC 函数
执行: supabase-rpc-functions.sql

# 4. 示例数据（可选）
执行: supabase-insert-sample-data-auto.sql
```

### 总执行时间

约 2-5 分钟（取决于网络速度）

---

## 📝 执行方式

### 在 Supabase Dashboard 中执行

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New Query**
5. 复制脚本内容并粘贴
6. 点击 **Run** 执行
7. 检查执行结果（成功/错误）

### 使用 Supabase CLI（高级）

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接到项目
supabase link --project-ref your-project-ref

# 执行脚本
supabase db execute --file database/supabase-setup.sql
supabase db execute --file database/supabase-makeup-posts.sql
# ... 依次执行其他脚本
```

---

## ✅ 验证数据库设置

执行完脚本后，访问应用的数据库检查工具：

```
http://localhost:3000/test-db/check-tables
```

该页面会显示：

- ✅ 所有表的存在状态
- ✅ 每个表的记录数量
- ✅ 错误信息（如果有）

---

## 🎯 核心表依赖关系

```
auth.users (Supabase 内置)
    ↓
profiles (用户资料)
    ↓
    ├── makeup_posts (妆容帖子)
    │   ├── makeup_likes (点赞)
    │   ├── makeup_favorites (收藏)
    │   ├── makeup_comments (评论)
    │   │   └── comment_likes (评论点赞)
    │   └── makeup_products (关联产品)
    │
    ├── products (产品)
    │   ├── product_reviews (评价)
    │   └── makeup_products (关联妆容)
    │
    └── face_scans (脸型识别)
```

---

## ⚠️ 常见问题

### 1. 表已存在错误

**错误信息**：`relation "xxx" already exists`

**解决方法**：

- 脚本使用 `CREATE TABLE IF NOT EXISTS`，可以安全重复执行
- 如需完全重建，先删除表再执行脚本

### 2. 外键约束错误

**错误信息**：`violates foreign key constraint`

**解决方法**：

- 检查表的执行顺序
- 确保被引用的表已存在
- 使用修复脚本重新创建

### 3. 权限错误

**错误信息**：`permission denied`

**解决方法**：

- 确保在 Supabase Dashboard 的 SQL Editor 中执行
- 检查项目权限设置

### 4. 脚本执行部分成功

**解决方法**：

- 查看错误提示，找到失败的语句
- 单独执行失败的部分
- 或使用修复脚本重新创建

---

## 📦 备份与恢复

### 备份数据

```sql
-- 导出所有数据
SELECT * FROM profiles;
SELECT * FROM makeup_posts;
-- ... 导出其他表
```

### 恢复数据

使用 Supabase Dashboard 的 **Database** → **Backups** 功能

---

## 📚 相关文档

- [Supabase 文档](https://supabase.com/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [项目 README](../README.md)
- [数据库设置指南](../docs/数据库设置指南.md)
- [API 文档](../docs/API文档.md)

---

## 🔄 版本历史

### v1.2.0 (2025-10-07)

- ✅ 修复评论系统外键关系问题
- ✅ 添加产品系统
- ✅ 优化脚本注释和文档

### v1.1.0

- ✅ 添加评论系统
- ✅ 添加妆容帖子系统

### v1.0.0

- ✅ 初始版本
- ✅ 基础表结构

---

**最后更新**：2025-10-07  
**维护者**：妆娘 APP 开发团队
