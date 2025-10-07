"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * 妆容帖子数据类型
 */
export interface MakeupPost {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content: string | null;
  cover_image: string;
  images: string[] | null;
  video_url: string | null;
  category: string;
  face_shape: string | null;
  tags: string[] | null;
  likes_count: number;
  views_count: number;
  comments_count: number;
  favorites_count: number;
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  // 关联的用户信息
  profiles?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}

/**
 * 获取首页推荐妆容列表
 * @param limit 限制数量，默认 20
 */
export async function getMakeupPosts(limit = 20) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("makeup_posts")
      .select(
        `
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取妆容列表失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data as MakeupPost[],
    };
  } catch (error) {
    console.error("获取妆容列表异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 获取精选妆容
 */
export async function getFeaturedPost() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("makeup_posts")
      .select(
        `
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `
      )
      .eq("status", "published")
      .eq("is_featured", true)
      .order("views_count", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // 如果没有精选内容，返回 null 而不是错误
      if (error.code === "PGRST116") {
        return {
          success: true,
          data: null,
        };
      }
      console.error("获取精选妆容失败:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }

    return {
      success: true,
      data: data as MakeupPost,
    };
  } catch (error) {
    console.error("获取精选妆容异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: null,
    };
  }
}

/**
 * 根据分类获取妆容列表
 * @param category 分类：daily, party, business, date, interview
 * @param limit 限制数量
 */
export async function getMakeupPostsByCategory(category: string, limit = 20) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("makeup_posts")
      .select(
        `
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `
      )
      .eq("status", "published")
      .eq("category", category)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取分类妆容列表失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data as MakeupPost[],
    };
  } catch (error) {
    console.error("获取分类妆容列表异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 根据脸型获取适配妆容
 * @param faceShape 脸型：round, square, oval, long, heart, diamond
 * @param limit 限制数量
 */
export async function getMakeupPostsByFaceShape(faceShape: string, limit = 20) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("makeup_posts")
      .select(
        `
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `
      )
      .eq("status", "published")
      .eq("face_shape", faceShape)
      .order("likes_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取脸型适配妆容失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data as MakeupPost[],
    };
  } catch (error) {
    console.error("获取脸型适配妆容异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 增加妆容浏览数
 * @param postId 帖子 ID
 */
export async function incrementViewCount(postId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.rpc("increment_view_count", {
      post_id: postId,
    });

    if (error) {
      console.error("增加浏览数失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("增加浏览数异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 点赞/取消点赞
 * @param postId 帖子 ID
 */
export async function toggleLike(postId: string) {
  try {
    const supabase = await createClient();

    // 检查用户是否已登录
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: "请先登录",
      };
    }

    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from("makeup_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    if (existingLike) {
      // 取消点赞
      const { error } = await supabase
        .from("makeup_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        liked: false,
      };
    } else {
      // 添加点赞
      const { error } = await supabase.from("makeup_likes").insert({
        user_id: user.id,
        post_id: postId,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        liked: true,
      };
    }
  } catch (error) {
    console.error("点赞操作异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 收藏/取消收藏
 * @param postId 帖子 ID
 */
export async function toggleFavorite(postId: string) {
  try {
    const supabase = await createClient();

    // 检查用户是否已登录
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: "请先登录",
      };
    }

    // 检查是否已收藏
    const { data: existingFavorite } = await supabase
      .from("makeup_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    if (existingFavorite) {
      // 取消收藏
      const { error } = await supabase
        .from("makeup_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        favorited: false,
      };
    } else {
      // 添加收藏
      const { error } = await supabase.from("makeup_favorites").insert({
        user_id: user.id,
        post_id: postId,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        favorited: true,
      };
    }
  } catch (error) {
    console.error("收藏操作异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 获取单个妆容详情
 * @param postId 帖子 ID
 */
export async function getMakeupPostById(postId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("makeup_posts")
      .select(
        `
        *,
        profiles:user_id (
          id,
          username,
          avatar_url,
          bio
        )
      `
      )
      .eq("id", postId)
      .single();

    if (error) {
      console.error("获取妆容详情失败:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }

    return {
      success: true,
      data: data as MakeupPost,
    };
  } catch (error) {
    console.error("获取妆容详情异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: null,
    };
  }
}

/**
 * 检查用户是否已点赞某个帖子
 * @param postId 帖子 ID
 */
export async function checkUserLiked(postId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: true,
        liked: false,
      };
    }

    const { data } = await supabase
      .from("makeup_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    return {
      success: true,
      liked: !!data,
    };
  } catch (error) {
    return {
      success: true,
      liked: false,
    };
  }
}

/**
 * 检查用户是否已收藏某个帖子
 * @param postId 帖子 ID
 */
export async function checkUserFavorited(postId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: true,
        favorited: false,
      };
    }

    const { data } = await supabase
      .from("makeup_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    return {
      success: true,
      favorited: !!data,
    };
  } catch (error) {
    return {
      success: true,
      favorited: false,
    };
  }
}
