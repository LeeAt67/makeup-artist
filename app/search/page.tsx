"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  searchMakeupPosts,
  getHotSearchKeywords,
  getSearchSuggestions,
} from "@/lib/actions/search";
import type { MakeupPost } from "@/lib/actions/makeup";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<MakeupPost[]>([]);
  const [hotKeywords, setHotKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFaceShape, setSelectedFaceShape] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 分类选项
  const categories = [
    { value: "", label: "全部场景" },
    { value: "daily", label: "日常通勤" },
    { value: "party", label: "派对/音乐节" },
    { value: "business", label: "商务会议" },
    { value: "date", label: "约会" },
    { value: "interview", label: "面试" },
  ];

  // 脸型选项
  const faceShapes = [
    { value: "", label: "全部脸型" },
    { value: "round", label: "圆形脸" },
    { value: "square", label: "方形脸" },
    { value: "oval", label: "鹅蛋脸" },
    { value: "long", label: "长形脸" },
    { value: "heart", label: "心形脸" },
    { value: "diamond", label: "菱形脸" },
  ];

  // 初始化时获取热门关键词
  useEffect(() => {
    async function fetchHotKeywords() {
      const result = await getHotSearchKeywords(10);
      if (result.success) {
        setHotKeywords(result.data);
      }
    }
    fetchHotKeywords();

    // 如果有初始搜索词，执行搜索
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  // 实时搜索建议
  useEffect(() => {
    if (query.trim().length > 0) {
      const timer = setTimeout(async () => {
        const result = await getSearchSuggestions(query);
        if (result.success) {
          setSuggestions(result.data);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  async function performSearch(
    searchQuery: string,
    category?: string,
    faceShape?: string
  ) {
    setIsSearching(true);
    setShowSuggestions(false);

    const result = await searchMakeupPosts(
      searchQuery,
      category || selectedCategory,
      faceShape || selectedFaceShape
    );

    if (result.success) {
      setSearchResults(result.data);
    }

    setIsSearching(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
      // 更新 URL
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  function handleHotKeywordClick(keyword: string) {
    setQuery(keyword);
    performSearch(keyword);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  }

  function handleSuggestionClick(suggestion: string) {
    setQuery(suggestion);
    performSearch(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    if (query.trim()) {
      performSearch(query, category, selectedFaceShape);
    }
  }

  function handleFaceShapeChange(faceShape: string) {
    setSelectedFaceShape(faceShape);
    if (query.trim()) {
      performSearch(query, selectedCategory, faceShape);
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-6">
      {/* 顶部搜索栏 */}
      <header className="sticky top-0 z-20 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-light dark:hover:bg-surface-dark transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-content-light dark:text-content-dark">
                arrow_back
              </span>
            </Link>
            <div className="relative flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-subtle-light dark:text-subtle-dark">
                  search
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="搜索妆容、标签..."
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-content-light dark:text-content-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSearchResults([]);
                      setSuggestions([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark hover:text-content-light dark:hover:text-content-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      close
                    </span>
                  </button>
                )}
              </div>

              {/* 搜索建议下拉 */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-2.5 text-left text-content-light dark:text-content-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark text-sm">
                        search
                      </span>
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isSearching ? "搜索中..." : "搜索"}
            </button>
          </form>

          {/* 筛选选项 */}
          {(query || searchResults.length > 0) && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-1.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-sm text-content-light dark:text-content-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedFaceShape}
                onChange={(e) => handleFaceShapeChange(e.target.value)}
                className="px-3 py-1.5 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-sm text-content-light dark:text-content-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {faceShapes.map((shape) => (
                  <option key={shape.value} value={shape.value}>
                    {shape.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      {/* 主体内容 */}
      <main className="px-4 py-6">
        {/* 搜索结果 */}
        {searchResults.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold text-content-light dark:text-content-dark mb-4">
              搜索结果 ({searchResults.length})
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {searchResults.map((post) => (
                <Link
                  key={post.id}
                  href={`/makeup/${post.id}`}
                  className="group flex flex-col gap-2 transition-all duration-200 ease-in-out"
                >
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-lg"
                    style={{ backgroundImage: `url('${post.cover_image}')` }}
                  />
                  <p className="text-content-light dark:text-content-dark text-sm font-medium line-clamp-2">
                    {post.title}
                  </p>
                  <div className="flex items-center text-xs text-subtle-light dark:text-subtle-dark gap-2">
                    <div className="flex items-center gap-1">
                      <img
                        className="w-4 h-4 rounded-full object-cover bg-gray-200"
                        src={
                          post.profiles?.avatar_url ||
                          "https://i.pravatar.cc/150?img=1"
                        }
                        alt={post.profiles?.username || "用户"}
                      />
                      <span>{post.profiles?.username || "匿名用户"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        favorite_border
                      </span>
                      <span>{post.likes_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : query && !isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-subtle-light dark:text-subtle-dark mb-4">
              search_off
            </span>
            <p className="text-content-light dark:text-content-dark text-lg font-medium mb-2">
              没有找到相关内容
            </p>
            <p className="text-subtle-light dark:text-subtle-dark text-sm">
              换个关键词试试吧
            </p>
          </div>
        ) : (
          /* 热门搜索 */
          <div>
            <h2 className="text-lg font-bold text-content-light dark:text-content-dark mb-4">
              🔥 热门搜索
            </h2>
            <div className="flex flex-wrap gap-2">
              {hotKeywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleHotKeywordClick(keyword)}
                  className="px-4 py-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-content-light dark:text-content-dark text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>

            {/* 搜索历史（可选，需要本地存储） */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-content-light dark:text-content-dark mb-4">
                💡 搜索建议
              </h2>
              <div className="space-y-2">
                {["日系妆容", "欧美妆", "韩系妆容", "复古妆", "清新妆"].map(
                  (suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleHotKeywordClick(suggestion)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-surface-light dark:bg-surface-dark rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                    >
                      <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark">
                        schedule
                      </span>
                      <span className="flex-1 text-left text-content-light dark:text-content-dark">
                        {suggestion}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

