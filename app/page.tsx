import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { getMakeupPosts, getFeaturedPost } from "@/lib/actions/makeup";

export default async function Home() {
  // 从数据库获取真实数据
  const [featuredResult, postsResult] = await Promise.all([
    getFeaturedPost(),
    getMakeupPosts(20),
  ]);

  const featuredPost = featuredResult.data;
  const allPosts = postsResult.data || [];
  
  // 如果有精选帖子，从列表中排除它
  const regularPosts = featuredPost 
    ? allPosts.filter((post) => post.id !== featuredPost.id)
    : allPosts;

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <main className="flex-grow">
        {/* 头部导航 */}
        <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10 px-4 pt-4">
          <div className="flex items-center justify-between">
            <Link
              href="/search"
              className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark py-2 px-4 rounded-full shadow-sm text-content-light dark:text-content-dark active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark">
                search
              </span>
              <span className="text-sm">搜索</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-primary font-bold">
                推荐
              </Link>
              <Link
                href="/following"
                className="text-subtle-light dark:text-subtle-dark"
              >
                关注
              </Link>
            </div>
            <Link
              href="/notifications"
              className="relative p-2 text-content-light dark:text-content-dark"
            >
              <span className="material-symbols-outlined">notifications</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
            </Link>
          </div>
        </header>

        {/* 特色妆容 */}
        {featuredPost && (
          <section className="px-4 py-5">
            <Link
              href={`/makeup/${featuredPost.id}`}
              className="group block bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden transition-all duration-200 ease-in-out"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                style={{ backgroundImage: `url('${featuredPost.cover_image}')` }}
              />
              <div className="p-4">
                <p className="text-lg font-bold text-content-light dark:text-content-dark">
                  {featuredPost.title}
                </p>
                <p className="text-subtle-light dark:text-subtle-dark text-sm mt-1">
                  {featuredPost.description}
                </p>
                <div className="flex items-center justify-between text-xs mt-2 text-subtle-light dark:text-subtle-dark">
                  <span>{featuredPost.views_count}人已学</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      favorite_border
                    </span>
                    <span>{featuredPost.likes_count}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 妆容瀑布流 */}
        <section className="px-4 py-5">
          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {regularPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/makeup/${post.id}`}
                  className="group flex flex-col gap-2 transition-all duration-200 ease-in-out"
                >
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-lg"
                    style={{ backgroundImage: `url('${post.cover_image}')` }}
                  />
                  <p className="text-content-light dark:text-content-dark text-sm font-medium">
                    {post.title}
                  </p>
                  <div className="flex items-center text-xs text-subtle-light dark:text-subtle-dark gap-2">
                    <div className="flex items-center gap-1">
                      <img
                        className="w-4 h-4 rounded-full object-cover bg-gray-200"
                        src={
                          post.profiles?.avatar_url ||
                          "https://i.pravatar.cc/150?img=1"
                        }
                        alt={post.profiles?.username || "用户"}
                      />
                      <span>{post.profiles?.username || "匿名用户"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        favorite_border
                      </span>
                      <span>{post.likes_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-subtle-light dark:text-subtle-dark mb-4">
                sentiment_dissatisfied
              </span>
              <p className="text-content-light dark:text-content-dark text-lg font-medium mb-2">
                暂无妆容内容
              </p>
              <p className="text-subtle-light dark:text-subtle-dark text-sm">
                快去数据库添加一些妆容帖子吧～
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
