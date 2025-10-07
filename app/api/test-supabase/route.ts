import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 测试 Supabase 连接的 API 路由
 * 访问 /api/test-supabase 来验证配置是否正确
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // 测试数据库连接
    const { error } = await supabase.from("profiles").select("count").limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "数据库连接失败",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase 配置成功！",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "连接错误",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
