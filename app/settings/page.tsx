import { BottomNav } from "@/components/bottom-nav";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  href?: string;
  action?: "logout";
  dangerous?: boolean;
}

const settingsSections = [
  {
    title: "账号设置",
    items: [
      {
        id: "edit-profile",
        title: "编辑资料",
        description: "修改昵称、头像、个性签名等",
        icon: "person",
        href: "/profile/edit",
      },
      {
        id: "change-password",
        title: "修改密码",
        description: "更改登录密码",
        icon: "lock",
        href: "/settings/change-password",
      },
    ],
  },
  {
    title: "内容与隐私",
    items: [
      {
        id: "privacy",
        title: "隐私设置",
        description: "管理谁可以查看你的内容",
        icon: "shield",
        href: "/settings/privacy",
      },
      {
        id: "blocked-users",
        title: "黑名单管理",
        description: "管理已屏蔽的用户",
        icon: "block",
        href: "/settings/blocked",
      },
    ],
  },
  {
    title: "通知设置",
    items: [
      {
        id: "notifications",
        title: "消息通知",
        description: "管理点赞、评论等通知",
        icon: "notifications",
        href: "/settings/notifications",
      },
    ],
  },
  {
    title: "其他",
    items: [
      {
        id: "about",
        title: "关于妆娘",
        description: "版本信息与使用条款",
        icon: "info",
        href: "/settings/about",
      },
      {
        id: "feedback",
        title: "反馈与帮助",
        description: "遇到问题？向我们反馈",
        icon: "help",
        href: "/settings/feedback",
      },
    ],
  },
  {
    title: "账号操作",
    items: [
      {
        id: "logout",
        title: "退出登录",
        description: "退出当前账号",
        icon: "logout",
        action: "logout" as const,
        dangerous: true,
      },
    ],
  },
];

export default async function SettingsPage() {
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

  const username =
    profile?.username || user.email?.replace("@app.local", "") || "用户";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-background-light dark:bg-background-dark">
        {/* 头部 */}
        <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-b border-gray-200 dark:border-gray-700/50">
          <Link
            href="/profile"
            className="flex items-center justify-center h-10 w-10 text-gray-800 dark:text-gray-200"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-lg font-bold text-center flex-1 text-gray-900 dark:text-white">
            设置
          </h1>
          <div className="w-10"></div>
        </header>

        <div className="pb-20">
          {/* 用户信息卡片 */}
          <div className="p-4 bg-white dark:bg-surface-dark m-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${
                    profile?.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      username
                    )}&background=f04299&color=fff`
                  }')`,
                }}
              />
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{username}
                </p>
              </div>
            </div>
          </div>

          {/* 设置列表 */}
          <div className="px-4 space-y-6">
            {settingsSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2">
                  {section.title}
                </h2>
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm divide-y divide-gray-100 dark:divide-gray-700/50">
                  {section.items.map((item) => {
                    if (item.action === "logout") {
                      return (
                        <form key={item.id} action={logout} className="w-full">
                          <button
                            type="submit"
                            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                          >
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                item.dangerous
                                  ? "bg-red-50 dark:bg-red-900/20"
                                  : "bg-gray-100 dark:bg-gray-700"
                              }`}
                            >
                              <span
                                className={`material-symbols-outlined ${
                                  item.dangerous
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-600 dark:text-gray-300"
                                }`}
                              >
                                {item.icon}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  item.dangerous
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {item.title}
                              </p>
                              {item.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <span
                              className={`material-symbols-outlined ${
                                item.dangerous
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-400"
                              }`}
                            >
                              chevron_right
                            </span>
                          </button>
                        </form>
                      );
                    }

                    return (
                      <Link
                        key={item.id}
                        href={item.href || "#"}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
                          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                            {item.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="material-symbols-outlined text-gray-400">
                          chevron_right
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 版本信息 */}
          <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
            <p>妆娘 v1.0.0</p>
            <p className="mt-1">© 2024 妆娘 APP. All rights reserved.</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

