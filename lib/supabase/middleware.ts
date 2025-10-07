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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  // 刷新 session
  // 这将自动处理 token 刷新
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
