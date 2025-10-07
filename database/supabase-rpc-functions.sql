-- ====================================
-- Supabase RPC 函数
-- ====================================
-- 这些函数用于执行特定的数据库操作

-- 增加妆容帖子的浏览数
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.makeup_posts
  SET views_count = views_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 为函数添加注释
COMMENT ON FUNCTION increment_view_count IS '增加指定妆容帖子的浏览数';

-- 批量更新妆容帖子的互动统计
-- 这个函数会自动计算并更新点赞数、收藏数等
CREATE OR REPLACE FUNCTION update_post_stats(post_id UUID)
RETURNS VOID AS $$
DECLARE
  v_likes_count INTEGER;
  v_favorites_count INTEGER;
BEGIN
  -- 计算点赞数
  SELECT COUNT(*) INTO v_likes_count
  FROM public.makeup_likes
  WHERE makeup_likes.post_id = update_post_stats.post_id;
  
  -- 计算收藏数
  SELECT COUNT(*) INTO v_favorites_count
  FROM public.makeup_favorites
  WHERE makeup_favorites.post_id = update_post_stats.post_id;
  
  -- 更新帖子统计
  UPDATE public.makeup_posts
  SET 
    likes_count = v_likes_count,
    favorites_count = v_favorites_count
  WHERE id = update_post_stats.post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_post_stats IS '更新指定妆容帖子的互动统计数据';

-- 获取用户的点赞状态（批量）
CREATE OR REPLACE FUNCTION get_user_liked_posts(p_user_id UUID, p_post_ids UUID[])
RETURNS TABLE(post_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT makeup_likes.post_id
  FROM public.makeup_likes
  WHERE makeup_likes.user_id = p_user_id
    AND makeup_likes.post_id = ANY(p_post_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_liked_posts IS '获取用户对指定帖子列表的点赞状态';

-- 获取用户的收藏状态（批量）
CREATE OR REPLACE FUNCTION get_user_favorited_posts(p_user_id UUID, p_post_ids UUID[])
RETURNS TABLE(post_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT makeup_favorites.post_id
  FROM public.makeup_favorites
  WHERE makeup_favorites.user_id = p_user_id
    AND makeup_favorites.post_id = ANY(p_post_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_favorited_posts IS '获取用户对指定帖子列表的收藏状态';

