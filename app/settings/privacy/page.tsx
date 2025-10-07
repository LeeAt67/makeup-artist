import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PrivacySettingsPage() {
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
          隐私设置
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            此功能正在开发中...
          </p>
        </div>
      </main>
    </div>
  );
}

