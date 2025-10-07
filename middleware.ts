import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Middleware
 * 用于在请求处理前更新 Supabase session
 * 这确保了用户的认证状态在整个应用中保持同步
 */
export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  // 定义公开路由（不需要登录就可以访问）
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/auth",
    "/shop",
    "/search",
    "/makeup",
    "/test-db",
  ];

  // 定义需要登录的路由
  const protectedRoutes = ["/profile", "/messages", "/scan"];

  // 检查当前路径是否为需要登录的路由
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 如果用户未登录且访问需要登录的路由，重定向到登录页
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 如果用户已登录且访问登录/注册页面，重定向到首页
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下路径：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     * - 其他静态文件 (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
