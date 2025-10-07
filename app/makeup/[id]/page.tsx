import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  getMakeupPostById,
  incrementViewCount,
  checkUserLiked,
  checkUserFavorited,
} from "@/lib/actions/makeup";
import { getComments } from "@/lib/actions/comments";
import { createClient } from "@/lib/supabase/server";
import { MakeupActions } from "./makeup-actions";
import { CommentsSection } from "./comments-section";

interface MakeupDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MakeupDetailPage({
  params,
}: MakeupDetailPageProps) {
  const { id } = await params;

  // 获取妆容详情
  const result = await getMakeupPostById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  // 增加浏览数（不等待结果）
  incrementViewCount(id);

  // 获取当前用户
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 检查点赞和收藏状态
  const [likedResult, favoritedResult, commentsResult] = await Promise.all([
    checkUserLiked(id),
    checkUserFavorited(id),
    getComments(id, 50),
  ]);

  const initialLiked = likedResult.liked || false;
  const initialFavorited = favoritedResult.favorited || false;
  const comments = commentsResult.data || [];

  // 解析内容为步骤（假设内容是 JSON 格式的步骤数组）
  let steps: Array<{ title: string; description: string; image?: string }> = [];
  if (post.content) {
    try {
      steps = JSON.parse(post.content);
    } catch {
      // 如果不是 JSON，将整个内容作为单个步骤
      steps = [{ title: "教程详情", description: post.content }];
    }
  }

  // 标签映射
  const categoryLabels: Record<string, string> = {
    daily: "日常通勤",
    party: "派对/音乐节",
    business: "商务会议",
    date: "约会",
    interview: "面试",
  };

  const faceShapeLabels: Record<string, string> = {
    round: "圆形脸",
    square: "方形脸",
    oval: "鹅蛋脸",
    long: "长形脸",
    heart: "心形脸",
    diamond: "菱形脸",
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            <span className="material-symbols-outlined text-content-light dark:text-content-dark">
              arrow_back
            </span>
          </Link>
          <h1 className="text-lg font-bold text-content-light dark:text-content-dark">
            妆容详情
          </h1>
          <Link
            href="/share"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
          >
            <span className="material-symbols-outlined text-content-light dark:text-content-dark">
              share
            </span>
          </Link>
        </div>
      </header>

      {/* 主图展示 */}
      <section className="relative">
        <div
          className="w-full aspect-[3/4] bg-center bg-cover"
          style={{ backgroundImage: `url('${post.cover_image}')` }}
        />
        {post.video_url && (
          <div className="absolute bottom-4 right-4">
            <button className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="material-symbols-outlined">play_circle</span>
              <span className="text-sm">观看视频</span>
            </button>
          </div>
        )}
      </section>

      {/* 作者信息和互动栏 */}
      <section className="px-4 py-4 bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center justify-between mb-3">
          <Link
            href={`/profile/${post.profiles?.id}`}
            className="flex items-center gap-3"
          >
            <img
              src={
                post.profiles?.avatar_url || "https://i.pravatar.cc/150?img=1"
              }
              alt={post.profiles?.username || "用户"}
              className="w-12 h-12 rounded-full object-cover bg-gray-200"
            />
            <div>
              <p className="font-bold text-content-light dark:text-content-dark">
                {post.profiles?.username || "匿名用户"}
              </p>
              <p className="text-xs text-subtle-light dark:text-subtle-dark">
                {new Date(post.created_at).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </Link>
          {user && user.id !== post.user_id && (
            <button className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              关注
            </button>
          )}
        </div>

        {/* 标题和描述 */}
        <h2 className="text-xl font-bold text-content-light dark:text-content-dark mb-2">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-content-light dark:text-content-dark mb-3">
            {post.description}
          </p>
        )}

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.category && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {categoryLabels[post.category] || post.category}
            </span>
          )}
          {post.face_shape && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
              适合{faceShapeLabels[post.face_shape] || post.face_shape}
            </span>
          )}
          {post.tags &&
            post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-surface-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 text-content-light dark:text-content-dark rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
        </div>

        {/* 互动数据 */}
        <div className="flex items-center gap-4 text-sm text-subtle-light dark:text-subtle-dark border-t border-gray-200 dark:border-gray-700 pt-3">
          <span>{post.views_count || 0} 浏览</span>
          <span>{post.likes_count || 0} 点赞</span>
          <span>{post.comments_count || 0} 评论</span>
          <span>{post.favorites_count || 0} 收藏</span>
        </div>
      </section>

      {/* 妆容步骤教程 */}
      {steps.length > 0 && (
        <section className="px-4 py-6 bg-surface-light dark:bg-surface-dark mt-2">
          <h3 className="text-lg font-bold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              auto_awesome
            </span>
            妆容步骤
          </h3>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-content-light dark:text-content-dark mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-content-light dark:text-content-dark leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                {step.image && (
                  <div
                    className="w-full aspect-video bg-center bg-cover rounded-lg ml-11"
                    style={{ backgroundImage: `url('${step.image}')` }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 多图展示 */}
      {post.images && post.images.length > 0 && (
        <section className="px-4 py-6 bg-surface-light dark:bg-surface-dark mt-2">
          <h3 className="text-lg font-bold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              photo_library
            </span>
            更多图片
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {post.images.map((image, index) => (
              <div
                key={index}
                className="w-full aspect-square bg-center bg-cover rounded-lg"
                style={{ backgroundImage: `url('${image}')` }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 评论区 */}
      <section className="mt-2">
        <CommentsSection
          postId={id}
          initialComments={comments}
          commentsCount={post.comments_count}
          currentUserId={user?.id}
        />
      </section>

      {/* 底部操作栏 */}
      <MakeupActions
        postId={id}
        initialLiked={initialLiked}
        initialFavorited={initialFavorited}
        likesCount={post.likes_count}
        commentsCount={post.comments_count}
      />
    </div>
  );
}
