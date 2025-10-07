"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 点赞妆容帖子
 */
export async function likeMakeupPost(postId: string) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "请先登录" };
    }

    // 检查是否已经点赞
    const { data: existingLike } = await supabase
      .from("makeup_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    if (existingLike) {
      return { success: false, error: "已经点赞过了" };
    }

    // 添加点赞
    const { error: insertError } = await supabase
      .from("makeup_likes")
      .insert({
        user_id: user.id,
        post_id: postId,
      });

    if (insertError) {
      console.error("点赞失败:", insertError);
      return { success: false, error: "点赞失败" };
    }

    // 重新验证页面缓存
    revalidatePath(`/makeup/${postId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("点赞错误:", error);
    return { success: false, error: "点赞失败" };
  }
}

/**
 * 取消点赞妆容帖子
 */
export async function unlikeMakeupPost(postId: string) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "请先登录" };
    }

    // 删除点赞
    const { error: deleteError } = await supabase
      .from("makeup_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);

    if (deleteError) {
      console.error("取消点赞失败:", deleteError);
      return { success: false, error: "取消点赞失败" };
    }

    // 重新验证页面缓存
    revalidatePath(`/makeup/${postId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("取消点赞错误:", error);
    return { success: false, error: "取消点赞失败" };
  }
}

/**
 * 检查是否已点赞
 */
export async function checkIsLiked(postId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { isLiked: false };
    }

    const { data } = await supabase
      .from("makeup_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    return { isLiked: !!data };
  } catch (error) {
    return { isLiked: false };
  }
}

/**
 * 收藏妆容帖子
 */
export async function favoriteMakeupPost(postId: string) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "请先登录" };
    }

    // 检查是否已经收藏
    const { data: existingFavorite } = await supabase
      .from("makeup_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    if (existingFavorite) {
      return { success: false, error: "已经收藏过了" };
    }

    // 添加收藏
    const { error: insertError } = await supabase
      .from("makeup_favorites")
      .insert({
        user_id: user.id,
        post_id: postId,
      });

    if (insertError) {
      console.error("收藏失败:", insertError);
      return { success: false, error: "收藏失败" };
    }

    // 重新验证页面缓存
    revalidatePath(`/makeup/${postId}`);
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("收藏错误:", error);
    return { success: false, error: "收藏失败" };
  }
}

/**
 * 取消收藏妆容帖子
 */
export async function unfavoriteMakeupPost(postId: string) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "请先登录" };
    }

    // 删除收藏
    const { error: deleteError } = await supabase
      .from("makeup_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);

    if (deleteError) {
      console.error("取消收藏失败:", deleteError);
      return { success: false, error: "取消收藏失败" };
    }

    // 重新验证页面缓存
    revalidatePath(`/makeup/${postId}`);
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("取消收藏错误:", error);
    return { success: false, error: "取消收藏失败" };
  }
}

/**
 * 检查是否已收藏
 */
export async function checkIsFavorited(postId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { isFavorited: false };
    }

    const { data } = await supabase
      .from("makeup_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    return { isFavorited: !!data };
  } catch (error) {
    return { isFavorited: false };
  }
}

/**
 * 获取用户的收藏列表
 */
export async function getUserFavorites(limit = 20) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "请先登录" };
    }

    // 获取收藏的帖子 ID 列表
    const { data: favorites, error: favError } = await supabase
      .from("makeup_favorites")
      .select("post_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (favError) {
      console.error("获取收藏列表失败:", favError);
      return { success: false, error: "获取收藏列表失败" };
    }

    if (!favorites || favorites.length === 0) {
      return { success: true, data: [] };
    }

    // 获取帖子详情
    const postIds = favorites.map((f) => f.post_id);
    const { data: posts, error: postsError } = await supabase
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
      .in("id", postIds);

    if (postsError) {
      console.error("获取帖子详情失败:", postsError);
      return { success: false, error: "获取帖子详情失败" };
    }

    return { success: true, data: posts || [] };
  } catch (error) {
    console.error("获取收藏列表错误:", error);
    return { success: false, error: "获取收藏列表失败" };
  }
}

