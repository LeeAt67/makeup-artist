import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

// 模拟妆容数据
const makeupPosts = [
  {
    id: 1,
    title: "日系清透感妆容",
    description: "清新自然的日系妆容，展现真实之美",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    author: {
      name: "美妆达人A",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    likes: 1200,
    views: 1234,
    featured: true,
  },
  {
    id: 2,
    title: "夏日海边妆容",
    description: "清爽活力的夏日妆容",
    image:
      "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600&q=80",
    author: {
      name: "美妆达人A",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    likes: 345,
  },
  {
    id: 3,
    title: "晚间约会妆容",
    description: "浪漫温柔的约会妆",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80",
    author: {
      name: "化妆师B",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    likes: 678,
  },
  {
    id: 4,
    title: "清新日常妆容",
    description: "适合每天的自然妆",
    image:
      "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80",
    author: {
      name: "小红",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    likes: 912,
  },
  {
    id: 5,
    title: "活力运动妆容",
    description: "持久不脱的运动妆",
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&q=80",
    author: {
      name: "美妆达人A",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    likes: 1100,
  },
  {
    id: 6,
    title: "温柔约会妆容",
    description: "展现温柔气质",
    image:
      "https://images.unsplash.com/photo-1499310392430-c4b28c6b6b53?w=600&q=80",
    author: {
      name: "化妆师B",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    likes: 2300,
  },
];

export default function Home() {
  const featuredPost = makeupPosts.find((post) => post.featured);
  const regularPosts = makeupPosts.filter((post) => !post.featured);

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
                style={{ backgroundImage: `url('${featuredPost.image}')` }}
              />
              <div className="p-4">
                <p className="text-lg font-bold text-content-light dark:text-content-dark">
                  {featuredPost.title}
                </p>
                <p className="text-subtle-light dark:text-subtle-dark text-sm mt-1">
                  {featuredPost.description}
                </p>
                <div className="flex items-center justify-between text-xs mt-2 text-subtle-light dark:text-subtle-dark">
                  <span>{featuredPost.views}人已学</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      favorite_border
                    </span>
                    <span>{featuredPost.likes}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 妆容瀑布流 */}
        <section className="px-4 py-5">
          <div className="grid grid-cols-2 gap-4">
            {regularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/makeup/${post.id}`}
                className="group flex flex-col gap-2 transition-all duration-200 ease-in-out"
              >
                <div
                  className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-lg"
                  style={{ backgroundImage: `url('${post.image}')` }}
                />
                <p className="text-content-light dark:text-content-dark text-sm font-medium">
                  {post.title}
                </p>
                <div className="flex items-center text-xs text-subtle-light dark:text-subtle-dark gap-2">
                  <div className="flex items-center gap-1">
                    <img
                      className="w-4 h-4 rounded-full object-cover"
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      favorite_border
                    </span>
                    <span>{post.likes}</span>
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
