"use client";

import { login } from "@/lib/actions/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function LoginForm() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (message) {
      setError("");
    }
  }, [message]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError("登录失败，请稍后重试");
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* 背景渐变 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(240, 66, 153, 0.3), transparent 70%)",
        }}
      />

      {/* 主内容 */}
      <div className="relative z-10 mx-auto w-full max-w-sm px-4">
        {/* 头部 */}
        <div className="mb-8 text-center">
          {/* Logo 图标 */}
          <svg
            className="mx-auto h-20 w-20 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
              fill="currentColor"
            />
            <path
              d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
              fill="currentColor"
            />
            <path
              d="M12 14c-3.86 0-7 1.29-7 3.5v.5h14v-.5c0-2.21-3.14-3.5-7-3.5z"
              fill="currentColor"
            />
          </svg>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            欢迎回来
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            登录以继续您的美丽之旅
          </p>
        </div>

        {/* 提示消息 */}
        {message && (
          <div className="mb-4 rounded-full bg-primary/10 px-6 py-3 text-center text-sm text-primary">
            {message}
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 rounded-full bg-red-500/10 px-6 py-3 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="sr-only" htmlFor="username">
              用户名
            </label>
            <input
              className="form-input w-full rounded-full border-none bg-surface-light/50 dark:bg-surface-dark/50 px-6 py-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:bg-surface-light dark:focus:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all"
              id="username"
              name="username"
              placeholder="用户名"
              type="text"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="password">
              密码
            </label>
            <input
              className="form-input w-full rounded-full border-none bg-surface-light/50 dark:bg-surface-dark/50 px-6 py-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:bg-surface-light dark:focus:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all"
              id="password"
              name="password"
              placeholder="密码"
              type="password"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              className="w-full rounded-full bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "登录中..." : "登录"}
            </button>
          </div>
        </form>

        {/* 底部链接 */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <div className="text-gray-500 dark:text-gray-400 text-xs">
            忘记密码？请联系客服
          </div>
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            注册
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          加载中...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
