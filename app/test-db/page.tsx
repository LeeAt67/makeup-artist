"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface TestResult {
  success: boolean;
  message: string;
  details?: {
    tablesCount?: number;
    bucketsCount?: number;
    canConnect?: boolean;
  };
}

export default function TestDatabasePage() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // 测试 1: 检查能否连接到数据库
      const { error: profilesError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);

      if (profilesError) {
        setResult({
          success: false,
          message: "数据库连接失败",
          details: { canConnect: false },
        });
        return;
      }

      // 测试 2: 检查其他表
      const tables = ["makeups", "favorites", "face_scans"];
      const tableTests = await Promise.all(
        tables.map((table) => supabase.from(table).select("count").limit(1))
      );

      const allTablesOk = tableTests.every((test) => !test.error);

      // 测试 3: 检查存储桶
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();

      setResult({
        success: allTablesOk && !bucketsError,
        message:
          allTablesOk && !bucketsError
            ? "✅ Supabase 配置完全正确！"
            : "⚠️ 部分配置存在问题",
        details: {
          tablesCount: allTablesOk ? 4 : 0,
          bucketsCount: buckets?.length || 0,
          canConnect: true,
        },
      });
    } catch (error) {
      setResult({
        success: false,
        message:
          "连接错误: " + (error instanceof Error ? error.message : "未知错误"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-content-light dark:text-content-dark mb-8">
          Supabase 配置测试
        </h1>

        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-lg">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6">
              <div
                className={`text-center p-6 rounded-xl ${
                  result.success
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div className="text-4xl mb-4">
                  {result.success ? "🎉" : "❌"}
                </div>
                <h2
                  className={`text-xl font-semibold ${
                    result.success
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {result.message}
                </h2>
              </div>

              {result.details && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-content-light dark:text-content-dark">
                    配置详情：
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <span className="text-subtle-light dark:text-subtle-dark">
                        数据库连接
                      </span>
                      <span className="font-semibold">
                        {result.details.canConnect ? "✅ 正常" : "❌ 失败"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <span className="text-subtle-light dark:text-subtle-dark">
                        数据表数量
                      </span>
                      <span className="font-semibold">
                        {result.details.tablesCount || 0} / 4
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <span className="text-subtle-light dark:text-subtle-dark">
                        存储桶数量
                      </span>
                      <span className="font-semibold">
                        {result.details.bucketsCount || 0} / 3
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={testConnection}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  重新测试
                </button>
              </div>

              {result.success && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    🚀 下一步：
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1 ml-4">
                    <li>• 实现用户认证功能</li>
                    <li>• 创建妆容内容发布功能</li>
                    <li>• 添加收藏和点赞功能</li>
                    <li>• 集成 AI 脸型识别 API</li>
                  </ul>
                </div>
              )}

              {!result.success && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                    💡 故障排查：
                  </h4>
                  <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1 ml-4">
                    <li>• 检查 .env.local 文件配置是否正确</li>
                    <li>• 确认 SQL 脚本已完全执行</li>
                    <li>• 查看浏览器控制台的错误信息</li>
                    <li>• 参考 SUPABASE_SETUP.md 文档</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-content-light dark:text-content-dark mb-4">
              📚 参考文档
            </h3>
            <div className="space-y-2 text-sm">
              <a
                href="/api/test-supabase"
                target="_blank"
                className="block text-primary hover:underline"
              >
                → API 测试端点
              </a>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                className="block text-primary hover:underline"
              >
                → Supabase Dashboard
              </a>
              <a href="/" className="block text-primary hover:underline">
                → 返回首页
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
