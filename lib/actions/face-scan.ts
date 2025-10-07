"use server";

import { createClient } from "@/lib/supabase/server";
import type { FaceShape, FaceScanResult } from "@/lib/constants/face-shapes";

/**
 * 模拟 AI 脸型识别
 * TODO: 接入真实的 AI 识别 API
 */
function simulateAIRecognition(): {
  face_shape: FaceShape;
  confidence: number;
} {
  const faceShapes: FaceShape[] = [
    "round",
    "square",
    "oval",
    "long",
    "heart",
    "diamond",
  ];
  const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
  const confidence = 0.75 + Math.random() * 0.2; // 0.75-0.95 之间的置信度

  return {
    face_shape: randomShape,
    confidence: Number(confidence.toFixed(2)),
  };
}

/**
 * 上传脸型识别照片并进行识别
 */
export async function uploadAndRecognizeFace(formData: FormData) {
  try {
    const supabase = await createClient();

    // 检查用户是否登录
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "请先登录",
      };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return {
        success: false,
        error: "请选择图片文件",
      };
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "请上传图片文件",
      };
    }

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "图片大小不能超过 5MB",
      };
    }

    // 生成唯一文件名
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // 上传到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("face-scans")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("上传失败:", uploadError);
      return {
        success: false,
        error: "图片上传失败，请重试",
      };
    }

    // 获取图片 URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("face-scans").getPublicUrl(fileName);

    // 调用 AI 识别（目前是模拟）
    const recognitionResult = simulateAIRecognition();

    // 保存识别记录到数据库
    const { data: scanRecord, error: insertError } = await supabase
      .from("face_scans")
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        face_shape: recognitionResult.face_shape,
        confidence: recognitionResult.confidence,
        is_manually_adjusted: false,
      } as any)
      .select()
      .single();

    if (insertError) {
      console.error("保存识别记录失败:", insertError);
      // 删除已上传的图片
      await supabase.storage.from("face-scans").remove([fileName]);
      return {
        success: false,
        error: "保存识别记录失败",
      };
    }

    // 更新用户资料中的脸型
    await (supabase.from("profiles") as any)
      .update({
        face_shape: recognitionResult.face_shape,
      })
      .eq("id", user.id);

    return {
      success: true,
      data: scanRecord as FaceScanResult,
    };
  } catch (error) {
    console.error("脸型识别异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 获取用户的识别历史记录
 */
export async function getFaceScanHistory(limit = 10) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "请先登录",
        data: [],
      };
    }

    const { data, error } = await supabase
      .from("face_scans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取识别历史失败:", error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data as FaceScanResult[],
    };
  } catch (error) {
    console.error("获取识别历史异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
      data: [],
    };
  }
}

/**
 * 手动调整脸型识别结果
 */
export async function updateFaceShape(scanId: string, newFaceShape: FaceShape) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "请先登录",
      };
    }

    // 更新识别记录
    const { error: updateError } = await (supabase.from("face_scans") as any)
      .update({
        face_shape: newFaceShape,
        is_manually_adjusted: true,
      })
      .eq("id", scanId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("更新脸型失败:", updateError);
      return {
        success: false,
        error: "更新失败",
      };
    }

    // 同时更新用户资料
    await (supabase.from("profiles") as any)
      .update({
        face_shape: newFaceShape,
      })
      .eq("id", user.id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("更新脸型异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}

/**
 * 删除识别记录
 */
export async function deleteFaceScan(scanId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "请先登录",
      };
    }

    // 获取记录详情
    // @ts-ignore - Supabase 类型定义暂未包含 face_scans 表
    const { data: scan } = await supabase
      .from("face_scans")
      .select("image_url")
      .eq("id", scanId)
      .eq("user_id", user.id)
      .single();

    if (!scan || !(scan as any).image_url) {
      return {
        success: false,
        error: "记录不存在",
      };
    }

    // 删除数据库记录
    // @ts-ignore - Supabase 类型定义暂未包含 face_scans 表
    const { error: deleteError } = await supabase
      .from("face_scans")
      .delete()
      .eq("id", scanId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("删除记录失败:", deleteError);
      return {
        success: false,
        error: "删除失败",
      };
    }

    // 删除存储的图片
    // 从 URL 中提取文件路径
    const urlParts = (scan as any).image_url.split("/face-scans/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await supabase.storage.from("face-scans").remove([filePath]);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("删除识别记录异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
}
