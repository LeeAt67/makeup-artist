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
          avatar_url: string | null;
          skin_type: "dry" | "oily" | "combination" | "normal" | null;
          skin_tone: "cool" | "warm" | "neutral" | null;
          face_shape:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond"
            | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          avatar_url?: string | null;
          skin_type?: "dry" | "oily" | "combination" | "normal" | null;
          skin_tone?: "cool" | "warm" | "neutral" | null;
          face_shape?:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond"
            | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          avatar_url?: string | null;
          skin_type?: "dry" | "oily" | "combination" | "normal" | null;
          skin_tone?: "cool" | "warm" | "neutral" | null;
          face_shape?:
            | "round"
            | "square"
            | "oval"
            | "long"
            | "heart"
            | "diamond"
            | null;
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
      skin_type: "dry" | "oily" | "combination" | "normal";
      skin_tone: "cool" | "warm" | "neutral";
      difficulty_level: "beginner" | "intermediate" | "advanced";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
