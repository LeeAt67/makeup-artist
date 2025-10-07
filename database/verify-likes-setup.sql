-- ====================================
-- 爱心点赞功能验证脚本
-- ====================================
-- 此脚本用于验证点赞功能的数据库设置是否正确

-- 1. 检查 makeup_posts 表的 likes_count 字段
SELECT 
  column_name,
  column_default,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'makeup_posts' 
  AND column_name = 'likes_count';
-- 预期: column_default = 0, data_type = integer

-- 2. 检查 makeup_likes 表是否存在
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_name = 'makeup_likes';
-- 预期: 返回一行记录

-- 3. 检查触发器是否正确创建
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'trigger_update_likes_count';
-- 预期: 返回 INSERT 和 DELETE 两个触发器

-- 4. 检查触发器函数是否存在
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_name = 'update_likes_count';
-- 预期: routine_type = FUNCTION

-- 5. 查看所有帖子的初始点赞数
SELECT 
  id,
  title,
  likes_count,
  created_at
FROM makeup_posts
ORDER BY created_at DESC
LIMIT 10;
-- 预期: likes_count 应该都是 0（如果是新帖子）

-- 6. 检查是否有点赞记录
SELECT 
  COUNT(*) as total_likes,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT post_id) as liked_posts
FROM makeup_likes;
-- 返回当前点赞统计

-- 7. 验证点赞数和实际记录是否匹配
SELECT 
  p.id,
  p.title,
  p.likes_count as post_likes_count,
  COUNT(l.id) as actual_likes_count,
  CASE 
    WHEN p.likes_count = COUNT(l.id) THEN '✅ 匹配'
    ELSE '❌ 不匹配'
  END as status
FROM makeup_posts p
LEFT JOIN makeup_likes l ON p.id = l.post_id
GROUP BY p.id, p.title, p.likes_count
HAVING p.likes_count != COUNT(l.id);
-- 如果返回空结果 = 所有数据一致
-- 如果有结果 = 数据不一致，需要修复

-- 8. 检查唯一约束是否生效
SELECT 
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'makeup_likes' 
  AND constraint_type = 'UNIQUE';
-- 预期: 应该有一个 UNIQUE 约束（user_id, post_id）

-- ====================================
-- 测试数据插入（可选，用于测试）
-- ====================================

-- 注意：以下是测试脚本，仅在测试环境运行
-- 取消注释以执行测试

/*
-- 获取一个测试用户ID和帖子ID
DO $$
DECLARE
  test_user_id UUID;
  test_post_id UUID;
  initial_count INTEGER;
  final_count INTEGER;
BEGIN
  -- 获取第一个用户
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- 获取第一个帖子
  SELECT id INTO test_post_id FROM makeup_posts LIMIT 1;
  
  IF test_user_id IS NULL OR test_post_id IS NULL THEN
    RAISE NOTICE '需要先创建用户和帖子才能测试';
    RETURN;
  END IF;
  
  -- 记录初始点赞数
  SELECT likes_count INTO initial_count FROM makeup_posts WHERE id = test_post_id;
  RAISE NOTICE '初始点赞数: %', initial_count;
  
  -- 测试1: 插入点赞
  INSERT INTO makeup_likes (user_id, post_id)
  VALUES (test_user_id, test_post_id)
  ON CONFLICT (user_id, post_id) DO NOTHING;
  
  -- 检查点赞数是否增加
  SELECT likes_count INTO final_count FROM makeup_posts WHERE id = test_post_id;
  RAISE NOTICE '点赞后: %', final_count;
  
  IF final_count = initial_count + 1 THEN
    RAISE NOTICE '✅ 点赞触发器工作正常';
  ELSE
    RAISE NOTICE '❌ 点赞触发器异常';
  END IF;
  
  -- 测试2: 删除点赞
  DELETE FROM makeup_likes 
  WHERE user_id = test_user_id AND post_id = test_post_id;
  
  -- 检查点赞数是否减少
  SELECT likes_count INTO final_count FROM makeup_posts WHERE id = test_post_id;
  RAISE NOTICE '取消点赞后: %', final_count;
  
  IF final_count = initial_count THEN
    RAISE NOTICE '✅ 取消点赞触发器工作正常';
  ELSE
    RAISE NOTICE '❌ 取消点赞触发器异常';
  END IF;
  
END $$;
*/

-- ====================================
-- 数据修复脚本（如果发现不一致）
-- ====================================

/*
-- 如果发现 likes_count 与实际点赞数不一致，运行此脚本修复
UPDATE makeup_posts p
SET likes_count = (
  SELECT COUNT(*)
  FROM makeup_likes l
  WHERE l.post_id = p.id
);

-- 验证修复结果
SELECT 
  p.id,
  p.title,
  p.likes_count,
  COUNT(l.id) as actual_count
FROM makeup_posts p
LEFT JOIN makeup_likes l ON p.id = l.post_id
GROUP BY p.id, p.title, p.likes_count;
*/

