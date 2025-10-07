import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserPosts } from "@/lib/actions/social";

const quickActions = [
  { id: 1, icon: "history", label: "历史记录", href: "/profile/history" },
  {
    id: 2,
    icon: "favorite_border",
    label: "我的收藏",
    href: "/profile/favorites",
  },
  { id: 3, icon: "people", label: "我的关注", href: "#following" },
  { id: 4, icon: "group", label: "我的粉丝", href: "#followers" },
];

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取用户资料
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("*")
    .eq("id", user.id)
    .single();

  // 从邮箱中提取用户名（格式：username@app.local）
  const username =
    profile?.username || user.email?.replace("@app.local", "") || "用户";

  const userData = {
    name: username,
    avatar:
      profile?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username
      )}&background=f04299&color=fff`,
    username: username,
    followersCount: profile?.followers_count || 0,
    followingCount: profile?.following_count || 0,
    postsCount: profile?.posts_count || 0,
  };

  // 获取用户的帖子
  const postsResult = await getUserPosts(user.id, 20);
  const userPosts = postsResult.success ? postsResult.data : [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* 头部 */}
        <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 justify-between">
          <div className="w-12"></div>
          <h1 className="text-lg font-bold text-center flex-1 text-gray-900 dark:text-white">
            我的
          </h1>
          <div className="flex w-12 items-center justify-end">
            <Link
              href="/settings"
              className="flex items-center justify-center h-10 w-10 text-gray-800 dark:text-gray-200"
            >
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </div>
        </header>

        <div className="p-4">
          {/* 用户信息 */}
          <div className="flex items-center gap-4">
            <div
              className="w-24 h-24 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url('${userData.avatar}')` }}
            />
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                @{userData.username}
              </p>
            </div>
            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              编辑资料
            </Link>
          </div>

          {/* 统计数据 */}
          <div className="mt-4 flex items-center justify-around text-center bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.postsCount}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                帖子
              </span>
            </div>
            <Link
              href={`/profile/${user.id}/followers`}
              className="flex flex-col hover:opacity-70 transition-opacity"
            >
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.followersCount}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                粉丝
              </span>
            </Link>
            <Link
              href={`/profile/${user.id}/following`}
              className="flex flex-col hover:opacity-70 transition-opacity"
            >
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.followingCount}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                关注
              </span>
            </Link>
          </div>

          {/* 快捷操作 */}
          <div className="mt-6 grid grid-cols-4 gap-3 text-center">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                href={
                  action.href.startsWith("#")
                    ? `/profile/${user.id}${action.href.replace("#", "/")}`
                    : action.href
                }
                className="flex flex-col items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl text-primary">
                  {action.icon}
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="border-b border-gray-200 dark:border-gray-700/50">
          <nav className="flex px-4 gap-4">
            <Link
              href="/profile"
              className="flex-1 text-center py-3 border-b-2 border-primary text-primary font-bold text-sm"
            >
              我的帖子
            </Link>
            <Link
              href="/profile/liked"
              className="flex-1 text-center py-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors font-bold text-sm"
            >
              赞过的
            </Link>
          </nav>
        </div>

        {/* 帖子网格 */}
        <section className="p-4 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* 发布新帖子按钮 */}
            <Link
              href="/create"
              className="aspect-square bg-cover bg-center rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-4xl">
                  add_circle
                </span>
                <span className="text-sm font-medium">发布新帖子</span>
              </div>
            </Link>

            {/* 用户帖子 */}
            {userPosts.map((post) => (
              <Link
                key={post.id}
                href={`/makeup/${post.id}`}
                className="aspect-square bg-cover bg-center rounded-lg hover:opacity-90 transition-opacity relative group overflow-hidden"
                style={{ backgroundImage: `url('${post.cover_image}')` }}
              >
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
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
