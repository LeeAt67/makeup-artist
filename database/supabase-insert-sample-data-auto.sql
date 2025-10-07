-- ====================================
-- 自动插入示例数据脚本（无需手动替换 UUID）
-- ====================================
-- 此脚本会自动使用数据库中第一个用户的 UUID

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- 获取第一个用户的 UUID
  SELECT id INTO v_user_id 
  FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1;
  
  -- 检查是否有用户
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '没有找到用户！请先注册一个测试用户。';
  END IF;
  
  RAISE NOTICE '使用用户 UUID: %', v_user_id;
  
  -- 插入示例妆容帖子
  INSERT INTO public.makeup_posts (
    user_id,
    title,
    description,
    content,
    cover_image,
    category,
    face_shape,
    tags,
    likes_count,
    views_count,
    is_featured,
    status
  ) VALUES
  -- 1. 精选帖子 - 日系清透感妆容
  (
    v_user_id,
    '日系清透感妆容',
    '清新自然的日系妆容，展现真实之美',
    '# 日系清透感妆容教程

## 适合脸型
鹅蛋脸、圆脸

## 妆容步骤

### 1. 底妆
- 选择轻薄的气垫粉底，营造自然透明感
- 重点遮瑕眼周和痘印
- 定妆粉轻轻按压，保持通透感

### 2. 眉毛
- 选择与发色相近的眉笔
- 画出自然的野生眉
- 眉头淡、眉尾略深

### 3. 眼妆
- 大地色眼影打底
- 眼尾稍加深色
- 细细的眼线，只画眼尾
- 下睫毛重点刷

### 4. 腮红
- 粉色系腮红
- 从颧骨斜向太阳穴方向晕染

### 5. 唇妆
- 水润的粉色唇釉
- 不要画唇线，营造自然感',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80',
    'daily',
    'oval',
    ARRAY['日系', '清新', '自然', '透明感'],
    1200,
    1234,
    true,
    'published'
  ),

  -- 2. 夏日海边妆容
  (
    v_user_id,
    '夏日海边妆容',
    '清爽活力的夏日妆容，防水持久不脱妆',
    '# 夏日海边妆容

## 核心要点
- 防水防汗
- 清爽不厚重
- 活力有气色

## 产品推荐
- 防水粉底液
- 防水眼线笔
- 染唇液',
    'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600&q=80',
    'daily',
    'round',
    ARRAY['夏日', '清爽', '活力', '防水'],
    345,
    567,
    false,
    'published'
  ),

  -- 3. 晚间约会妆容
  (
    v_user_id,
    '晚间约会妆容',
    '浪漫温柔的约会妆，打造迷人氛围感',
    '# 晚间约会妆容

## 适合场景
- 烛光晚餐
- 电影约会
- 浪漫散步

## 妆容重点
- 微微闪光的眼影
- 饱满的红唇
- 精致的眼线',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80',
    'date',
    'heart',
    ARRAY['约会', '浪漫', '温柔', '氛围感'],
    678,
    890,
    false,
    'published'
  ),

  -- 4. 清新日常妆容
  (
    v_user_id,
    '清新日常妆容',
    '适合每天的自然妆，简单快速上手',
    '# 清新日常妆容

## 5分钟快速妆容

### 简化步骤
1. 防晒 + BB霜
2. 眉笔快速画眉
3. 睫毛膏刷睫毛
4. 唇膏涂抹',
    'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80',
    'daily',
    'oval',
    ARRAY['日常', '自然', '简单', '快速'],
    912,
    1100,
    false,
    'published'
  ),

  -- 5. 活力运动妆容
  (
    v_user_id,
    '活力运动妆容',
    '持久不脱的运动妆，保持好气色',
    '# 活力运动妆容

## 核心要求
- 轻薄透气
- 防水防汗
- 持久定妆

## 妆容技巧
- 选择控油型底妆
- 使用防水睫毛膏
- 染唇液代替口红',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&q=80',
    'daily',
    'square',
    ARRAY['运动', '持久', '防水', '轻薄'],
    1100,
    1500,
    false,
    'published'
  ),

  -- 6. 温柔约会妆容
  (
    v_user_id,
    '温柔约会妆容',
    '展现温柔气质，营造柔美印象',
    '# 温柔约会妆容

## 妆容特点
- 柔和的色调
- 自然的眼妆
- 温柔的唇色

## 色彩搭配
- 粉色系眼影
- 珊瑚色腮红
- 豆沙色唇膏',
    'https://images.unsplash.com/photo-1499310392430-c4b28c6b6b53?w=600&q=80',
    'date',
    'oval',
    ARRAY['约会', '温柔', '气质', '柔美'],
    2300,
    3400,
    false,
    'published'
  ),

  -- 7. 商务职场妆容
  (
    v_user_id,
    '商务职场妆容',
    '干练专业的职场妆容，展现职业形象',
    '# 商务职场妆容

## 妆容原则
- 自然不浓艳
- 精致有气场
- 持久一整天

## 色彩选择
- 大地色系为主
- 避免过于鲜艳的颜色
- 选择雾面质地',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    'business',
    'square',
    ARRAY['职场', '商务', '干练', '专业'],
    890,
    1200,
    false,
    'published'
  ),

  -- 8. 派对妆容
  (
    v_user_id,
    '派对闪耀妆容',
    '吸睛亮眼的派对妆，成为全场焦点',
    '# 派对闪耀妆容

## 妆容亮点
- 金属光泽眼影
- 立体高光修容
- 个性唇妆

## 注意事项
- 根据派对主题调整
- 注意灯光效果
- 持妆定妆很重要',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80',
    'party',
    'heart',
    ARRAY['派对', '闪耀', '吸睛', '个性'],
    1560,
    2100,
    false,
    'published'
  );
  
  RAISE NOTICE '成功插入 8 条妆容记录！';
END $$;

-- 验证插入结果
SELECT 
  id,
  title,
  category,
  face_shape,
  likes_count,
  is_featured,
  created_at
FROM public.makeup_posts
ORDER BY created_at DESC;

