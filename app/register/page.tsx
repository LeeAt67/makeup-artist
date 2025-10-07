"use client";

import { signup } from "@/lib/actions/auth";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // 用户名验证
  function validateUsername(username: string): boolean {
    // 用户名规则：3-20位，只能包含字母、数字、下划线
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // 客户端验证
    if (!validateUsername(username)) {
      setError("用户名格式错误（3-20位，仅字母数字下划线）");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("密码长度至少为 6 位");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError("注册失败，请稍后重试");
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
            创建账号
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            开始您的美丽之旅
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 rounded-full bg-red-500/10 px-6 py-3 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* 注册表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="sr-only" htmlFor="username">
              用户名
            </label>
            <input
              className="form-input w-full rounded-full border-none bg-surface-light/50 dark:bg-surface-dark/50 px-6 py-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:bg-surface-light dark:focus:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all"
              id="username"
              name="username"
              placeholder="用户名（3-20位字母数字）"
              type="text"
              minLength={3}
              maxLength={20}
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
              placeholder="密码（至少 6 位）"
              type="password"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="confirmPassword">
              确认密码
            </label>
            <input
              className="form-input w-full rounded-full border-none bg-surface-light/50 dark:bg-surface-dark/50 px-6 py-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:bg-surface-light dark:focus:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark transition-all"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="确认密码"
              type="password"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              className="w-full rounded-full bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "注册中..." : "注册"}
            </button>
          </div>
        </form>

        {/* 底部链接 */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">已有账号？</span>
          <Link
            href="/login"
            className="ml-2 font-medium text-primary hover:text-primary/80 transition-colors"
          >
            立即登录
          </Link>
        </div>

        {/* 服务协议 */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          注册即表示您同意我们的
          <Link href="/terms" className="text-primary hover:text-primary/80">
            服务条款
          </Link>
          和
          <Link href="/privacy" className="text-primary hover:text-primary/80">
            隐私政策
          </Link>
        </div>

        {/* 温馨提示 */}
        <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          注册后可直接登录，无需验证
        </div>
      </div>
    </div>
  );
}
