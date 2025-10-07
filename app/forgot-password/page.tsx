"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  // 暂不使用，仅作为页面展示

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
          {/* 返回按钮 */}
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回登录
          </Link>

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
            忘记密码
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            暂未接入短信服务，请联系客服重置密码
          </p>
        </div>

        {/* 客服联系方式 */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-surface-light/50 dark:bg-surface-dark/50 p-6 text-center">
            <div className="mb-4">
              <span className="material-symbols-outlined text-5xl text-primary">
                support_agent
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              如需重置密码，请联系客服
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              客服热线：400-123-4567
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              工作时间：09:00 - 18:00
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-transform duration-200 hover:scale-105"
            >
              返回登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
