"use client";

import { useState } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  cover_image: string;
  likes_count: number;
  views_count: number;
}

interface UserTabsProps {
  userId: string;
  initialPosts: Post[];
  isOwnProfile: boolean;
}

export default function UserTabs({
  userId,
  initialPosts,
  isOwnProfile,
}: UserTabsProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");

  return (
    <div>
      {/* 标签栏 */}
      <div className="bg-[var(--surface)] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "posts"
                ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                : "text-[var(--content-subtle)] hover:text-[var(--content)]"
            }`}
          >
            <span className="material-symbols-outlined text-lg align-middle mr-1">
              grid_on
            </span>
            帖子
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === "likes"
                  ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                  : "text-[var(--content-subtle)] hover:text-[var(--content)]"
              }`}
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">
                favorite
              </span>
              喜欢
            </button>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {activeTab === "posts" && (
          <div>
            {initialPosts.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
                  photo_library
                </span>
                <p className="mt-4 text-[var(--content-subtle)]">
                  还没有发布任何帖子
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {initialPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/makeup/${post.id}`}
                    className="aspect-square relative group overflow-hidden rounded"
                  >
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-4 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">
                            favorite
                          </span>
                          <span>{post.likes_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                          <span>{post.views_count}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && isOwnProfile && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
              favorite_border
            </span>
            <p className="mt-4 text-[var(--content-subtle)]">
              点赞的帖子将显示在这里
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

