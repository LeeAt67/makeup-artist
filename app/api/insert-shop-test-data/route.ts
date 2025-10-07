import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // 清空现有数据（可选）
    // await supabase.from("product_reviews").delete().neq("id", "");
    // await supabase.from("products").delete().neq("id", "");

    // 插入产品数据
    const products = [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "光感持妆粉底液",
        brand: "雅诗兰黛",
        description:
          "这款粉底液采用独特的光学科技，能够自然修饰肌肤瑕疵，打造光泽透亮的妆感。持久配方确保妆容持续一整天不脱妆，适合各种场合使用。质地轻盈不厚重，让肌肤自由呼吸。",
        category: "foundation",
        sub_category: "base",
        cover_image:
          "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800",
        images: [
          "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800",
          "https://images.unsplash.com/photo-1631214524220-e0c2e67f1b0f?w=800",
        ],
        price: 398.0,
        original_price: 498.0,
        currency: "CNY",
        specifications: {
          色号: "1W1 象牙白",
          净含量: "30ml",
          质地: "轻盈液体",
          遮瑕度: "中等遮瑕",
        },
        features: ["持久不脱妆", "自然光泽", "轻盈质地", "遮瑕修饰"],
        ingredients: "水、环甲硅油、甘油、二氧化钛、云母、氧化铁等",
        suitable_skin_types: ["dry", "normal", "combination"],
        suitable_face_shapes: ["oval", "round", "heart"],
        affiliate_link: "https://www.taobao.com/product/example1",
        platform: "taobao",
        rating: 4.8,
        reviews_count: 0,
        sales_count: 15680,
        is_featured: true,
        is_available: true,
        status: "published",
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        name: "空气感气垫粉底",
        brand: "兰蔻",
        description:
          "轻若空气的质地，一拍即合，瞬间打造自然裸妆效果。添加保湿精华，持续滋养肌肤。便携设计，随时随地补妆，让妆容保持完美状态。防晒指数SPF50+，全面防护紫外线伤害。",
        category: "foundation",
        sub_category: "base",
        cover_image:
          "https://images.unsplash.com/photo-1625777233811-f0b7d198d5e0?w=800",
        images: [
          "https://images.unsplash.com/photo-1625777233811-f0b7d198d5e0?w=800",
          "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800",
        ],
        price: 468.0,
        original_price: 568.0,
        currency: "CNY",
        specifications: {
          色号: "01 自然色",
          净含量: "14g",
          质地: "轻薄气垫",
          防晒指数: "SPF50+ PA+++",
        },
        features: ["轻薄透气", "SPF50+防晒", "保湿滋润", "便携补妆"],
        ingredients: "水、二氧化钛、烟酰胺、透明质酸钠、维生素E等",
        suitable_skin_types: ["dry", "normal", "sensitive"],
        suitable_face_shapes: ["oval", "long", "diamond"],
        affiliate_link: "https://www.tmall.com/product/example2",
        platform: "tmall",
        rating: 4.7,
        reviews_count: 0,
        sales_count: 12450,
        is_featured: true,
        is_available: true,
        status: "published",
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        name: "无瑕遮瑕膏",
        brand: "NARS",
        description:
          "高遮瑕力，一抹即可完美隐藏黑眼圈、痘印等肌肤瑕疵。轻盈质地，不卡粉不厚重。富含保湿成分，长时间使用也不会干燥起皮。多种色号可选，满足不同肤色需求。",
        category: "foundation",
        sub_category: "concealer",
        cover_image:
          "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800",
        images: [
          "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800",
        ],
        price: 298.0,
        original_price: null,
        currency: "CNY",
        specifications: {
          色号: "Vanilla",
          净含量: "6ml",
          质地: "乳霜状",
          遮瑕度: "高遮瑕",
        },
        features: ["高遮瑕力", "不卡粉", "保湿滋润", "持久不脱妆"],
        ingredients: "水、环五聚二甲基硅氧烷、甘油、氧化铁、生育酚乙酸酯等",
        suitable_skin_types: ["normal", "combination", "oily"],
        suitable_face_shapes: ["round", "square", "oval"],
        affiliate_link: "https://www.jd.com/product/example3",
        platform: "jd",
        rating: 4.6,
        reviews_count: 0,
        sales_count: 8920,
        is_featured: false,
        is_available: true,
        status: "published",
      },
      {
        id: "44444444-4444-4444-4444-444444444444",
        name: "大地色眼影盘",
        brand: "Urban Decay",
        description:
          "12色经典大地色眼影盘，从浅至深，打造百变眼妆。细腻粉质，易于晕染，显色度高。哑光与珠光结合，满足日常与派对妆容需求。长效持妆，不易晕染脱色。",
        category: "eyeshadow",
        sub_category: "eye",
        cover_image:
          "https://images.unsplash.com/photo-1583241800698-c8e1c1c44e55?w=800",
        images: [
          "https://images.unsplash.com/photo-1583241800698-c8e1c1c44e55?w=800",
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
        ],
        price: 428.0,
        original_price: 528.0,
        currency: "CNY",
        specifications: {
          色号: "Naked Palette",
          净含量: "12x1.3g",
          质地: "粉质",
          色系: "大地色",
        },
        features: ["12色盘", "哑光珠光", "高显色度", "持久不晕染"],
        ingredients: "滑石粉、云母、硅油、维生素E、氧化铁等",
        suitable_skin_types: ["normal", "oily", "combination"],
        suitable_face_shapes: ["oval", "round", "heart", "long"],
        affiliate_link: "https://www.douyin.com/product/example4",
        platform: "douyin",
        rating: 4.9,
        reviews_count: 0,
        sales_count: 23560,
        is_featured: true,
        is_available: true,
        status: "published",
      },
      {
        id: "55555555-5555-5555-5555-555555555555",
        name: "珠光单色眼影",
        brand: "MAC",
        description:
          "经典珠光单色眼影，细腻闪粉，打造迷人眼神。可单独使用或叠加其他颜色，创造独特妆效。粉质柔滑，易于晕染，持妆时间长。多种颜色可选，满足不同风格需求。",
        category: "eyeshadow",
        sub_category: "eye",
        cover_image:
          "https://images.unsplash.com/photo-1615397349754-16dd99ba5462?w=800",
        images: [
          "https://images.unsplash.com/photo-1615397349754-16dd99ba5462?w=800",
        ],
        price: 178.0,
        original_price: null,
        currency: "CNY",
        specifications: {
          色号: "Woodwinked",
          净含量: "1.5g",
          质地: "珠光粉质",
          色系: "金棕色",
        },
        features: ["高显色", "细腻珠光", "易晕染", "持久显色"],
        ingredients:
          "云母、滑石粉、氧化铁、二氧化钛、合成氟金云母等",
        suitable_skin_types: ["normal", "oily", "combination", "dry"],
        suitable_face_shapes: ["oval", "round", "square", "diamond"],
        affiliate_link: "https://www.xiaohongshu.com/product/example5",
        platform: "xiaohongshu",
        rating: 4.7,
        reviews_count: 0,
        sales_count: 9870,
        is_featured: false,
        is_available: true,
        status: "published",
      },
      {
        id: "66666666-6666-6666-6666-666666666666",
        name: "丝绒哑光口红",
        brand: "YSL",
        description:
          "经典方管口红，丝绒哑光质地，一抹上色。高饱和度色彩，打造性感双唇。添加滋润成分，长时间使用也不干燥。精致外观，彰显品味。",
        category: "lipstick",
        sub_category: "lip",
        cover_image:
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
        images: [
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
          "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800",
        ],
        price: 338.0,
        original_price: null,
        currency: "CNY",
        specifications: {
          色号: "416 玫瑰豆沙",
          净含量: "3.8g",
          质地: "丝绒哑光",
          颜色: "玫瑰豆沙色",
        },
        features: ["哑光质地", "高显色度", "滋润不干", "持久不掉色"],
        ingredients: "蓖麻籽油、蜡、维生素E、玫瑰果油、染料等",
        suitable_skin_types: ["dry", "normal", "combination", "sensitive"],
        suitable_face_shapes: ["oval", "heart", "round", "long"],
        affiliate_link: "https://www.tmall.com/product/example6",
        platform: "tmall",
        rating: 4.8,
        reviews_count: 0,
        sales_count: 18720,
        is_featured: true,
        is_available: true,
        status: "published",
      },
      {
        id: "77777777-7777-7777-7777-777777777777",
        name: "水润唇釉",
        brand: "Dior",
        description:
          "水润镜面唇釉，如同唇部精华，滋润双唇。镜面光泽，打造饱满唇形。高显色度，一涂即显色。添加护唇精华，持续滋养唇部。",
        category: "lipstick",
        sub_category: "lip",
        cover_image:
          "https://images.unsplash.com/photo-1612802135605-a3f44d5b06c3?w=800",
        images: [
          "https://images.unsplash.com/photo-1612802135605-a3f44d5b06c3?w=800",
        ],
        price: 298.0,
        original_price: 368.0,
        currency: "CNY",
        specifications: {
          色号: "999 正红色",
          净含量: "6ml",
          质地: "水润唇釉",
          颜色: "正红色",
        },
        features: ["水润镜面", "滋养护唇", "高显色度", "持久不掉色"],
        ingredients: "水、甘油、透明质酸、维生素E、染料、香精等",
        suitable_skin_types: ["dry", "normal", "sensitive"],
        suitable_face_shapes: ["oval", "heart", "diamond", "square"],
        affiliate_link: "https://www.jd.com/product/example7",
        platform: "jd",
        rating: 4.9,
        reviews_count: 0,
        sales_count: 25430,
        is_featured: true,
        is_available: true,
        status: "published",
      },
      {
        id: "88888888-8888-8888-8888-888888888888",
        name: "雾面丝绒唇釉",
        brand: "3CE",
        description:
          "韩系雾面唇釉，轻盈质地，丝绒妆效。多种流行色号，轻松打造韩系妆容。持久不粘杯，不易脱妆。添加保湿成分，避免干燥起皮。",
        category: "lipstick",
        sub_category: "lip",
        cover_image:
          "https://images.unsplash.com/photo-1610830750557-dd1b2b6c7e7d?w=800",
        images: [
          "https://images.unsplash.com/photo-1610830750557-dd1b2b6c7e7d?w=800",
        ],
        price: 128.0,
        original_price: 168.0,
        currency: "CNY",
        specifications: {
          色号: "Taupe",
          净含量: "4g",
          质地: "雾面丝绒",
          颜色: "脏橘色",
        },
        features: ["雾面质地", "不粘杯", "韩系色号", "轻盈持久"],
        ingredients: "异十六烷、蜡、维生素E、荷荷巴油、染料等",
        suitable_skin_types: ["normal", "combination", "oily"],
        suitable_face_shapes: ["oval", "round", "heart", "long"],
        affiliate_link: "https://www.taobao.com/product/example8",
        platform: "taobao",
        rating: 4.6,
        reviews_count: 0,
        sales_count: 14560,
        is_featured: false,
        is_available: true,
        status: "published",
      },
      {
        id: "99999999-9999-9999-9999-999999999999",
        name: "玫瑰花瓣腮红",
        brand: "NARS",
        description:
          "经典花瓣腮红，粉质细腻如丝。自然显色，打造好气色。多种色号可选，适合不同妆容风格。易于晕染，持妆时间长。",
        category: "blush",
        sub_category: "face",
        cover_image:
          "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800",
        images: [
          "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=800",
        ],
        price: 268.0,
        original_price: null,
        currency: "CNY",
        specifications: {
          色号: "Orgasm",
          净含量: "4.8g",
          质地: "粉质",
          颜色: "金粉桃色",
        },
        features: ["细腻粉质", "自然显色", "易晕染", "持久不掉色"],
        ingredients: "滑石粉、云母、硅油、维生素E、氧化铁等",
        suitable_skin_types: ["normal", "dry", "combination"],
        suitable_face_shapes: ["oval", "round", "heart", "long", "square"],
        affiliate_link: "https://www.tmall.com/product/example9",
        platform: "tmall",
        rating: 4.7,
        reviews_count: 0,
        sales_count: 11230,
        is_featured: false,
        is_available: true,
        status: "published",
      },
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "水光液体腮红",
        brand: "Benefit",
        description:
          "液体腮红，水润质地，自然服帖。一滴即可打造健康红润好气色。易于推开晕染，与底妆完美融合。持久不脱妆，让妆容保持一整天。",
        category: "blush",
        sub_category: "face",
        cover_image:
          "https://images.unsplash.com/photo-1609505046654-c7c456744765?w=800",
        images: [
          "https://images.unsplash.com/photo-1609505046654-c7c456744765?w=800",
        ],
        price: 258.0,
        original_price: 298.0,
        currency: "CNY",
        specifications: {
          色号: "Benetint",
          净含量: "12.5ml",
          质地: "液体",
          颜色: "玫瑰红色",
        },
        features: ["水润质地", "自然服帖", "易晕染", "持久显色"],
        ingredients: "水、甘油、染料、香精、防腐剂等",
        suitable_skin_types: ["normal", "oily", "combination"],
        suitable_face_shapes: ["oval", "long", "diamond", "heart"],
        affiliate_link: "https://www.douyin.com/product/example10",
        platform: "douyin",
        rating: 4.5,
        reviews_count: 0,
        sales_count: 7890,
        is_featured: false,
        is_available: true,
        status: "published",
      },
      {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        name: "美妆蛋套装",
        brand: "美妆蛋",
        description:
          "专业美妆蛋套装，柔软亲肤，不吸粉。湿用干用均可，打造无瑕底妆。易清洗，可重复使用。符合人体工学设计，方便上妆。",
        category: "tools",
        sub_category: "tools",
        cover_image:
          "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800",
        images: [
          "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800",
        ],
        price: 39.0,
        original_price: 59.0,
        currency: "CNY",
        specifications: {
          数量: "3个装",
          材质: "亲肤海绵",
          颜色: "粉色+紫色+橙色",
          用途: "底妆上妆",
        },
        features: ["柔软亲肤", "不吸粉", "易清洗", "干湿两用"],
        ingredients: "聚氨酯海绵材质",
        suitable_skin_types: ["dry", "oily", "normal", "combination", "sensitive"],
        suitable_face_shapes: ["oval", "round", "square", "long", "heart", "diamond"],
        affiliate_link: "https://www.taobao.com/product/example11",
        platform: "taobao",
        rating: 4.8,
        reviews_count: 0,
        sales_count: 34520,
        is_featured: true,
        is_available: true,
        status: "published",
      },
      {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        name: "专业化妆刷套装",
        brand: "Real Techniques",
        description:
          "专业化妆刷套装，包含眼妆刷、腮红刷、粉底刷等。刷毛柔软，不刺激肌肤。易于清洗和保养。便携收纳包设计，方便携带。",
        category: "tools",
        sub_category: "tools",
        cover_image:
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
        images: [
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
        ],
        price: 198.0,
        original_price: 268.0,
        currency: "CNY",
        specifications: {
          数量: "8支装",
          材质: "合成纤维毛",
          用途: "全套化妆",
          包装: "含收纳包",
        },
        features: ["柔软刷毛", "不易掉毛", "易清洗", "便携收纳"],
        ingredients: "合成纤维、铝管、木质手柄",
        suitable_skin_types: ["dry", "oily", "normal", "combination", "sensitive"],
        suitable_face_shapes: ["oval", "round", "square", "long", "heart", "diamond"],
        affiliate_link: "https://www.jd.com/product/example12",
        platform: "jd",
        rating: 4.7,
        reviews_count: 0,
        sales_count: 16780,
        is_featured: false,
        is_available: true,
        status: "published",
      },
    ];

    const { error: productsError } = await supabase
      .from("products")
      .upsert(products, { onConflict: "id" });

    if (productsError) {
      console.error("插入产品数据失败:", productsError);
      return NextResponse.json(
        {
          success: false,
          error: "插入产品数据失败: " + productsError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `成功插入 ${products.length} 个产品`,
      count: products.length,
    });
  } catch (error) {
    console.error("插入测试数据异常:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "使用 POST 方法插入测试数据",
    usage: "POST /api/insert-shop-test-data",
  });
}

