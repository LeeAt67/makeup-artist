import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserFavorites } from "@/lib/actions/social";
import Link from "next/link";

export default async function FavoritesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取收藏列表
  const result = await getUserFavorites(50);
  const favorites = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20">
      {/* 头部 */}
      <header className="sticky top-0 z-10 flex items-center bg-[var(--surface)] border-b border-gray-200 dark:border-gray-800 p-4">
        <Link
          href="/profile"
          className="flex items-center justify-center h-10 w-10 text-[var(--content)]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold text-center flex-1 text-[var(--content)]">
          我的收藏
        </h1>
        <div className="w-10"></div>
      </header>

      {/* 收藏列表 */}
      <div className="max-w-2xl mx-auto p-4">
        {favorites && favorites.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
              bookmark_border
            </span>
            <p className="mt-4 text-[var(--content-subtle)]">还没有收藏任何内容</p>
            <Link
              href="/"
              className="mt-4 inline-block px-6 py-2 bg-[var(--primary)] text-white rounded-full hover:opacity-90 transition-opacity"
            >
              去发现
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {favorites?.map((post: any) => (
              <Link
                key={post.id}
                href={`/makeup/${post.id}`}
                className="aspect-square relative group overflow-hidden rounded"
              >
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        favorite
                      </span>
                      <span>{post.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        visibility
                      </span>
                      <span>{post.views_count}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

