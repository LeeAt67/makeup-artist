-- ====================================
-- 修复评论系统外键关系
-- ====================================
-- 如果您已经执行过 supabase-comments-system.sql
-- 但遇到外键关系错误，请执行此脚本

-- 删除现有的评论相关表（按依赖顺序）
DROP TABLE IF EXISTS public.comment_likes CASCADE;
DROP TABLE IF EXISTS public.makeup_comments CASCADE;

-- 重新创建评论表（使用正确的外键引用）
CREATE TABLE IF NOT EXISTS public.makeup_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.makeup_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- 评论内容
  content TEXT NOT NULL CHECK (length(content) <= 500),
  
  -- 嵌套评论支持
  parent_id UUID REFERENCES public.makeup_comments(id) ON DELETE CASCADE,
  
  -- 互动数据
  likes_count INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_makeup_comments_post_id ON public.makeup_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_makeup_comments_user_id ON public.makeup_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_makeup_comments_parent_id ON public.makeup_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_makeup_comments_created_at ON public.makeup_comments(created_at DESC);

-- 启用 Row Level Security (RLS)
ALTER TABLE public.makeup_comments ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人都可以查看评论
CREATE POLICY "makeup_comments_select_policy" ON public.makeup_comments
  FOR SELECT
  USING (true);

-- RLS 策略：认证用户可以创建评论
CREATE POLICY "makeup_comments_insert_policy" ON public.makeup_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS 策略：用户只能更新自己的评论
CREATE POLICY "makeup_comments_update_policy" ON public.makeup_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS 策略：用户只能删除自己的评论
CREATE POLICY "makeup_comments_delete_policy" ON public.makeup_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_makeup_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 绑定触发器
DROP TRIGGER IF EXISTS trigger_update_makeup_comments_updated_at ON public.makeup_comments;
CREATE TRIGGER trigger_update_makeup_comments_updated_at
  BEFORE UPDATE ON public.makeup_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_makeup_comments_updated_at();

-- 创建更新帖子评论数的触发器函数
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- 新增评论，增加计数
    UPDATE public.makeup_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- 删除评论，减少计数
    UPDATE public.makeup_posts
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 绑定触发器
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON public.makeup_comments;
CREATE TRIGGER trigger_update_post_comments_count
  AFTER INSERT OR DELETE ON public.makeup_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- ====================================
-- 评论点赞表（comment_likes）
-- ====================================

CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.makeup_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 确保同一用户对同一评论只能点赞一次
  UNIQUE(user_id, comment_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);

-- 启用 Row Level Security (RLS)
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人都可以查看点赞
CREATE POLICY "comment_likes_select_policy" ON public.comment_likes
  FOR SELECT
  USING (true);

-- RLS 策略：认证用户可以点赞
CREATE POLICY "comment_likes_insert_policy" ON public.comment_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS 策略：用户只能取消自己的点赞
CREATE POLICY "comment_likes_delete_policy" ON public.comment_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建更新评论点赞数的触发器函数
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- 新增点赞，增加计数
    UPDATE public.makeup_comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- 删除点赞，减少计数
    UPDATE public.makeup_comments
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.comment_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 绑定触发器
DROP TRIGGER IF EXISTS trigger_update_comment_likes_count ON public.comment_likes;
CREATE TRIGGER trigger_update_comment_likes_count
  AFTER INSERT OR DELETE ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_likes_count();

