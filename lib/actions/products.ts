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

