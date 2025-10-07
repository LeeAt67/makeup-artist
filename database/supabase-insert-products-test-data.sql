-- ====================================
-- 商品测试数据插入脚本
-- ====================================

-- 插入测试商品数据
INSERT INTO public.products (id, name, brand, description, category, sub_category, cover_image, images, price, original_price, currency, specifications, features, ingredients, suitable_skin_types, suitable_face_shapes, affiliate_link, platform, rating, reviews_count, sales_count, is_featured, is_available, status) VALUES

-- 1. 雅诗兰黛粉底液
('11111111-1111-1111-1111-111111111111', '光感持妆粉底液', '雅诗兰黛', '这款粉底液采用独特的光学科技，能够自然修饰肌肤瑕疵，打造光泽透亮的妆感。持久配方确保妆容持续一整天不脱妆，适合各种场合使用。质地轻盈不厚重，让肌肤自由呼吸。', 'foundation', 'base', 'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800', ARRAY['https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800', 'https://images.unsplash.com/photo-1631214524220-e0c2e67f1b0f?w=800'], 398.00, 498.00, 'CNY', '{"色号": "1W1 象牙白", "净含量": "30ml", "质地": "轻盈液体", "遮瑕度": "中等遮瑕"}', ARRAY['持久不脱妆', '自然光泽', '轻盈质地', '遮瑕修饰'], '水、环甲硅油、甘油、二氧化钛、云母、氧化铁等', ARRAY['dry', 'normal', 'combination'], ARRAY['oval', 'round', 'heart'], 'https://www.taobao.com/product/example1', 'taobao', 4.8, 0, 15680, true, true, 'published'),

