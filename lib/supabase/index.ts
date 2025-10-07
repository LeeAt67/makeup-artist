/**
 * Supabase 客户端统一导出
 * 方便其他模块导入使用
 */

export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient } from "./server";
export { updateSession } from "./middleware";
export type { Database } from "./types";
