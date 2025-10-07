# 🔧 数据库常见问题排查指南

## 快速诊断工具

**第一步：使用检查工具**

访问：`http://localhost:3000/test-db/check-tables`

该页面会显示所有表的状态，帮助您快速定位问题。

---

## 常见错误及解决方案

### 1️⃣ 表不存在错误

**错误信息：**

```
relation "xxx" does not exist
```

**原因：**

- 还没有执行相应的 SQL 脚本
- 执行顺序不正确

**解决方法：**

按顺序执行脚本（参考 [README.md](./README.md)）：

1. `supabase-setup.sql`
2. `supabase-makeup-posts.sql`
3. `supabase-comments-system.sql`
4. `supabase-products-system.sql`
5. `supabase-rpc-functions.sql`

---

### 2️⃣ 外键关系错误

**错误信息：**

```
Could not find a relationship between 'xxx' and 'yyy' in the schema cache
code: 'PGRST200'
```

**原因：**

- 表的外键引用了 `auth.users` 而不是 `public.profiles`
- PostgREST 无法识别跨 schema 的关联

**涉及的表：**

- `makeup_comments` - 评论表
- `comment_likes` - 评论点赞表

**解决方法：**

执行修复脚本：`database/supabase-fix-comments-fk.sql`

⚠️ 注意：会删除现有评论数据

---

### 3️⃣ 获取数据失败（空错误对象）

**错误信息：**

```
获取xxx失败: {}
```

**原因：**

- 表不存在
- 关联查询语法问题
- 权限问题（RLS）

**解决方法：**

1. **检查表是否存在**：访问 `/test-db/check-tables`
2. **检查 RLS 策略**：
   ```sql
   SELECT tablename, policyname
   FROM pg_policies
   WHERE schemaname = 'public';
   ```
3. **查看详细错误**：检查控制台输出的完整错误信息

**代码已优化：**

- 所有查询已改为分步查询
- 添加了详细的错误日志
- 提供了友好的错误提示

---

### 4️⃣ 插入数据失败

**错误信息：**

```
violates foreign key constraint
```

**原因：**

- 引用的记录不存在
- 用户未登录（user_id 为 null）

**解决方法：**

1. **确保用户已登录**：

   ```typescript
   const {
     data: { user },
   } = await supabase.auth.getUser();
   if (!user) {
     // 跳转到登录页
   }
   ```

2. **确保父记录存在**：
   - 创建评论前，确保 `makeup_posts` 记录存在
   - 创建点赞前，确保帖子或评论存在

---

### 5️⃣ RLS 权限错误

**错误信息：**

```
new row violates row-level security policy
permission denied for table xxx
```

**原因：**

- RLS 策略配置不正确
- 用户权限不足

**解决方法：**

1. **检查 RLS 策略**：

   ```sql
   SELECT * FROM pg_policies
   WHERE tablename = 'your_table_name';
   ```

2. **临时禁用 RLS（仅测试）**：

   ```sql
   ALTER TABLE your_table_name DISABLE ROW LEVEL SECURITY;
   ```

   ⚠️ 生产环境不要禁用 RLS！

3. **重新创建 RLS 策略**：
   重新执行相应的 SQL 脚本

---

### 6️⃣ 唯一约束冲突

**错误信息：**

```
duplicate key value violates unique constraint
```

**原因：**

- 尝试重复点赞
- 尝试重复收藏

**解决方法：**

这是正常的业务逻辑，代码应该处理这种情况：

```typescript
// 先检查是否已存在
const { data: existing } = await supabase
  .from("makeup_likes")
  .select("id")
  .eq("user_id", userId)
  .eq("post_id", postId)
  .single();

if (existing) {
  // 已点赞，执行取消点赞
} else {
  // 未点赞，执行点赞
}
```

---

## 🔍 调试技巧

### 1. 查看表结构

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'your_table_name';
```

### 2. 查看外键关系

```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'your_table_name';
```

### 3. 查看 RLS 策略

```sql
SELECT * FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4. 测试查询

在 Supabase Dashboard 的 SQL Editor 中直接测试：

```sql
-- 测试查询
SELECT * FROM makeup_posts LIMIT 5;

-- 测试关联查询
SELECT
  mp.*,
  p.username,
  p.avatar_url
FROM makeup_posts mp
LEFT JOIN profiles p ON p.id = mp.user_id
LIMIT 5;
```

---

## 📊 数据完整性检查

### 检查孤立记录

```sql
-- 检查没有对应用户的帖子
SELECT COUNT(*)
FROM makeup_posts
WHERE user_id NOT IN (SELECT id FROM profiles);

-- 检查没有对应帖子的评论
SELECT COUNT(*)
FROM makeup_comments
WHERE post_id NOT IN (SELECT id FROM makeup_posts);
```

### 检查计数器准确性

```sql
-- 检查点赞数是否准确
SELECT
  mp.id,
  mp.likes_count AS recorded_count,
  COUNT(ml.id) AS actual_count
FROM makeup_posts mp
LEFT JOIN makeup_likes ml ON ml.post_id = mp.id
GROUP BY mp.id, mp.likes_count
HAVING mp.likes_count != COUNT(ml.id);
```

---

## 🚨 紧急恢复

### 删除所有表（重新开始）

⚠️ **危险操作！会删除所有数据！**

```sql
-- 按依赖顺序删除表
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS makeup_comments CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS makeup_products CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS makeup_favorites CASCADE;
DROP TABLE IF EXISTS makeup_likes CASCADE;
DROP TABLE IF EXISTS makeup_posts CASCADE;
DROP TABLE IF EXISTS face_scans CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 然后重新执行所有 SQL 脚本
```

### 备份数据

```sql
-- 导出为 CSV（在 Supabase Dashboard 的表视图中）
-- 或使用 pg_dump

-- 恢复备份
-- 使用 Supabase Dashboard 的 Import 功能
```

---

## 📞 获取帮助

1. **查看文档**：

   - [README.md](./README.md) - 完整使用指南
   - [CHANGELOG.md](./CHANGELOG.md) - 更新日志
   - [项目 README](../README.md) - 项目总览

2. **使用检查工具**：

   - `/test-db/check-tables` - 数据库状态检查

3. **查看日志**：

   - 浏览器控制台
   - 服务器终端输出

4. **提交 Issue**：
   - 包含错误信息
   - 包含复现步骤
   - 包含数据库状态检查结果

---

**最后更新**：2025-10-07
