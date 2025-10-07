-- =====================================================
-- 用户资料表更新脚本
-- =====================================================
-- 如果你已经运行过旧版本的 supabase-setup.sql，
-- 请在 Supabase Dashboard 的 SQL Editor 中执行此脚本来更新表结构

-- 添加 bio 字段（如果不存在）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
END $$;

-- 更新 skin_type 检查约束
DO $$
BEGIN
  -- 删除旧的检查约束（如果存在）
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_skin_type_check' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_skin_type_check;
  END IF;
  
  -- 添加新的检查约束（包含 sensitive）
  ALTER TABLE profiles ADD CONSTRAINT profiles_skin_type_check 
    CHECK (skin_type IN ('dry', 'oily', 'combination', 'normal', 'sensitive'));
END $$;

-- 更新 skin_tone 检查约束（改为允许任意文本，用于存储颜色代码）
DO $$
BEGIN
  -- 删除旧的检查约束（如果存在）
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_skin_tone_check' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_skin_tone_check;
  END IF;
END $$;

-- 查看更新后的表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

