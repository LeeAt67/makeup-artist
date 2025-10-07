import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getUserProfile,
  getUserPosts,
  checkIsFollowing,
} from "@/lib/actions/social";
import FollowButton from "./follow-button";
import UserTabs from "./user-tabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 获取当前用户
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  // 获取用户资料
  const profileResult = await getUserProfile(id);

  if (!profileResult.success || !profileResult.data) {
    redirect("/");
  }

  const profile = profileResult.data;

  // 获取用户帖子
  const postsResult = await getUserPosts(id);
  const posts = postsResult.success ? postsResult.data : [];

  // 检查是否已关注（仅当有登录用户且不是自己的主页时）
  let isFollowing = false;
  if (currentUser && currentUser.id !== id) {
    const followResult = await checkIsFollowing(id);
    isFollowing = followResult.isFollowing;
  }

  const isOwnProfile = currentUser?.id === id;

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20">
      {/* 用户信息卡片 */}
      <div className="bg-[var(--surface)] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* 头像和基本信息 */}
          <div className="flex items-start gap-4 mb-6">
            {/* 头像 */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username || "用户头像"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-gray-400">
                    person
                  </span>
                </div>
              )}
            </div>

            {/* 用户名和关注按钮 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-[var(--content)] truncate">
                  {profile.username || "匿名用户"}
                </h1>
                {!isOwnProfile && currentUser && (
                  <FollowButton
                    userId={id}
                    initialIsFollowing={isFollowing}
                  />
                )}
                {isOwnProfile && (
                  <a
                    href="/profile/edit"
                    className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-[var(--content)] text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    编辑资料
                  </a>
                )}
              </div>

              {/* 个性签名 */}
              {profile.bio && (
                <p className="text-sm text-[var(--content-subtle)] mb-3 line-clamp-2">
                  {profile.bio}
                </p>
              )}

              {/* 统计数据 */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-[var(--content)]">
                    {profile.posts_count || 0}
                  </span>
                  <span className="text-[var(--content-subtle)]">帖子</span>
                </div>
                <a
                  href={`/profile/${id}/followers`}
                  className="flex flex-col items-center hover:opacity-70 transition-opacity"
                >
                  <span className="font-semibold text-[var(--content)]">
                    {profile.followers_count || 0}
                  </span>
                  <span className="text-[var(--content-subtle)]">粉丝</span>
                </a>
                <a
                  href={`/profile/${id}/following`}
                  className="flex flex-col items-center hover:opacity-70 transition-opacity"
                >
                  <span className="font-semibold text-[var(--content)]">
                    {profile.following_count || 0}
                  </span>
                  <span className="text-[var(--content-subtle)]">关注</span>
                </a>
              </div>
            </div>
          </div>

          {/* 用户标签信息 */}
          {(profile.face_shape || profile.skin_type) && (
            <div className="flex flex-wrap gap-2">
              {profile.face_shape && (
                <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 text-xs rounded-full">
                  {
                    {
                      round: "圆形脸",
                      square: "方形脸",
                      oval: "鹅蛋脸",
                      long: "长形脸",
                      heart: "心形脸",
                      diamond: "菱形脸",
                    }[profile.face_shape]
                  }
                </span>
              )}
              {profile.skin_type && (
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                  {
                    {
                      dry: "干性肌肤",
                      oily: "油性肌肤",
                      combination: "混合性肌肤",
                      sensitive: "敏感肌肤",
                    }[profile.skin_type]
                  }
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 内容标签页 */}
      <UserTabs userId={id} initialPosts={posts} isOwnProfile={isOwnProfile} />
    </div>
  );
}

