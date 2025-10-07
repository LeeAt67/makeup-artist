"use client";

import { useState } from "react";
import { ProductReview } from "@/lib/actions/products";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface ProductReviewsProps {
  reviews: ProductReview[];
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const displayReviews = showAll ? reviews : reviews.slice(0, 3);

  // 计算评分分布
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <section className="px-4 py-4 bg-surface-light dark:bg-surface-dark mt-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-content-light dark:text-content-dark">
          用户评价
        </h3>
        <div className="flex items-center gap-1">
          <span className="text-amber-500 text-xl">★</span>
          <span className="text-lg font-bold text-content-light dark:text-content-dark">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-subtle-light dark:text-subtle-dark ml-1">
            ({totalReviews})
          </span>
        </div>
      </div>

      {/* 评分分布 */}
      <div className="mb-6 space-y-2">
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center gap-2">
            <span className="text-xs text-subtle-light dark:text-subtle-dark w-8">
              {rating}星
            </span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs text-subtle-light dark:text-subtle-dark w-12 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* 评价列表 */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              {/* 用户信息 */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {review.profiles?.avatar_url ? (
                    <img
                      src={review.profiles.avatar_url}
                      alt={review.profiles.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary text-sm font-medium">
                      {review.profiles?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-content-light dark:text-content-dark">
                    {review.profiles?.username || "匿名用户"}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= review.rating
                              ? "text-amber-500"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-subtle-light dark:text-subtle-dark">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* 评价内容 */}
              {review.content && (
                <p className="text-sm text-content-light dark:text-content-dark mb-2 leading-relaxed">
                  {review.content}
                </p>
              )}

              {/* 评价图片 */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 flex-shrink-0 rounded bg-center bg-cover"
                      style={{ backgroundImage: `url('${image}')` }}
                    />
                  ))}
                </div>
              )}

              {/* 点赞数 */}
              {review.likes_count > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-subtle-light dark:text-subtle-dark">
                  <span className="material-symbols-outlined text-sm">
                    thumb_up
                  </span>
                  <span>{review.likes_count}</span>
                </div>
              )}
            </div>
          ))}

          {/* 查看更多按钮 */}
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded transition-colors"
            >
              {showAll ? "收起评价" : `查看全部 ${reviews.length} 条评价`}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-subtle-light dark:text-subtle-dark">
          <p className="text-sm">暂无评价</p>
        </div>
      )}
    </section>
  );
}

