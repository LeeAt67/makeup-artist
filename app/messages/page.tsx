import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

// 模拟消息数据
const messages = [
  {
    id: 1,
    user: {
      name: "张小婷",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    content: "喜欢了你的妆容",
    quote:
      "如果你喜欢这个妆容，可以点击‘喜欢’按钮。这是一个非常适合春季出游的妆容，希望能给你带来灵感。",
    time: "2分钟前",
    isUnread: true,
  },
  {
    id: 2,
    user: {
      name: "李大强",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    content: "评论了你的妆容",
    quote: "这个眼妆太美了！可以出一个教程吗？",
    time: "1小时前",
    isUnread: false,
  },
  {
    id: 3,
    user: {
      name: "王小红",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    content: "关注了你",
    time: "3小时前",
    isUnread: false,
  },
  {
    id: 4,
    type: "system",
    content: "您的‘夏日清凉’妆容已通过审核。",
    time: "昨天",
    isUnread: false,
  },
  {
    id: 5,
    user: {
      name: "刘小刚",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    content: "喜欢了你的妆容",
    time: "2天前",
    isUnread: false,
  },
  {
    id: 6,
    user: {
      name: "周小兰",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    content: "喜欢了你的妆容",
    time: "2天前",
    isUnread: false,
  },
];

export default function MessagesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 头部 */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <Link href="/" className="p-2 -ml-2">
            <span className="material-symbols-outlined text-zinc-900 dark:text-zinc-200">
              arrow_back
            </span>
          </Link>
          <h1 className="flex-1 text-lg font-bold text-center text-zinc-900 dark:text-zinc-200">
            消息
          </h1>
          <div className="w-8"></div>
        </div>

        {/* 标签页导航 */}
        <div className="px-4">
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            <Link
              href="/messages"
              className="relative flex-1 py-3 text-sm font-bold text-center text-primary"
            >
              所有
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary"></span>
            </Link>
            <Link
              href="/messages/interactions"
              className="flex-1 py-3 text-sm font-bold text-center text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              互动
            </Link>
            <Link
              href="/messages/system"
              className="flex-1 py-3 text-sm font-bold text-center text-zinc-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              系统
            </Link>
          </div>
        </div>
      </header>

      {/* 消息列表 */}
      <main className="flex-1">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {messages.map((message) => (
            <Link
              key={message.id}
              href={`/messages/${message.id}`}
              className="flex items-start gap-4 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors"
            >
              {/* 头像 */}
              {message.type === "system" ? (
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    info
                  </span>
                </div>
              ) : (
                <div className="relative flex-shrink-0">
                  <div
                    className="h-14 w-14 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${message.user?.avatar}')`,
                    }}
                  />
                  {message.isUnread && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-primary border-2 border-background-light dark:border-background-dark"></span>
                  )}
                </div>
              )}

              {/* 消息内容 */}
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <p className="font-bold text-zinc-900 dark:text-zinc-200">
                    {message.type === "system"
                      ? "系统通知"
                      : message.user?.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {message.time}
                  </p>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {message.content}
                </p>
                {message.quote && (
                  <div className="mt-2 p-3 rounded bg-zinc-100 dark:bg-zinc-800/50">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {message.quote}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
