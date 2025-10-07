import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth Callback Route
 * 处理 Supabase 邮箱验证和密码重置的回调
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 验证成功，重定向到首页
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // 验证失败，重定向到登录页面并显示错误
  return NextResponse.redirect(`${origin}/login?error=验证失败，请重试`);
}
