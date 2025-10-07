-- ====================================
-- 妆容帖子表（makeup_posts）
-- ====================================

-- 创建妆容帖子表
CREATE TABLE IF NOT EXISTS public.makeup_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- 基本信息
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- 详细内容/教程
  
  -- 图片和视频
  cover_image TEXT NOT NULL, -- 封面图片 URL
  images TEXT[], -- 多张图片 URL 数组
  video_url TEXT, -- 视频 URL
  
  -- 分类和标签
  category TEXT DEFAULT 'daily', -- daily, party, business, date, interview
  face_shape TEXT, -- round, square, oval, long, heart, diamond
  tags TEXT[], -- 标签数组：如 ['日系', '清新', '自然']
  
  -- 互动数据
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  
  -- 状态
  is_featured BOOLEAN DEFAULT FALSE, -- 是否精选
  status TEXT DEFAULT 'published', -- draft, published, archived
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_makeup_posts_user_id ON public.makeup_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_makeup_posts_category ON public.makeup_posts(category);
CREATE INDEX IF NOT EXISTS idx_makeup_posts_face_shape ON public.makeup_posts(face_shape);
CREATE INDEX IF NOT EXISTS idx_makeup_posts_status ON public.makeup_posts(status);
CREATE INDEX IF NOT EXISTS idx_makeup_posts_created_at ON public.makeup_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_makeup_posts_is_featured ON public.makeup_posts(is_featured);

-- 创建全文搜索索引（用于标题和描述搜索）
-- 使用 'simple' 配置，支持基本的全文搜索
CREATE INDEX IF NOT EXISTS idx_makeup_posts_search ON public.makeup_posts 
USING gin(to_tsvector('simple', title || ' ' || COALESCE(description, '')));

-- 启用 Row Level Security (RLS)
ALTER TABLE public.makeup_posts ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人都可以查看已发布的帖子
CREATE POLICY "makeup_posts_select_policy" ON public.makeup_posts
  FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

-- RLS 策略：用户只能插入自己的帖子
CREATE POLICY "makeup_posts_insert_policy" ON public.makeup_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS 策略：用户只能更新自己的帖子
CREATE POLICY "makeup_posts_update_policy" ON public.makeup_posts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS 策略：用户只能删除自己的帖子
CREATE POLICY "makeup_posts_delete_policy" ON public.makeup_posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_makeup_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 绑定触发器
DROP TRIGGER IF EXISTS trigger_update_makeup_posts_updated_at ON public.makeup_posts;
CREATE TRIGGER trigger_update_makeup_posts_updated_at
  BEFORE UPDATE ON public.makeup_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_makeup_posts_updated_at();

-- ====================================
-- 妆容点赞表（makeup_likes）
-- ====================================

CREATE TABLE IF NOT EXISTS public.makeup_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.makeup_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 确保同一用户对同一帖子只能点赞一次
  UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_makeup_likes_user_id ON public.makeup_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_makeup_likes_post_id ON public.makeup_likes(post_id);

ALTER TABLE public.makeup_likes ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "makeup_likes_select_policy" ON public.makeup_likes
  FOR SELECT
  USING (true);

CREATE POLICY "makeup_likes_insert_policy" ON public.makeup_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "makeup_likes_delete_policy" ON public.makeup_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ====================================
-- 妆容收藏表（makeup_favorites）
-- ====================================

CREATE TABLE IF NOT EXISTS public.makeup_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.makeup_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_makeup_favorites_user_id ON public.makeup_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_makeup_favorites_post_id ON public.makeup_favorites(post_id);

ALTER TABLE public.makeup_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "makeup_favorites_select_policy" ON public.makeup_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "makeup_favorites_insert_policy" ON public.makeup_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "makeup_favorites_delete_policy" ON public.makeup_favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- ====================================
-- 更新点赞/收藏计数的触发器函数
-- ====================================

-- 更新点赞数
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.makeup_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.makeup_posts 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_likes_count ON public.makeup_likes;
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON public.makeup_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_likes_count();

-- 更新收藏数
CREATE OR REPLACE FUNCTION update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.makeup_posts 
    SET favorites_count = favorites_count + 1 
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.makeup_posts 
    SET favorites_count = GREATEST(favorites_count - 1, 0) 
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_favorites_count ON public.makeup_favorites;
CREATE TRIGGER trigger_update_favorites_count
  AFTER INSERT OR DELETE ON public.makeup_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_favorites_count();

-- ====================================
-- 插入示例数据
-- ====================================

-- 注意：需要先有用户数据才能插入帖子
-- 以下是示例数据插入脚本，实际使用时请替换 user_id

-- 插入示例妆容帖子（使用系统用户 ID）
-- 你需要先在 Supabase 中注册一个测试用户，然后获取其 UUID
-- 示例：
/*
INSERT INTO public.makeup_posts (
  user_id,
  title,
  description,
  cover_image,
  category,
  face_shape,
  tags,
  likes_count,
  views_count,
  is_featured
) VALUES
-- 精选帖子
(
  '替换为实际的用户UUID',
  '日系清透感妆容',
  '清新自然的日系妆容，展现真实之美',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
  'daily',
  'oval',
  ARRAY['日系', '清新', '自然'],
  1200,
  1234,
  true
),
-- 其他帖子
(
  '替换为实际的用户UUID',
  '夏日海边妆容',
  '清爽活力的夏日妆容',
  'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600&q=80',
  'daily',
  'round',
  ARRAY['夏日', '清爽', '活力'],
  345,
  567,
  false
),
(
  '替换为实际的用户UUID',
  '晚间约会妆容',
  '浪漫温柔的约会妆',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80',
  'date',
  'heart',
  ARRAY['约会', '浪漫', '温柔'],
  678,
  890,
  false
),
(
  '替换为实际的用户UUID',
  '清新日常妆容',
  '适合每天的自然妆',
  'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80',
  'daily',
  'oval',
  ARRAY['日常', '自然', '简单'],
  912,
  1100,
  false
),
(
  '替换为实际的用户UUID',
  '活力运动妆容',
  '持久不脱的运动妆',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&q=80',
  'daily',
  'square',
  ARRAY['运动', '持久', '防水'],
  1100,
  1500,
  false
),
(
  '替换为实际的用户UUID',
  '温柔约会妆容',
  '展现温柔气质',
  'https://images.unsplash.com/photo-1499310392430-c4b28c6b6b53?w=600&q=80',
  'date',
  'oval',
  ARRAY['约会', '温柔', '气质'],
  2300,
  3400,
  false
);
*/

COMMENT ON TABLE public.makeup_posts IS '妆容帖子表';
COMMENT ON TABLE public.makeup_likes IS '妆容点赞表';
COMMENT ON TABLE public.makeup_favorites IS '妆容收藏表';

