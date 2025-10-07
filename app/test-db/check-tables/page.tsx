import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CheckTablesPage() {
  const supabase = await createClient();

  // 检查各个表
  const tables = [
    "profiles",
    "makeup_posts",
    "makeup_likes",
    "makeup_favorites",
    "makeup_comments",
    "comment_likes",
    "products",
    "product_reviews",
    "makeup_products",
    "face_scans",
  ];

  const tableStatus: Array<{
    name: string;
    exists: boolean;
    count: number;
    error?: string;
  }> = [];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      tableStatus.push({
        name: table,
        exists: !error,
        count: count || 0,
        error: error?.message,
      });
    } catch (error) {
      tableStatus.push({
        name: table,
        exists: false,
        count: 0,
        error: error instanceof Error ? error.message : "未知错误",
      });
    }
  }

  // 检查当前用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-content-light dark:text-content-dark">
            数据库状态检查
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            返回首页
          </Link>
        </div>

        {/* 用户信息 */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-content-light dark:text-content-dark mb-4">
            当前用户
          </h2>
          {user ? (
            <div className="space-y-2 text-sm">
              <p className="text-content-light dark:text-content-dark">
                <span className="text-subtle-light dark:text-subtle-dark">
                  用户 ID:
                </span>{" "}
                {user.id}
              </p>
              <p className="text-content-light dark:text-content-dark">
                <span className="text-subtle-light dark:text-subtle-dark">
                  邮箱:
                </span>{" "}
                {user.email}
              </p>
            </div>
          ) : (
            <p className="text-amber-600 dark:text-amber-400">
              ⚠️ 未登录 - 请先
              <Link href="/login" className="underline ml-1">
                登录
              </Link>
            </p>
          )}
        </div>

        {/* 数据表状态 */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6">
          <h2 className="text-lg font-bold text-content-light dark:text-content-dark mb-4">
            数据表状态
          </h2>
          <div className="space-y-3">
            {tableStatus.map((table) => (
              <div
                key={table.name}
                className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      table.exists ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-content-light dark:text-content-dark">
                      {table.name}
                    </p>
                    {table.error && (
                      <p className="text-xs text-red-500 mt-1">{table.error}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {table.exists ? (
                    <div>
                      <p className="text-sm font-medium text-content-light dark:text-content-dark">
                        {table.count} 条记录
                      </p>
                      {table.count === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          表为空
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">表不存在</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 设置指南 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">
            📋 数据库设置指南
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>如果发现表不存在或为空，请按以下顺序执行 SQL 脚本：</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>
                <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                  supabase-setup.sql
                </code>{" "}
                - 基础表结构
              </li>
              <li>
                <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                  supabase-makeup-posts.sql
                </code>{" "}
                - 妆容帖子表
              </li>
              <li>
                <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                  supabase-comments-system.sql
                </code>{" "}
                - 评论系统
              </li>
              <li>
                <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                  supabase-products-system.sql
                </code>{" "}
                - 产品系统
              </li>
              <li>
                <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                  supabase-rpc-functions.sql
                </code>{" "}
                - RPC 函数
              </li>
              <li>
                <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                  supabase-insert-sample-data.sql
                </code>{" "}
                - 示例数据（需替换用户 UUID）
              </li>
            </ol>
            <p className="mt-3">
              💡 提示：在 Supabase Dashboard → SQL Editor 中执行这些脚本
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
