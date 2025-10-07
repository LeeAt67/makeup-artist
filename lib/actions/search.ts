"use server";

import { createClient } from "@/lib/supabase/server";
import type { MakeupPost } from "./makeup";

/**
 * 搜索妆容帖子
 * @param query 搜索关键词
 * @param category 分类筛选
 * @param faceShape 脸型筛选
 * @param limit 限制数量
 */
export async function searchMakeupPosts(
  query: string,
  category?: string,
  faceShape?: string,
  limit = 20
) {
  try {
    const supabase = await createClient();

    let queryBuilder = supabase
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
      .eq("status", "published");

    // 如果有搜索关键词，使用全文搜索
    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`
      );
    }

    // 分类筛选
    if (category) {
      queryBuilder = queryBuilder.eq("category", category);
    }

    // 脸型筛选
    if (faceShape) {
      queryBuilder = queryBuilder.eq("face_shape", faceShape);
    }

    const { data, error } = await queryBuilder
      .order("views_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("搜索妆容失败:", error);
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
    console.error("搜索妆容异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 获取热门搜索关键词
 * @param limit 限制数量
 */
export async function getHotSearchKeywords(limit = 10) {
  try {
    const supabase = await createClient();

    // 从标签中统计热门关键词
    const { data, error } = await supabase
      .from("makeup_posts")
      .select("tags")
      .eq("status", "published")
      .not("tags", "is", null)
      .limit(100);

    if (error) {
      console.error("获取热门搜索失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    // 统计标签频率
    const tagCounts: Record<string, number> = {};
    data.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // 排序并取前 N 个
    const hotTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);

    return {
      success: true,
      data: hotTags,
    };
  } catch (error) {
    console.error("获取热门搜索异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 搜索建议（自动补全）
 * @param query 搜索关键词
 * @param limit 限制数量
 */
export async function getSearchSuggestions(query: string, limit = 5) {
  try {
    if (!query || query.trim().length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("makeup_posts")
      .select("title, tags")
      .eq("status", "published")
      .or(`title.ilike.%${query}%,tags.cs.{${query}}`)
      .limit(limit);

    if (error) {
      console.error("获取搜索建议失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    // 提取建议
    const suggestions = new Set<string>();
    data.forEach((post) => {
      // 添加标题匹配的部分
      if (post.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(post.title);
      }
      // 添加标签匹配的部分
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: string) => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(tag);
          }
        });
      }
    });

    return {
      success: true,
      data: Array.from(suggestions).slice(0, limit),
    };
  } catch (error) {
    console.error("获取搜索建议异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

