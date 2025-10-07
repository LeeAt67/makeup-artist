"use client";

import { useState, useTransition } from "react";
import { followUser, unfollowUser } from "@/lib/actions/social";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
}

export default function FollowButton({
  userId,
  initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  function handleFollow() {
    startTransition(async () => {
      if (isFollowing) {
        const result = await unfollowUser(userId);
        if (result.success) {
          setIsFollowing(false);
        } else {
          alert(result.error || "取消关注失败");
        }
      } else {
        const result = await followUser(userId);
        if (result.success) {
          setIsFollowing(true);
        } else {
          alert(result.error || "关注失败");
        }
      }
    });
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
        isFollowing
          ? "bg-gray-100 dark:bg-gray-800 text-[var(--content)] hover:bg-gray-200 dark:hover:bg-gray-700"
          : "bg-[var(--primary)] text-white hover:opacity-90"
      } disabled:opacity-50`}
    >
      {isPending ? "..." : isFollowing ? "已关注" : "关注"}
    </button>
  );
}

