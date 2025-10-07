-- 为 profiles 表添加手机号字段
-- 执行此 SQL 以支持手机号认证

-- 添加 phone 列
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone text;

-- 创建唯一索引确保手机号唯一
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_key ON profiles(phone);

-- 添加注释
COMMENT ON COLUMN profiles.phone IS '用户手机号（唯一）';

