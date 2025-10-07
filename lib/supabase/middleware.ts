import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 在 Middleware 中创建 Supabase 客户端
 * 用于在中间件中进行身份验证和授权检查
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 检查环境变量是否存在
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    // 如果环境变量缺失，允许请求继续，但没有用户
    return { supabaseResponse, user: null };
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse = NextResponse.next({
              request,
            });
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // 刷新 session
    // 这将自动处理 token 刷新
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { supabaseResponse, user };
  } catch (error) {
    console.error("Error in updateSession:", error);
    // 如果出错，允许请求继续，但没有用户
    return { supabaseResponse, user: null };
  }
}
