"use client";

import { useState } from "react";
import { toggleLike, toggleFavorite } from "@/lib/actions/makeup";
import { useRouter } from "next/navigation";

interface MakeupActionsProps {
  postId: string;
  initialLiked: boolean;
  initialFavorited: boolean;
  likesCount: number;
  commentsCount: number;
}

export function MakeupActions({
  postId,
  initialLiked,
  initialFavorited,
  likesCount,
  commentsCount,
}: MakeupActionsProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [likes, setLikes] = useState(likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  async function handleLike() {
    if (isLiking) return;
    setIsLiking(true);

    // 乐观更新
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));

    const result = await toggleLike(postId);

    if (!result.success) {
      // 回滚
      setLiked(!newLiked);
      setLikes((prev) => (newLiked ? prev - 1 : prev + 1));
      alert(result.error || "操作失败");
    }

    setIsLiking(false);
  }

  async function handleFavorite() {
    if (isFavoriting) return;
    setIsFavoriting(true);

    // 乐观更新
    const newFavorited = !favorited;
    setFavorited(newFavorited);

    const result = await toggleFavorite(postId);

    if (!result.success) {
      // 回滚
      setFavorited(!newFavorited);
      alert(result.error || "操作失败");
    } else {
      // 显示提示
      if (newFavorited) {
        // 可以添加 toast 提示
      }
    }

    setIsFavoriting(false);
  }

  function handleShare() {
    // 复制链接到剪贴板
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert("链接已复制到剪贴板");
      });
    } else {
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("链接已复制到剪贴板");
    }
  }

  function scrollToComments() {
    const commentsSection = document.getElementById("comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
      // 聚焦到评论输入框
      setTimeout(() => {
        const input = document.querySelector<HTMLTextAreaElement>(
          "#comment-input"
        );
        if (input) {
          input.focus();
        }
      }, 500);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 点赞 */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex flex-col items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
        >
          <span
            className={`material-symbols-outlined text-2xl ${
              liked
                ? "text-primary"
                : "text-subtle-light dark:text-subtle-dark"
            }`}
            style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          <span className="text-xs text-subtle-light dark:text-subtle-dark">
            {likes > 0 ? likes : "点赞"}
          </span>
        </button>

        {/* 评论 */}
        <button
          onClick={scrollToComments}
          className="flex flex-col items-center gap-1 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl text-subtle-light dark:text-subtle-dark">
            chat_bubble
          </span>
          <span className="text-xs text-subtle-light dark:text-subtle-dark">
            {commentsCount > 0 ? commentsCount : "评论"}
          </span>
        </button>

        {/* 收藏 */}
        <button
          onClick={handleFavorite}
          disabled={isFavoriting}
          className="flex flex-col items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
        >
          <span
            className={`material-symbols-outlined text-2xl ${
              favorited
                ? "text-amber-500"
                : "text-subtle-light dark:text-subtle-dark"
            }`}
            style={{
              fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            star
          </span>
          <span className="text-xs text-subtle-light dark:text-subtle-dark">
            {favorited ? "已收藏" : "收藏"}
          </span>
        </button>

        {/* 分享 */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl text-subtle-light dark:text-subtle-dark">
            share
          </span>
          <span className="text-xs text-subtle-light dark:text-subtle-dark">
            分享
          </span>
        </button>
      </div>
    </div>
  );
}

