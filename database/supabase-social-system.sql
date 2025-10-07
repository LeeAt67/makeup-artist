-- ====================================
-- 社交功能系统（用户关注）
-- ====================================

-- 用户关注表
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 确保同一用户不能重复关注
  UNIQUE(follower_id, following_id),
  
  -- 确保用户不能关注自己
  CHECK (follower_id != following_id)
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON public.user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_created_at ON public.user_follows(created_at DESC);

-- 启用 Row Level Security (RLS)
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人都可以查看关注关系
CREATE POLICY "user_follows_select_policy" ON public.user_follows
  FOR SELECT
  USING (true);

-- RLS 策略：用户只能创建自己作为 follower 的关注关系
CREATE POLICY "user_follows_insert_policy" ON public.user_follows
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- RLS 策略：用户只能删除自己作为 follower 的关注关系
CREATE POLICY "user_follows_delete_policy" ON public.user_follows
  FOR DELETE
  USING (auth.uid() = follower_id);

-- ====================================
-- 在 profiles 表中添加关注数和粉丝数字段
-- ====================================

-- 检查列是否存在，如果不存在则添加
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'followers_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN followers_count INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'following_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN following_count INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'posts_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN posts_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- ====================================
-- 更新关注/粉丝计数的触发器函数
-- ====================================

-- 更新关注/粉丝数
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- 增加 follower 的关注数
    UPDATE public.profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    -- 增加 following 的粉丝数
    UPDATE public.profiles 
    SET followers_count = followers_count + 1 
    WHERE id = NEW.following_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- 减少 follower 的关注数
    UPDATE public.profiles 
    SET following_count = GREATEST(following_count - 1, 0) 
    WHERE id = OLD.follower_id;
    
    -- 减少 following 的粉丝数
    UPDATE public.profiles 
    SET followers_count = GREATEST(followers_count - 1, 0) 
    WHERE id = OLD.following_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_follow_counts ON public.user_follows;
CREATE TRIGGER trigger_update_follow_counts
  AFTER INSERT OR DELETE ON public.user_follows
  FOR EACH ROW
  EXECUTE FUNCTION update_follow_counts();

-- ====================================
-- 更新帖子数的触发器函数
-- ====================================

CREATE OR REPLACE FUNCTION update_posts_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles 
    SET posts_count = posts_count + 1 
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles 
    SET posts_count = GREATEST(posts_count - 1, 0) 
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_posts_count ON public.makeup_posts;
CREATE TRIGGER trigger_update_posts_count
  AFTER INSERT OR DELETE ON public.makeup_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_posts_count();

-- ====================================
-- 初始化现有数据的计数
-- ====================================

-- 更新现有用户的关注数和粉丝数
UPDATE public.profiles p
SET 
  followers_count = (
    SELECT COUNT(*) FROM public.user_follows 
    WHERE following_id = p.id
  ),
  following_count = (
    SELECT COUNT(*) FROM public.user_follows 
    WHERE follower_id = p.id
  ),
  posts_count = (
    SELECT COUNT(*) FROM public.makeup_posts 
    WHERE user_id = p.id AND status = 'published'
  );

-- ====================================
-- 添加注释
-- ====================================

COMMENT ON TABLE public.user_follows IS '用户关注关系表';
COMMENT ON COLUMN public.profiles.followers_count IS '粉丝数';
COMMENT ON COLUMN public.profiles.following_count IS '关注数';
COMMENT ON COLUMN public.profiles.posts_count IS '发布的帖子数';

-- ====================================
-- 查看结果
-- ====================================

SELECT 
  'user_follows' as table_name, 
  COUNT(*) as row_count 
FROM public.user_follows
UNION ALL
SELECT 
  'profiles with social counts' as table_name, 
  COUNT(*) as row_count 
FROM public.profiles 
WHERE followers_count IS NOT NULL;

