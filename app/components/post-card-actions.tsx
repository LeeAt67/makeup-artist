"use client";

import { useState } from "react";
import { toggleLike } from "@/lib/actions/makeup";

interface PostCardActionsProps {
  postId: string;
  initialLiked: boolean;
  initialLikesCount: number;
}

export function PostCardActions({
  postId,
  initialLiked,
  initialLikesCount,
}: PostCardActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikesCount);
  const [isLiking, setIsLiking] = useState(false);

  async function handleLike(e: React.MouseEvent) {
    // 阻止事件冒泡，避免触发卡片点击
    e.preventDefault();
    e.stopPropagation();

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
    }

    setIsLiking(false);
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className="flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
    >
      <span
        className={`material-symbols-outlined text-sm ${
          liked ? "text-primary" : "text-subtle-light dark:text-subtle-dark"
        }`}
        style={{
          fontVariationSettings: liked
            ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20"
            : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
        }}
      >
        favorite
      </span>
      <span className="text-xs">{likes}</span>
    </button>
  );
}

