"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * 产品数据类型
 */
export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string | null;
  category: string;
  sub_category: string | null;
  cover_image: string;
  images: string[] | null;
  price: number;
  original_price: number | null;
  currency: string;
  specifications: Record<string, string> | null;
  features: string[] | null;
  ingredients: string | null;
  suitable_skin_types: string[] | null;
  suitable_face_shapes: string[] | null;
  affiliate_link: string | null;
  platform: string | null;
  rating: number;
  reviews_count: number;
  sales_count: number;
  is_featured: boolean;
  is_available: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * 获取产品列表
 * @param category 分类筛选
 * @param subCategory 子分类筛选
 * @param limit 限制数量
 */
export async function getProducts(
  category?: string,
  subCategory?: string,
  limit = 20
) {
  try {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("is_available", true);

    if (category) {
      queryBuilder = queryBuilder.eq("category", category);
    }

    if (subCategory) {
      queryBuilder = queryBuilder.eq("sub_category", subCategory);
    }

    const { data, error } = await queryBuilder
      .order("sales_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取产品列表失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data as Product[],
    };
  } catch (error) {
    console.error("获取产品列表异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 获取单个产品详情
 * @param productId 产品 ID
 */
export async function getProductById(productId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("获取产品详情失败:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }

    return {
      success: true,
      data: data as Product,
    };
  } catch (error) {
    console.error("获取产品详情异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: null,
    };
  }
}

/**
 * 搜索产品
 * @param query 搜索关键词
 * @param category 分类筛选
 * @param minPrice 最低价格
 * @param maxPrice 最高价格
 * @param limit 限制数量
 */
export async function searchProducts(
  query: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  limit = 20
) {
  try {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("is_available", true);

    // 搜索关键词
    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    // 分类筛选
    if (category) {
      queryBuilder = queryBuilder.eq("category", category);
    }

    // 价格筛选
    if (minPrice !== undefined) {
      queryBuilder = queryBuilder.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.lte("price", maxPrice);
    }

    const { data, error } = await queryBuilder
      .order("sales_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("搜索产品失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data as Product[],
    };
  } catch (error) {
    console.error("搜索产品异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 获取精选产品
 * @param limit 限制数量
 */
export async function getFeaturedProducts(limit = 10) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("is_available", true)
      .eq("is_featured", true)
      .order("sales_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取精选产品失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data as Product[],
    };
  } catch (error) {
    console.error("获取精选产品异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 获取推荐产品（基于用户肤质和脸型）
 * @param skinType 肤质
 * @param faceShape 脸型
 * @param limit 限制数量
 */
export async function getRecommendedProducts(
  skinType?: string,
  faceShape?: string,
  limit = 10
) {
  try {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .eq("is_available", true);

    // 根据肤质筛选
    if (skinType) {
      queryBuilder = queryBuilder.contains("suitable_skin_types", [skinType]);
    }

    // 根据脸型筛选
    if (faceShape) {
      queryBuilder = queryBuilder.contains("suitable_face_shapes", [
        faceShape,
      ]);
    }

    const { data, error } = await queryBuilder
      .order("rating", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取推荐产品失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data as Product[],
    };
  } catch (error) {
    console.error("获取推荐产品异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 获取妆容关联的产品
 * @param makeupPostId 妆容帖子 ID
 */
export async function getMakeupProducts(makeupPostId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("makeup_products")
      .select(
        `
        *,
        products:product_id (*)
      `
      )
      .eq("makeup_post_id", makeupPostId)
      .order("step_number", { ascending: true });

    if (error) {
      console.error("获取妆容产品失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("获取妆容产品异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 产品评价数据类型
 */
export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  content: string | null;
  images: string[] | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

/**
 * 获取产品评价列表
 * @param productId 产品 ID
 * @param limit 限制数量
 */
export async function getProductReviews(productId: string, limit = 20) {
  try {
    const supabase = await createClient();

    // 先查询评价数据
    const { data: reviews, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取产品评价失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    // 如果没有评价，直接返回空数组
    if (!reviews || reviews.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // 获取所有评价者的 user_id
    const userIds = reviews.map((review) => review.user_id);

    // 查询用户信息
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", userIds);

    // 将用户信息合并到评价中
    const reviewsWithProfiles = reviews.map((review) => ({
      ...review,
      profiles: profiles?.find((p) => p.id === review.user_id) || null,
    }));

    return {
      success: true,
      data: reviewsWithProfiles as ProductReview[],
    };
  } catch (error) {
    console.error("获取产品评价异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 创建产品评价
 * @param productId 产品 ID
 * @param rating 评分（1-5）
 * @param content 评价内容
 * @param images 评价图片
 */
export async function createProductReview(
  productId: string,
  rating: number,
  content?: string,
  images?: string[]
) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: "请先登录",
      };
    }

    // 检查用户是否已经评价过该产品
    const { data: existingReview } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .single();

    if (existingReview) {
      return {
        success: false,
        error: "您已经评价过该产品",
      };
    }

    // 创建评价
    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        rating,
        content,
        images,
      })
      .select()
      .single();

    if (error) {
      console.error("创建产品评价失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("创建产品评价异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 更新产品评价
 * @param reviewId 评价 ID
 * @param rating 评分（1-5）
 * @param content 评价内容
 * @param images 评价图片
 */
export async function updateProductReview(
  reviewId: string,
  rating: number,
  content?: string,
  images?: string[]
) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("product_reviews")
      .update({
        rating,
        content,
        images,
      })
      .eq("id", reviewId)
      .select()
      .single();

    if (error) {
      console.error("更新产品评价失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("更新产品评价异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 删除产品评价
 * @param reviewId 评价 ID
 */
export async function deleteProductReview(reviewId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      console.error("删除产品评价失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("删除产品评价异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