/**
 * 关注用户
 */
export async function followUser(followingId: string) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "请先登录" };
    }

    // 不能关注自己
    if (user.id === followingId) {
      return { success: false, error: "不能关注自己" };
    }

    // 检查是否已经关注
    const { data: existingFollow } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", followingId)
      .single();

    if (existingFollow) {
      return { success: false, error: "已经关注过了" };
    }

    // 添加关注
    const { error: insertError } = await supabase.from("user_follows").insert({
      follower_id: user.id,
      following_id: followingId,
    });

    if (insertError) {
      console.error("关注失败:", insertError);
      return { success: false, error: "关注失败" };
    }

    // 重新验证页面缓存
    revalidatePath(`/profile/${followingId}`);
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("关注错误:", error);
    return { success: false, error: "关注失败" };
  }
}

/**
 * 取消关注用户
 */
export async function unfollowUser(followingId: string) {
  try {
    const supabase = await createClient();

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "请先登录" };
    }

    // 删除关注
    const { error: deleteError } = await supabase
      .from("user_follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", followingId);

    if (deleteError) {
      console.error("取消关注失败:", deleteError);
      return { success: false, error: "取消关注失败" };
    }

    // 重新验证页面缓存
    revalidatePath(`/profile/${followingId}`);
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("取消关注错误:", error);
    return { success: false, error: "取消关注失败" };
  }
}

/**
 * 检查是否已关注
 */
export async function checkIsFollowing(followingId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { isFollowing: false };
    }

    const { data } = await supabase
      .from("user_follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", followingId)
      .single();

    return { isFollowing: !!data };
  } catch (error) {
    return { isFollowing: false };
  }
}

/**
 * 获取用户的关注列表
 */
export async function getUserFollowing(userId: string, limit = 50) {
  try {
    const supabase = await createClient();

    const { data: follows, error } = await supabase
      .from("user_follows")
      .select(
        `
        id,
        created_at,
        following:following_id (
          id,
          username,
          avatar_url,
          bio,
          followers_count,
          following_count,
          posts_count
        )
      `
      )
      .eq("follower_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取关注列表失败:", error);
      return { success: false, error: "获取关注列表失败" };
    }

    return { success: true, data: follows || [] };
  } catch (error) {
    console.error("获取关注列表错误:", error);
    return { success: false, error: "获取关注列表失败" };
  }
}

/**
 * 获取用户的粉丝列表
 */
export async function getUserFollowers(userId: string, limit = 50) {
  try {
    const supabase = await createClient();

    const { data: followers, error } = await supabase
      .from("user_follows")
      .select(
        `
        id,
        created_at,
        follower:follower_id (
          id,
          username,
          avatar_url,
          bio,
          followers_count,
          following_count,
          posts_count
        )
      `
      )
      .eq("following_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取粉丝列表失败:", error);
      return { success: false, error: "获取粉丝列表失败" };
    }

    return { success: true, data: followers || [] };
  } catch (error) {
    console.error("获取粉丝列表错误:", error);
    return { success: false, error: "获取粉丝列表失败" };
  }
}

/**
 * 获取用户资料（包含社交统计数据）
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("获取用户资料失败:", error);
      return { success: false, error: "获取用户资料失败" };
    }

    return { success: true, data: profile };
  } catch (error) {
    console.error("获取用户资料错误:", error);
    return { success: false, error: "获取用户资料失败" };
  }
}

/**
 * 获取用户发布的帖子列表
 */
export async function getUserPosts(userId: string, limit = 20) {
  try {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
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
      .eq("user_id", userId)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取用户帖子失败:", error);
      return { success: false, error: "获取用户帖子失败" };
    }

    return { success: true, data: posts || [] };
  } catch (error) {
    console.error("获取用户帖子错误:", error);
    return { success: false, error: "获取用户帖子失败" };
  }
}