-- 2. 兰蔻气垫粉底
('22222222-2222-2222-2222-222222222222', '空气感气垫粉底', '兰蔻', '轻若空气的质地，一拍即合，瞬间打造自然裸妆效果。添加保湿精华，持续滋养肌肤。便携设计，随时随地补妆，让妆容保持完美状态。防晒指数SPF50+，全面防护紫外线伤害。', 'foundation', 'base', 'https://images.unsplash.com/photo-1625777233811-f0b7d198d5e0?w=800', ARRAY['https://images.unsplash.com/photo-1625777233811-f0b7d198d5e0?w=800', 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800'], 468.00, 568.00, 'CNY', '{"色号": "01 自然色", "净含量": "14g", "质地": "轻薄气垫", "防晒指数": "SPF50+ PA+++"}', ARRAY['轻薄透气', 'SPF50+防晒', '保湿滋润', '便携补妆'], '水、二氧化钛、烟酰胺、透明质酸钠、维生素E等', ARRAY['dry', 'normal', 'sensitive'], ARRAY['oval', 'long', 'diamond'], 'https://www.tmall.com/product/example2', 'tmall', 4.7, 0, 12450, true, true, 'published'),

-- 3. NARS遮瑕膏
('33333333-3333-3333-3333-333333333333', '无瑕遮瑕膏', 'NARS', '高遮瑕力，一抹即可完美隐藏黑眼圈、痘印等肌肤瑕疵。轻盈质地，不卡粉不厚重。富含保湿成分，长时间使用也不会干燥起皮。多种色号可选，满足不同肤色需求。', 'foundation', 'concealer', 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800', ARRAY['https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800'], 298.00, NULL, 'CNY', '{"色号": "Vanilla", "净含量": "6ml", "质地": "乳霜状", "遮瑕度": "高遮瑕"}', ARRAY['高遮瑕力', '不卡粉', '保湿滋润', '持久不脱妆'], '水、环五聚二甲基硅氧烷、甘油、氧化铁、生育酚乙酸酯等', ARRAY['normal', 'combination', 'oily'], ARRAY['round', 'square', 'oval'], 'https://www.jd.com/product/example3', 'jd', 4.6, 0, 8920, false, true, 'published'),

-- 4. Urban Decay眼影盘
('44444444-4444-4444-4444-444444444444', '大地色眼影盘', 'Urban Decay', '12色经典大地色眼影盘，从浅至深，打造百变眼妆。细腻粉质，易于晕染，显色度高。哑光与珠光结合，满足日常与派对妆容需求。长效持妆，不易晕染脱色。', 'eyeshadow', 'eye', 'https://images.unsplash.com/photo-1583241800698-c8e1c1c44e55?w=800', ARRAY['https://images.unsplash.com/photo-1583241800698-c8e1c1c44e55?w=800', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'], 428.00, 528.00, 'CNY', '{"色号": "Naked Palette", "净含量": "12x1.3g", "质地": "粉质", "色系": "大地色"}', ARRAY['12色盘', '哑光珠光', '高显色度', '持久不晕染'], '滑石粉、云母、硅油、维生素E、氧化铁等', ARRAY['normal', 'oily', 'combination'], ARRAY['oval', 'round', 'heart', 'long'], 'https://www.douyin.com/product/example4', 'douyin', 4.9, 0, 23560, true, true, 'published'),

-- 5. MAC单色眼影
('55555555-5555-5555-5555-555555555555', '珠光单色眼影', 'MAC', '经典珠光单色眼影，细腻闪粉，打造迷人眼神。可单独使用或叠加其他颜色，创造独特妆效。粉质柔滑，易于晕染，持妆时间长。多种颜色可选，满足不同风格需求。', 'eyeshadow', 'eye', 'https://images.unsplash.com/photo-1615397349754-16dd99ba5462?w=800', ARRAY['https://images.unsplash.com/photo-1615397349754-16dd99ba5462?w=800'], 178.00, NULL, 'CNY', '{"色号": "Woodwinked", "净含量": "1.5g", "质地": "珠光粉质", "色系": "金棕色"}', ARRAY['高显色', '细腻珠光', '易晕染', '持久显色'], '云母、滑石粉、氧化铁、二氧化钛、合成氟金云母等', ARRAY['normal', 'oily', 'combination', 'dry'], ARRAY['oval', 'round', 'square', 'diamond'], 'https://www.xiaohongshu.com/product/example5', 'xiaohongshu', 4.7, 0, 9870, false, true, 'published'),

-- 6. YSL口红
('66666666-6666-6666-6666-666666666666', '丝绒哑光口红', 'YSL', '经典方管口红，丝绒哑光质地，一抹上色。高饱和度色彩，打造性感双唇。添加滋润成分，长时间使用也不干燥。精致外观，彰显品味。', 'lipstick', 'lip', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', ARRAY['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800'], 338.00, NULL, 'CNY', '{"色号": "416 玫瑰豆沙", "净含量": "3.8g", "质地": "丝绒哑光", "颜色": "玫瑰豆沙色"}', ARRAY['哑光质地', '高显色度', '滋润不干', '持久不掉色'], '蓖麻籽油、蜡、维生素E、玫瑰果油、染料等', ARRAY['dry', 'normal', 'combination', 'sensitive'], ARRAY['oval', 'heart', 'round', 'long'], 'https://www.tmall.com/product/example6', 'tmall', 4.8, 0, 18720, true, true, 'published'),

-- 7. Dior唇釉
('77777777-7777-7777-7777-777777777777', '水润唇釉', 'Dior', '水润镜面唇釉，如同唇部精华，滋润双唇。镜面光泽，打造饱满唇形。高显色度，一涂即显色。添加护唇精华，持续滋养唇部。', 'lipstick', 'lip', 'https://images.unsplash.com/photo-1612802135605-a3f44d5b06c3?w=800', ARRAY['https://images.unsplash.com/photo-1612802135605-a3f44d5b06c3?w=800'], 298.00, 368.00, 'CNY', '{"色号": "999 正红色", "净含量": "6ml", "质地": "水润唇釉", "颜色": "正红色"}', ARRAY['水润镜面', '滋养护唇', '高显色度', '持久不掉色'], '水、甘油、透明质酸、维生素E、染料、香精等', ARRAY['dry', 'normal', 'sensitive'], ARRAY['oval', 'heart', 'diamond', 'square'], 'https://www.jd.com/product/example7', 'jd', 4.9, 0, 25430, true, true, 'published'),

-- 8. 3CE唇釉
('88888888-8888-8888-8888-888888888888', '雾面丝绒唇釉', '3CE', '韩系雾面唇釉，轻盈质地，丝绒妆效。多种流行色号，轻松打造韩系妆容。持久不粘杯，不易脱妆。添加保湿成分，避免干燥起皮。', 'lipstick', 'lip', 'https://images.unsplash.com/photo-1610830750557-dd1b2b6c7e7d?w=800', ARRAY['https://images.unsplash.com/photo-1610830750557-dd1b2b6c7e7d?w=800'], 128.00, 168.00, 'CNY', '{"色号": "Taupe", "净含量": "4g", "质地": "雾面丝绒", "颜色": "脏橘色"}', ARRAY['雾面质地', '不粘杯', '韩系色号', '轻盈持久'], '异十六烷、蜡、维生素E、荷荷巴油、染料等', ARRAY['normal', 'combination', 'oily'], ARRAY['oval', 'round', 'heart', 'long'], 'https://www.taobao.com/product/example8', 'taobao', 4.6, 0, 14560, false, true, 'published'),

-- 9. NARS腮红
('99999999-9999-9999-9999-999999999999', '玫瑰花瓣腮红', 'NARS', '经典花瓣腮红，粉质细腻如丝。自然显色，打造好气色。多种色号可选，适合不同妆容风格。易于晕染，持妆时间长。', 'blush', 'face', 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800', ARRAY['https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800'], 268.00, NULL, 'CNY', '{"色号": "Orgasm", "净含量": "4.8g", "质地": "粉质", "颜色": "金粉桃色"}', ARRAY['细腻粉质', '自然显色', '易晕染', '持久不掉色'], '滑石粉、云母、硅油、维生素E、氧化铁等', ARRAY['normal', 'dry', 'combination'], ARRAY['oval', 'round', 'heart', 'long', 'square'], 'https://www.tmall.com/product/example9', 'tmall', 4.7, 0, 11230, false, true, 'published'),

-- 10. Benefit液体腮红
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '水光液体腮红', 'Benefit', '液体腮红，水润质地，自然服帖。一滴即可打造健康红润好气色。易于推开晕染，与底妆完美融合。持久不脱妆，让妆容保持一整天。', 'blush', 'face', 'https://images.unsplash.com/photo-1609505046654-c7c456744765?w=800', ARRAY['https://images.unsplash.com/photo-1609505046654-c7c456744765?w=800'], 258.00, 298.00, 'CNY', '{"色号": "Benetint", "净含量": "12.5ml", "质地": "液体", "颜色": "玫瑰红色"}', ARRAY['水润质地', '自然服帖', '易晕染', '持久显色'], '水、甘油、染料、香精、防腐剂等', ARRAY['normal', 'oily', 'combination'], ARRAY['oval', 'long', 'diamond', 'heart'], 'https://www.douyin.com/product/example10', 'douyin', 4.5, 0, 7890, false, true, 'published'),

-- 11. 美妆蛋套装
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '美妆蛋套装', '美妆蛋', '专业美妆蛋套装，柔软亲肤，不吸粉。湿用干用均可，打造无瑕底妆。易清洗，可重复使用。符合人体工学设计，方便上妆。', 'tools', 'tools', 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800', ARRAY['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800'], 39.00, 59.00, 'CNY', '{"数量": "3个装", "材质": "亲肤海绵", "颜色": "粉色+紫色+橙色", "用途": "底妆上妆"}', ARRAY['柔软亲肤', '不吸粉', '易清洗', '干湿两用'], '聚氨酯海绵材质', ARRAY['dry', 'oily', 'normal', 'combination', 'sensitive'], ARRAY['oval', 'round', 'square', 'long', 'heart', 'diamond'], 'https://www.taobao.com/product/example11', 'taobao', 4.8, 0, 34520, true, true, 'published'),

-- 12. 化妆刷套装
('cccccccc-cccc-cccc-cccc-cccccccccccc', '专业化妆刷套装', 'Real Techniques', '专业化妆刷套装，包含眼妆刷、腮红刷、粉底刷等。刷毛柔软，不刺激肌肤。易于清洗和保养。便携收纳包设计，方便携带。', 'tools', 'tools', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800', ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'], 198.00, 268.00, 'CNY', '{"数量": "8支装", "材质": "合成纤维毛", "用途": "全套化妆", "包装": "含收纳包"}', ARRAY['柔软刷毛', '不易掉毛', '易清洗', '便携收纳'], '合成纤维、铝管、木质手柄', ARRAY['dry', 'oily', 'normal', 'combination', 'sensitive'], ARRAY['oval', 'round', 'square', 'long', 'heart', 'diamond'], 'https://www.jd.com/product/example12', 'jd', 4.7, 0, 16780, false, true, 'published')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  cover_image = EXCLUDED.cover_image,
  images = EXCLUDED.images,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  specifications = EXCLUDED.specifications,
  features = EXCLUDED.features,
  ingredients = EXCLUDED.ingredients,
  suitable_skin_types = EXCLUDED.suitable_skin_types,
  suitable_face_shapes = EXCLUDED.suitable_face_shapes,
  affiliate_link = EXCLUDED.affiliate_link,
  platform = EXCLUDED.platform,
  rating = EXCLUDED.rating,
  sales_count = EXCLUDED.sales_count,
  is_featured = EXCLUDED.is_featured,
  is_available = EXCLUDED.is_available,
  status = EXCLUDED.status;
