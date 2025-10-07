"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * 评论数据类型
 */
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // 关联的用户信息
  profiles?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
  // 回复数量（如果是父评论）
  replies_count?: number;
}

/**
 * 获取帖子的评论列表
 * @param postId 帖子 ID
 * @param limit 限制数量
 */
export async function getComments(postId: string, limit = 50) {
  try {
    const supabase = await createClient();

    // 首先查询评论
    const { data: comments, error } = await (supabase as any)
      .from("makeup_comments")
      .select("*")
      .eq("post_id", postId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取评论列表失败:", error);
      console.error("错误详情:", JSON.stringify(error, null, 2));
      return {
        success: false,
        error:
          error.message ||
          "数据库查询失败，请确保已执行 database/supabase-comments-system.sql 脚本创建评论表",
        data: [],
      };
    }

    if (!comments || comments.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // 获取所有评论作者的用户信息
    const userIds = [...new Set(comments.map((c: any) => c.user_id))];
    const { data: profiles } = await (supabase as any)
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", userIds);

    // 组合数据
    const profilesMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
    const commentsWithProfiles = comments.map((comment: any) => ({
      ...comment,
      profiles: profilesMap.get(comment.user_id) || null,
    }));

    return {
      success: true,
      data: commentsWithProfiles as Comment[],
    };
  } catch (error) {
    console.error("获取评论列表异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 获取某条评论的回复列表
 * @param parentId 父评论 ID
 */
export async function getReplies(parentId: string) {
  try {
    const supabase = await createClient();

    // 查询回复
    const { data: replies, error } = await (supabase as any)
      .from("makeup_comments")
      .select("*")
      .eq("parent_id", parentId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("获取回复列表失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    if (!replies || replies.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // 获取所有回复作者的用户信息
    const userIds = [...new Set(replies.map((r: any) => r.user_id))];
    const { data: profiles } = await (supabase as any)
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", userIds);

    // 组合数据
    const profilesMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
    const repliesWithProfiles = replies.map((reply: any) => ({
      ...reply,
      profiles: profilesMap.get(reply.user_id) || null,
    }));

    return {
      success: true,
      data: repliesWithProfiles as Comment[],
    };
  } catch (error) {
    console.error("获取回复列表异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 创建评论
 * @param postId 帖子 ID
 * @param content 评论内容
 * @param parentId 父评论 ID（回复时需要）
 */
export async function createComment(
  postId: string,
  content: string,
  parentId?: string
) {
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

    // 验证内容
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: "评论内容不能为空",
      };
    }

    if (content.length > 500) {
      return {
        success: false,
        error: "评论内容不能超过 500 字",
      };
    }

    // 插入评论
    const { data: newComment, error } = await (supabase as any)
      .from("makeup_comments")
      .insert([
        {
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
          parent_id: parentId || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("创建评论失败:", error);
      console.error("错误详情:", JSON.stringify(error, null, 2));
      return {
        success: false,
        error:
          error.message ||
          "创建评论失败，请确保已执行 database/supabase-comments-system.sql 脚本",
      };
    }

    // 获取用户信息
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("id, username, avatar_url")
      .eq("id", user.id)
      .single();

    return {
      success: true,
      data: {
        ...newComment,
        profiles: profile,
      } as Comment,
    };
  } catch (error) {
    console.error("创建评论异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 删除评论
 * @param commentId 评论 ID
 */
export async function deleteComment(commentId: string) {
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

    // 删除评论（只能删除自己的）
    const { error } = await supabase
      .from("makeup_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) {
      console.error("删除评论失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("删除评论异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 点赞/取消点赞评论
 * @param commentId 评论 ID
 */
export async function toggleCommentLike(commentId: string) {
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
      .from("comment_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("comment_id", commentId)
      .single();

    if (existingLike) {
      // 取消点赞
      const { error } = await supabase
        .from("comment_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("comment_id", commentId);

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
      const { error } = await supabase.from("comment_likes").insert({
        user_id: user.id,
        comment_id: commentId,
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
    console.error("点赞评论操作异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}
