-- ====================================
-- 修复产品评价表的外键关系
-- ====================================
-- 将 product_reviews 表的 user_id 外键从 auth.users 改为 public.profiles
-- 这样才能在查询时正确关联 profiles 表获取用户信息

-- 1. 先删除旧的外键约束
ALTER TABLE public.product_reviews 
DROP CONSTRAINT IF EXISTS product_reviews_user_id_fkey;

-- 2. 添加新的外键约束，引用 profiles 表
ALTER TABLE public.product_reviews 
ADD CONSTRAINT product_reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 验证修改
SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE conrelid = 'public.product_reviews'::regclass
  AND contype = 'f';

