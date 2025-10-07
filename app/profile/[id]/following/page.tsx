import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserFollowing } from "@/lib/actions/social";
import Link from "next/link";
import FollowButton from "../follow-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FollowingPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    redirect("/login");
  }

  // 获取关注列表
  const result = await getUserFollowing(id);
  const following = result.success ? result.data : [];

  const isOwnProfile = currentUser.id === id;

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20">
      {/* 头部 */}
      <header className="sticky top-0 z-10 flex items-center bg-[var(--surface)] border-b border-gray-200 dark:border-gray-800 p-4">
        <Link
          href={isOwnProfile ? "/profile" : `/profile/${id}`}
          className="flex items-center justify-center h-10 w-10 text-[var(--content)]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold text-center flex-1 text-[var(--content)]">
          关注列表
        </h1>
        <div className="w-10"></div>
      </header>

      {/* 关注列表 */}
      <div className="max-w-2xl mx-auto">
        {following && following.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
              person_add
            </span>
            <p className="mt-4 text-[var(--content-subtle)]">
              {isOwnProfile ? "你还没有关注任何人" : "TA还没有关注任何人"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {following?.map((item: any) => {
              const user = item.following;
              if (!user) return null;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <Link
                    href={`/profile/${user.id}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    {/* 头像 */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username || "用户头像"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl text-gray-400">
                            person
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 用户信息 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--content)] truncate">
                        {user.username || "匿名用户"}
                      </p>
                      {user.bio && (
                        <p className="text-sm text-[var(--content-subtle)] truncate">
                          {user.bio}
                        </p>
                      )}
                      <p className="text-xs text-[var(--content-subtle)] mt-1">
                        {user.followers_count || 0} 粉丝 · {user.posts_count || 0}{" "}
                        帖子
                      </p>
                    </div>
                  </Link>

                  {/* 关注按钮 */}
                  {currentUser.id !== user.id && (
                    <FollowButton userId={user.id} initialIsFollowing={true} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

