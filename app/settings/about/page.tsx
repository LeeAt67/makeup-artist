import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* 头部 */}
      <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-b border-gray-200 dark:border-gray-700/50">
        <Link
          href="/settings"
          className="flex items-center justify-center h-10 w-10 text-gray-800 dark:text-gray-200"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold text-center flex-1 text-gray-900 dark:text-white">
          关于妆娘
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm space-y-6">
          {/* Logo */}
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-5xl">
                face
              </span>
            </div>
          </div>

          {/* 版本信息 */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              妆娘 APP
            </h2>
            <p className="text-gray-500 dark:text-gray-400">版本 1.0.0</p>
          </div>

          {/* 描述 */}
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              一款以 AI 脸型识别为核心，为用户提供"脸型适配妆容+场景化妆造"双维度推荐的工具类 APP。
            </p>
          </div>

          {/* 链接 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
            <Link
              href="#"
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">使用条款</span>
              <span className="material-symbols-outlined text-gray-400">
                chevron_right
              </span>
            </Link>
            <Link
              href="#"
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">隐私政策</span>
              <span className="material-symbols-outlined text-gray-400">
                chevron_right
              </span>
            </Link>
          </div>

          {/* 版权信息 */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
            <p>© 2024 妆娘 APP. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

