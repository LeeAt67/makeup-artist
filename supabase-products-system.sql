-- ====================================
-- 产品系统表（products）
-- ====================================

-- 创建产品表
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- foundation, eyeshadow, lipstick, blush, etc.
  sub_category TEXT, -- base, eye, lip, face, tools, etc.
  
  -- 图片
  cover_image TEXT NOT NULL,
  images TEXT[], -- 多张产品图片
  
  -- 价格信息
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- 原价（用于显示折扣）
  currency TEXT DEFAULT 'CNY',
  
  -- 产品详情
  specifications JSONB, -- 规格信息：{ "color": "01 自然色", "volume": "30ml" }
  features TEXT[], -- 产品特点标签
  ingredients TEXT, -- 成分信息
  
  -- 适用信息
  suitable_skin_types TEXT[], -- 适合的肤质
  suitable_face_shapes TEXT[], -- 适合的脸型
  
  -- 购买信息
  affiliate_link TEXT, -- 联盟链接或购买链接
  platform TEXT, -- 购买平台：taobao, jd, tmall, douyin, etc.
  
  -- 评分和统计
  rating DECIMAL(2, 1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  
  -- 状态
  is_featured BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'published', -- draft, published, archived
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON public.products(sub_category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_sales ON public.products(sales_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);

-- 创建全文搜索索引
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products 
USING gin(to_tsvector('simple', name || ' ' || brand || ' ' || COALESCE(description, '')));

-- 启用 Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人都可以查看已发布的产品
CREATE POLICY "products_select_policy" ON public.products
  FOR SELECT
  USING (status = 'published' AND is_available = true);

-- 创建更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 绑定触发器
DROP TRIGGER IF EXISTS trigger_update_products_updated_at ON public.products;
CREATE TRIGGER trigger_update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- ====================================
-- 产品评价表（product_reviews）
-- ====================================

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 评价内容
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  images TEXT[], -- 晒单图片
  
  -- 统计
  likes_count INTEGER DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 确保同一用户对同一产品只能评价一次
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);

-- 启用 Row Level Security (RLS)
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人都可以查看评价
CREATE POLICY "product_reviews_select_policy" ON public.product_reviews
  FOR SELECT
  USING (true);

-- RLS 策略：认证用户可以创建评价
CREATE POLICY "product_reviews_insert_policy" ON public.product_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS 策略：用户只能更新自己的评价
CREATE POLICY "product_reviews_update_policy" ON public.product_reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS 策略：用户只能删除自己的评价
CREATE POLICY "product_reviews_delete_policy" ON public.product_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建更新产品评分的触发器函数
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(2, 1);
  review_count INTEGER;
BEGIN
  -- 计算产品的平均评分和评价数量
  SELECT 
    ROUND(AVG(rating)::numeric, 1),
    COUNT(*)
  INTO avg_rating, review_count
  FROM public.product_reviews
  WHERE product_id = COALESCE(NEW.product_id, OLD.product_id);
  
  -- 更新产品表
  UPDATE public.products
  SET 
    rating = COALESCE(avg_rating, 0),
    reviews_count = review_count
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 绑定触发器
DROP TRIGGER IF EXISTS trigger_update_product_rating ON public.product_reviews;
CREATE TRIGGER trigger_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- ====================================
-- 妆容产品关联表（makeup_products）
-- ====================================
-- 用于关联妆容帖子和推荐的产品

CREATE TABLE IF NOT EXISTS public.makeup_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  makeup_post_id UUID NOT NULL REFERENCES public.makeup_posts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- 关联信息
  usage_note TEXT, -- 使用说明："用于底妆"、"用于眼影"等
  step_number INTEGER, -- 使用步骤序号
  is_essential BOOLEAN DEFAULT false, -- 是否是必需品
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 确保同一妆容不重复推荐同一产品
  UNIQUE(makeup_post_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_makeup_products_post_id ON public.makeup_products(makeup_post_id);
CREATE INDEX IF NOT EXISTS idx_makeup_products_product_id ON public.makeup_products(product_id);

-- 启用 Row Level Security (RLS)
ALTER TABLE public.makeup_products ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人都可以查看产品关联
CREATE POLICY "makeup_products_select_policy" ON public.makeup_products
  FOR SELECT
  USING (true);

