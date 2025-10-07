-- ====================================
-- 修复 makeup_posts 表的外键关系
-- ====================================
-- 此脚本修复 makeup_posts.user_id 的外键，使其引用 profiles(id) 而不是 auth.users(id)
-- 这样可以在 PostgREST 查询时正确关联 profiles 表

-- 1. 删除旧的外键约束
ALTER TABLE public.makeup_posts 
DROP CONSTRAINT IF EXISTS makeup_posts_user_id_fkey;

-- 2. 添加新的外键约束，引用 profiles 表
ALTER TABLE public.makeup_posts 
ADD CONSTRAINT makeup_posts_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 3. 验证外键是否创建成功
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'makeup_posts'
  AND kcu.column_name = 'user_id';

