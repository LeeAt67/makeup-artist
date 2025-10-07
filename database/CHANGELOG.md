# 数据库脚本更新日志

## 2025-10-07 - 清理重复表定义

### 🔧 修复的问题

**问题**：`supabase-setup.sql` 和 `supabase-makeup-posts.sql` 中有重复的表定义，导致混淆。

### ✅ 已清理的重复表

#### 1. 妆容表

- ❌ **已移除**：`makeups` 表（在 supabase-setup.sql 中）
  - 旧版设计，引用 `auth.users`
  - 字段不完整，缺少现代功能
- ✅ **保留使用**：`makeup_posts` 表（在 supabase-makeup-posts.sql 中）
  - 新版设计，引用 `public.profiles`
  - 包含完整功能：分类、标签、多图、评论数等
  - 这是项目实际使用的表

#### 2. 收藏表

- ❌ **已移除**：`favorites` 表（在 supabase-setup.sql 中）
  - 引用已弃用的 `makeups` 表
  - 字段名为 `makeup_id`
- ✅ **保留使用**：`makeup_favorites` 表（在 supabase-makeup-posts.sql 中）
  - 引用新的 `makeup_posts` 表
  - 字段名为 `post_id`
  - 这是项目实际使用的表

### 📝 修改内容

**supabase-setup.sql 的变更：**

```diff
- -- 妆容表
- create table if not exists makeups (
-   ...
- );
-
- -- 收藏表
- create table if not exists favorites (
-   ...
- );

+ -- =====================================================
+ -- 注意：妆容表和收藏表已移至 supabase-makeup-posts.sql
+ -- =====================================================
+ -- 旧版 makeups 表已弃用，请使用 makeup_posts 表
+ -- 旧版 favorites 表已弃用，请使用 makeup_favorites 表
+ -- =====================================================
```

同时移除了相关的 RLS 策略和索引定义。

### 📋 现在的表结构

**supabase-setup.sql** 现在只包含：

- ✅ `profiles` - 用户资料表
- ✅ `face_scans` - 脸型识别记录表

**supabase-makeup-posts.sql** 包含：

- ✅ `makeup_posts` - 妆容帖子表（主表）
- ✅ `makeup_likes` - 点赞表
- ✅ `makeup_favorites` - 收藏表

### 🚨 迁移指南

#### 如果您已经创建了旧表

如果您之前执行了包含旧表的 `supabase-setup.sql`，不用担心：

1. **新项目**：直接使用新的脚本，旧表会被忽略（因为使用了 `IF NOT EXISTS`）
2. **现有项目**：
   - 如果没有数据，可以删除旧表：
     ```sql
     DROP TABLE IF EXISTS favorites CASCADE;
     DROP TABLE IF EXISTS makeups CASCADE;
     ```
   - 如果有数据，建议先导出数据再迁移

#### 数据迁移脚本（如果需要）

```sql
-- 从旧表迁移到新表（仅在有旧数据时使用）
INSERT INTO makeup_posts (
  id, user_id, title, description, cover_image,
  video_url, category, face_shape, likes_count, views_count, created_at
)
SELECT
  id,
  author_id,
  title,
  description,
  image_url,
  video_url,
  CASE
    WHEN 'daily' = ANY(scenes) THEN 'daily'
    WHEN 'party' = ANY(scenes) THEN 'party'
    ELSE 'daily'
  END as category,
  CASE
    WHEN 'round' = ANY(face_shapes) THEN 'round'
    WHEN 'oval' = ANY(face_shapes) THEN 'oval'
    ELSE NULL
  END as face_shape,
  likes_count,
  views_count,
  created_at
FROM makeups
WHERE author_id IN (SELECT id FROM profiles);

-- 迁移收藏记录
INSERT INTO makeup_favorites (user_id, post_id, created_at)
SELECT user_id, makeup_id, created_at
FROM favorites
WHERE makeup_id IN (SELECT id FROM makeup_posts);
```

### ⚠️ 注意事项

1. **新部署**：按照 `database/README.md` 的顺序执行脚本即可
2. **现有项目**：
   - 如果使用旧表且有数据，需要先迁移数据
   - 如果没有数据，直接删除旧表即可
3. **代码更新**：确保所有代码引用的是 `makeup_posts` 而不是 `makeups`

### ✅ 验证

执行脚本后，访问 `/test-db/check-tables` 检查：

- ✅ `makeup_posts` 表存在
- ✅ `makeup_favorites` 表存在
- ✅ `profiles` 表存在
- ✅ `face_scans` 表存在
- ❌ 不应该看到 `makeups` 或 `favorites` 表（除非是旧项目）

---

**更新时间**：2025-10-07  
**影响范围**：数据库表结构  
**向后兼容**：是（旧表不会自动删除）
