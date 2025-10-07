/**
 * Supabase 数据库类型定义
 *
 * 如何生成类型：
 * 1. 安装 Supabase CLI: npm install -g supabase
 * 2. 登录: supabase login
 * 3. 生成类型: npx supabase gen types typescript --project-id <your-project-id> --schema public > lib/supabase/types.ts
 *
 * 或者使用 Supabase Dashboard 中的 Database Types 功能自动生成
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // 用户资料表
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          username: string | null;
          bio: string | null;
          avatar_url: string | null;
          skin_type: "dry" | "oily" | "combination" | "sensitive" | null;
          skin_tone: string | null;
          face_shape:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond"
            | null;
          followers_count: number;
          following_count: number;
          posts_count: number;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          skin_type?: "dry" | "oily" | "combination" | "sensitive" | null;
          skin_tone?: string | null;
          face_shape?:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond"
            | null;
          followers_count?: number;
          following_count?: number;
          posts_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          skin_type?: "dry" | "oily" | "combination" | "sensitive" | null;
          skin_tone?: string | null;
          face_shape?:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond"
            | null;
          followers_count?: number;
          following_count?: number;
          posts_count?: number;
        };
      };
      // 妆容表
      makeups: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string | null;
          image_url: string;
          video_url: string | null;
          face_shapes: string[];
          scenes: string[];
          difficulty: "beginner" | "intermediate" | "advanced";
          likes_count: number;
          views_count: number;
          author_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description?: string | null;
          image_url: string;
          video_url?: string | null;
          face_shapes?: string[];
          scenes?: string[];
          difficulty?: "beginner" | "intermediate" | "advanced";
          likes_count?: number;
          views_count?: number;
          author_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          video_url?: string | null;
          face_shapes?: string[];
          scenes?: string[];
          difficulty?: "beginner" | "intermediate" | "advanced";
          likes_count?: number;
          views_count?: number;
          author_id?: string;
        };
      };
      // 收藏表
      favorites: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          makeup_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          makeup_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          makeup_id?: string;
        };
      };
      // 脸型识别历史记录表
      face_scans: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          image_url: string;
          face_shape:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond";
          confidence: number;
          is_manually_adjusted: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          image_url: string;
          face_shape:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond";
          confidence: number;
          is_manually_adjusted?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          image_url?: string;
          face_shape?:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond";
          confidence?: number;
          is_manually_adjusted?: boolean;
        };
      };
      // 妆容帖子表
      makeup_posts: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          content?: string | null;
          cover_image: string;
          images?: string[] | null;
          video_url?: string | null;
          category?: string;
          face_shape?: string | null;
          tags?: string[] | null;
          likes_count?: number;
          views_count?: number;
          comments_count?: number;
          favorites_count?: number;
          is_featured?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          content?: string | null;
          cover_image?: string;
          images?: string[] | null;
          video_url?: string | null;
          category?: string;
          face_shape?: string | null;
          tags?: string[] | null;
          likes_count?: number;
          views_count?: number;
          comments_count?: number;
          favorites_count?: number;
          is_featured?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      // 妆容点赞表
      makeup_likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      // 妆容收藏表
      makeup_favorites: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      // 用户关注表
      user_follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      face_shape_type:
        | "round"
        | "square"
        | "oval"
        | "long"
        | "heart"
        | "diamond";
      skin_type: "dry" | "oily" | "combination" | "sensitive";
      difficulty_level: "beginner" | "intermediate" | "advanced";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
