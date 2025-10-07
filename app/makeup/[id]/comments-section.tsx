"use client";

import { useState, useTransition } from "react";
import { createComment, deleteComment, type Comment } from "@/lib/actions/comments";
import { useRouter } from "next/navigation";

interface CommentsSectionProps {
  postId: string;
  initialComments: Comment[];
  commentsCount: number;
  currentUserId?: string;
}

export function CommentsSection({
  postId,
  initialComments,
  commentsCount,
  currentUserId,
}: CommentsSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    if (!currentUserId) {
      alert("请先登录");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    const result = await createComment(postId, commentText);

    if (result.success && result.data) {
      // 添加新评论到列表
      setComments([result.data, ...comments]);
      setCommentText("");
      
      // 刷新页面以更新评论数
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert(result.error || "评论失败");
    }

    setIsSubmitting(false);
  }

  async function handleSubmitReply(e: React.FormEvent, parentId: string) {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    if (!currentUserId) {
      alert("请先登录");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    const result = await createComment(postId, replyText, parentId);

    if (result.success) {
      setReplyText("");
      setReplyingTo(null);
      
      // 刷新页面以显示新回复
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert(result.error || "回复失败");
    }

    setIsSubmitting(false);
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("确定要删除这条评论吗？")) return;

    const result = await deleteComment(commentId);

    if (result.success) {
      // 从列表中移除
      setComments(comments.filter((c) => c.id !== commentId));
      
      // 刷新页面以更新评论数
      startTransition(() => {
        router.refresh();
      });
    } else {
      alert(result.error || "删除失败");
    }
  }

  return (
    <div
      id="comments-section"
      className="px-4 py-6 bg-surface-light dark:bg-surface-dark"
    >
      <h3 className="text-lg font-bold text-content-light dark:text-content-dark mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          chat_bubble
        </span>
        评论 {commentsCount > 0 ? `(${commentsCount})` : ""}
      </h3>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex gap-2">
          <textarea
            id="comment-input"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              currentUserId
                ? "说说你的看法..."
                : "登录后即可发表评论"
            }
            disabled={!currentUserId || isSubmitting}
            className="flex-1 px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg text-content-light dark:text-content-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
            rows={3}
            maxLength={500}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-subtle-light dark:text-subtle-dark">
            {commentText.length}/500
          </span>
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting || !currentUserId}
            className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "发送中..." : "发送"}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div className="flex items-start gap-3">
                <img
                  src={
                    comment.profiles?.avatar_url ||
                    "https://i.pravatar.cc/150?img=1"
                  }
                  alt={comment.profiles?.username || "用户"}
                  className="w-10 h-10 rounded-full object-cover bg-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-content-light dark:text-content-dark text-sm">
                      {comment.profiles?.username || "匿名用户"}
                    </span>
                    <span className="text-xs text-subtle-light dark:text-subtle-dark">
                      {new Date(comment.created_at).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  <p className="text-content-light dark:text-content-dark text-sm leading-relaxed mb-2">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors"
                    >
                      回复
                    </button>
                    {comment.likes_count > 0 && (
                      <span className="text-subtle-light dark:text-subtle-dark">
                        {comment.likes_count} 赞
                      </span>
                    )}
                    {currentUserId === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        删除
                      </button>
                    )}
                  </div>

                  {/* 回复输入框 */}
                  {replyingTo === comment.id && (
                    <form
                      onSubmit={(e) => handleSubmitReply(e, comment.id)}
                      className="mt-3"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`回复 @${comment.profiles?.username || "用户"}...`}
                          disabled={isSubmitting}
                          className="flex-1 px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-content-light dark:text-content-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                          maxLength={500}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText("");
                          }}
                          className="px-3 py-2 text-sm text-subtle-light dark:text-subtle-dark hover:text-content-light dark:hover:text-content-dark transition-colors"
                        >
                          取消
                        </button>
                        <button
                          type="submit"
                          disabled={!replyText.trim() || isSubmitting}
                          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          发送
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <span className="material-symbols-outlined text-5xl text-subtle-light dark:text-subtle-dark mb-2">
            chat_bubble_outline
          </span>
          <p className="text-subtle-light dark:text-subtle-dark">
            还没有评论，快来抢沙发吧~
          </p>
        </div>
      )}
    </div>
  );
}

